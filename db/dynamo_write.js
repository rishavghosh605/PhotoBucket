var AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId:'AKIAJ3DSWJNZMKD5J6GA',
	secretAccessKey:'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',
  	region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "images";

var filename = "aw.jpg";
var votes = 1;

var params = {
    TableName:table,
    Item:{
        "filename": filename,
        "votes": votes
    }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});