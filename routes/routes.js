module.exports=
function(express,app,fs,os,formidable,gm,io,AWS,s3,uploadParams,path,bucket){

var db=require("../db/dynamo_select.js");
//Creating a socket to basically display a status message
var Sockets;
io.on('connection',function(socket){
	Sockets = socket;

});

var router=express.Router();


router.get('/',function(req,res,next){
	res.render('index',{host:app.get('host'),bucket:bucket});  
});

router.post('/upload',function(req,res,next){
	//To manage he file upload
	function generateFilename(filename){
		var ext_regex = /(?:\.([^.]+))?$/;
		var ext = ext_regex.exec(filename)[1];
		var date = new Date().getTime();//What  getTime() does is that it gets the total number of milliseconds from 1 Jan 1970 to present time
		var charBank = "abcdefghijklmnopqrstuvwxyz";
		var fstring = '';
		for(var i = 0; i < 15; i++){
			fstring += charBank[parseInt(Math.random()*26)];
		}
		return (fstring += date + '.' + ext);
	}
	var tmpFile,nfile,fname;//nfile will contain the complete path to the new file , fname will be used to generate a random filename to store in s3bucket, tmpFile will contain the complete path to the file that was uploaded  
	var newForm=new formidable.IncomingForm();//The file is recieved using the formidable module
		newForm.keepExtensions=true;
		newForm.parse(req,function(err,fields,files){
			tmpFile = files.upload.path;
			fname = generateFilename(files.upload.name);
			nfile = os.tmpdir() + '\\' + fname;//os.tmpDir() give access to the temporary directory where all the temporary files 
			//are stored once they are recieved back at the server end
			console.log(nfile);
			res.writeHead(200,{'Contet-type':'text/plain'});
			res.end();
		});

		newForm.on('end', function(){
			//The fs.rename function renames the uploaded file to its random name with the full path 
			//of the directory in the server where it is going to be stored

			fs.rename(tmpFile, nfile, function(){
				//Resize the image and upload this file into the S3Bucket
				gm(nfile).resize(300).write(nfile,function(){//300 is the width of the image to make sure that height is automatiacally calculated to ensure that aspect ratio of image is preserved
					//Upload to the s3 S3Bucket	

					var fileStream = fs.createReadStream(nfile);
					fileStream.on('error', function(err) {
					console.log('File Error', err);
					});
					uploadParams.Body = fileStream;
					uploadParams.Key = path.basename(nfile);

					// call S3 to retrieve upload file to specified bucket
					s3.upload (uploadParams, function (err, data) {
  						if (err) {
    						console.log("Error", err);
  						} if (data) {
    						console.log("Upload Success", data.Location);
    						
    						db.dbWrite(fname);

								Sockets.emit('status',{'msg':'Saved!!','delay':3000});
								Sockets.emit('doUpdate',{});

								//Delete the local file
								fs.unlink(nfile,function(){
									console.log('Local File Deleted!');
								});
  						}
					});
				}); 
			}); 
		});

});

router.get('/getimages',function(req,res,next){
	console.log("get images was called");
    db.dbReadAndSort(function(data){
    	//console.log("readdata",data);
    	res.send(data);
    });
});

router.get('/voteup/:id', function(req,res,next){
	db.dbUpdate(req.params.id,function(data){
		console.log(data);
		var votes = JSON.parse(data);
		res.send(200,{votes:votes.Attributes.votes});
	});

});

app.use('/',router);

}