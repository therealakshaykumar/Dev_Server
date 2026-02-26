import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS } from "../configs/creds.js";
import path from "path";
import { randomUUID } from "crypto";

export const s3Client = new S3Client({
  region: AWS.AWS_REGION,
  credentials: {
    accessKeyId: AWS.AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS.AWS_SECRET_ACCESS_KEY,
  },
});

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToS3(
  fileBuffer: Buffer,
  originalName: string,
  mimetype: string,
): Promise<UploadResult> {
  const ext = path.extname(originalName);
  const key = `profiles/${randomUUID()}${ext}`;

  const COMMAND = new PutObjectCommand({
    Bucket: AWS.AWS_BUCKET,
    Body: fileBuffer,
    Key: key,
    ContentType: mimetype,
  });

  await s3Client.send(COMMAND);
  const url = `https://${AWS.AWS_BUCKET}.s3.${AWS.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
}

export async function deleteFromS3(key: string): Promise<void> {
    if (!key) return;

    const command = new DeleteObjectCommand({
        Bucket: AWS.AWS_BUCKET,
        Key: key,
    });

    await s3Client.send(command);
}
