	var express=require('express'),
	path=require('path'),
	config=require('./config/config.js'),
	fs = require('fs'),//The file system module
	os = require('os'),//the operating system module 
	formidable = require('formidable'), //This module helps in posting 
	gm = require('gm'),
	AWS = require('aws-sdk'),
	path = require('path');
	//mongoose = require('mongoose').connect(config.dbUrl);


var app=express();

app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');

app.use(express.static(path.join(__dirname,'public')));
app.set('port',process.env.PORT|| 3000);
console.log("Port",process.env.PORT);

app.set('host',config.host);

//Creating the knox client t interact with the s3 bucket we had created earlier
/*//Access keys are required for any web application to access a particular aws account
var knoxClient=knox.createClient({
	key:config.S3AccessKey,
	secret:config.S3Secret,
	bucket:config.S3Bucket
});
console.log(knoxClient);
*/
// Set the region 
AWS.config.update({
	accessKeyId:config.S3AccessKey,
	secretAccessKey:config.S3Secret,
	region: config.S3Region});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
var uploadParams = {Bucket:config.S3Bucket , Key: '', Body: ''};
var server=require('http').createServer(app);
var io=require('socket.io')(server);

require('./routes/routes.js')(express,app,fs,os,formidable,gm,io,AWS,s3,uploadParams,path,config.S3Bucket); 


server.listen(app.get('port'),function(){
	console.log("Photogrid working at port: "+app.get('port'));
});
