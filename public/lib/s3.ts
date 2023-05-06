import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://syd1.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_SPACES_KEY ?? "",
      secretAccessKey: process.env.NEXT_PUBLIC_SPACES_SECRET ?? ""
    }
});

export { s3Client };