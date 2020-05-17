const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = async (event, context) => {
  console.log(event);

  const sqsParams = {
    MessageBody: `Entering the event queue`,
    QueueUrl: process.env.QUEUE_URL,
    DelaySeconds: 30

  };
  const response = await sqs.sendMessage(sqsParams).promise();
  console.log(response);

  return { status: 200, body: 'It worked!' };
}