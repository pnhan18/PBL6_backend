import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const S3Config = {
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: "admin123",
  },
  forcePathStyle: true,
};

const s3 = new S3Client(S3Config);

export { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand };
