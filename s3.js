// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
console.log("env",process.env.AWS_PROFILE);

// Set the region 
AWS.config.update({
	accessKeyId:'AKIAJ3DSWJNZMKD5J6GA',
	secretAccessKey:'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',
	region: 'us-east-2'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
// call S3 to retrieve upload file to specified bucket
var uploadParams = {Bucket: 'photogridcloud', Key: '', Body: ''};
var file = 'C:\\Users\\HP\\photogrid\\public\\images\\someimage.jpg';

// Configure the file stream and obtain the upload parameters
var fs = require('fs');
var fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  console.log('File Error', err);
});
uploadParams.Body = fileStream;
var path = require('path');
uploadParams.Key = path.basename(file);
// call S3 to retrieve upload file to specified bucket
s3.upload (uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }
});