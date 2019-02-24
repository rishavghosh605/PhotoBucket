    var config=require('../config/config.js'),
        AWS = require("aws-sdk"),
        sortJsonArray = require('sort-json-array');

AWS.config.update({
    accessKeyId:'AKIAJ3DSWJNZMKD5J6GA',
    secretAccessKey:'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',
    region: "us-east-2"
});

var table = config.dbTable;
var docClient = new AWS.DynamoDB.DocumentClient();

function dbWrite(filename)
{

	var votes = 0;
	var params = {
    	TableName:table,
    	Item:{
            "id" : ""+Date.now(),
            "_id": ""+Date.now(),
        	"filename": filename,
        	"votes": votes
	    }
	};

	console.log("Adding a new item...");
	docClient.put(params, function(err, data) {
    	if (err) {
        	console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    	}
    	else {	
        	console.log("Added item:", JSON.stringify(data, null, 2));
    	}
	});
}

function dbUpdate(id,fn)
{
    console.log(id);
	var params = {
    	TableName:table,
    	Key:{
        	"id": id,
            "_id":id
    	},
    	UpdateExpression: "set votes = votes + :val",
    	ExpressionAttributeValues:{
        	":val": 1
    	},
    	ReturnValues:"UPDATED_NEW"
	};

	console.log("Updating the item...");
	docClient.update(params, function(err, data) {
    	if (err) {
        	console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
        	console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            fn(JSON.stringify(data));
    	
        }	
	});
}

function dbReadAndSort(fn)
{
	var params = {
    TableName: table,
    ProjectionExpression: "id,filename,votes"
	};

	console.log("Scanning images table.");
	docClient.scan(params, onScan);

	function onScan(err, data) {
    	if (err) {
        	console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
        	// print all the movies
        	console.log("Scan succeeded.",data.Items);
            var sort = sortJsonArray(data.Items, 'votes','des');
            fn(JSON.stringify(sort));
            console.log("sort",sort);
    	    // continue scanning if we have more movies, because
        	// scan can retrieve a maximum of 1MB of data*/
        	if (typeof data.LastEvaluatedKey != "undefined") {
            	console.log("Scanning for more...");
            	params.ExclusiveStartKey = data.LastEvaluatedKey;
            	docClient.scan(params, onScan);
        	}
    	}
	}
}
module.exports = {
					dbWrite,
					dbUpdate,
					dbReadAndSort
				 }
