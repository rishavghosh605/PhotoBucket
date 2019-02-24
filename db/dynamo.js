var AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId:'AKIAJ3DSWJNZMKD5J6GA',
	secretAccessKey:'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',
  region: "us-east-2"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "singleimages",
    KeySchema: [       
        { AttributeName: "filename", KeyType: "HASH"},  //Partition key
        { AttributeName: "votes", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "filename", AttributeType: "S" },
        { AttributeName: "votes", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
