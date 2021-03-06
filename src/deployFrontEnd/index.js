const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const cfnCR = require('cfn-custom-resource');
const mime = require('mime-types');
const recursiveReaddir = require('recursive-readdir');

const s3 = new AWS.S3();

exports.handler = async message => {
  try {
    await uploadStaticContent();

    // Send success signal back to CloudFormation
    await cfnCR.sendSuccess('deployFrontend', {}, message);

    console.log('Succeeded in uploading site content!')
  } catch (err) {
    console.error('Failed to upload site content:');
    console.error(err);

    // Send error message back to CloudFormation
    await cfnCR.sendFailure(err.message, message);

    // Re-throw error to ensure invocation is marked as a failure
    throw err;
  }
};

// Upload site content from 'static' directory
async function uploadStaticContent() {
  // List files in 'static' directory
  const files = await recursiveReaddir('static');

  // Upload files asynchronously to frontend content object store
  const promises = files.map(file => s3.putObject({
    Bucket: process.env.BUCKET_NAME,
    Key: path.relative('static', file),
    Body: fs.createReadStream(file),
    ContentType: mime.lookup(file) || 'application/octet-stream',
    ACL: 'public-read'
  }).promise());

  await Promise.all(promises);
}