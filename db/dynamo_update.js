var AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId:'AKIAJ3DSWJNZMKD5J6GA',
    secretAccessKey:'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',
  region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient()

var table = "images";

var filename = "aw.jpg";



// Increment an atomic counter

var params = {
    TableName:table,
    Key:{
        "filename": filename
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
    }
});