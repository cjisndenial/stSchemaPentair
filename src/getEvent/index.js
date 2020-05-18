const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  //console.log(event);

  try {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: "index.html"
    };
    var index = await s3.getObject(params).promise();
  } catch (error) {
      console.log(error);
      return;
  }
  //console.log(index);

  const response ={ 
    "statusCode": 200, 
    "headers": {
      "Content-Type": index.ContentType
    },
    "body": index.Body.toString() 
  };
  //console.log(response);
  
  return response;
}