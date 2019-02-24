var AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId:'AKIAJ3DSWJNZMKD5J6GA',
    secretAccessKey:'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',
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

images={};
var params = {
    TableName: "demoimagess",
    ProjectionExpression: "filename,votes"
    //FilterExpression: "#yr between :start_yr and :end_yr",
    /*ExpressionAttributeNames: {
        "#yr": "year",
    },
    ExpressionAttributeValues: {
         ":start_yr": 1950,
         ":end_yr": 1959 
    }*/
};

console.log("Scanning images table.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(image) {
           console.log(
                image.filename + ": ",
                image.votes);
            images[image.filename]=image.votes;
        });
        console.log((images));
/*// Create items array
var items = Object.keys(images).map(function(key) {
  return [key, images[key]];
});

// Sort the array based on the second element
items.sort(function(first, second) {
  return second[1] - first[1];
});

// Create a new array with only the first 5 items
console.log(items);*/
console.log("data",data.Items);

 
console.log("KJK",sortJsonArray(data.Items, 'votes','des'));
    var array=[],obj=images;
for(a in obj){
 array.push([a,obj[a]])
}
array.sort(function(a,b){return a[1] - b[1]});
array.reverse();
console.log("A",array);
for(var i = 0;i<array.length;i++)
                     
{
console.log(i,":",array[i]);
}
        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}