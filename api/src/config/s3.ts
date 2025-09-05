export const s3Config = () => ({
  awsConfig: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION/*'eu-west-3'*/,
    // ... any options you want to pass to the AWS instance
  },
  bucket: process.env.AWS_BUCKET,
  basePath: 'base',
  fileSize: 1 * 1024 * 1024,
});

export default s3Config();
