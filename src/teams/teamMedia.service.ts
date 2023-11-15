import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeamMediaService {
  private readonly s3: AWS.S3;

  constructor() {
    const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);

    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint.href,
      credentials: new AWS.Credentials({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }),
    });
  }

  async uploadFileToSpaces(file: Express.Multer.File) {
    const params = {
      Bucket: process.env.SPACES_BUCKET_NAME,
      ACL: 'public-read',
      Body: file.buffer,
      Key: `${uuidv4()}-${file.originalname}`,
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location;
    } catch (error) {
      throw error;
    }
  }
}
