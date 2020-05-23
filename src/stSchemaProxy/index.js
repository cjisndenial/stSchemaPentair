const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();

exports.handler = async (event, context) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event));
  
  // To Do?  check auth token here?  Maybe harder inside the ST library?  Will have to see.
 
  // Pass the stSchema request out of the HttpApi event body to the stSchema lambda function.  
  const params = {
    FunctionName: process.env.FUNCTION_NAME,
    InvocationType: "RequestResponse",
    Payload: event.body
  };

  console.log(params);

  try {
    const result = await lambda.invoke(params).promise();
    console.log(result);
    return result.Payload;
  } catch (error) {
    console.error(JSON.stringify(error));
    return new Error(`Error calling stSchema: ${JSON.stringify(error)}`);
  }
};
