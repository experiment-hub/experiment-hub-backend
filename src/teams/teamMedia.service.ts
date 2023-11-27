import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeamMediaService {
  private readonly s3: AWS.S3;

  constructor(private configService: ConfigService) {
    const spacesEndpoint = new AWS.Endpoint(
      configService.get<string>('SPACES_ENDPOINT'),
    );

    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint.href,
      credentials: new AWS.Credentials({
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      }),
    });
  }

  async uploadFileToSpaces(file: Express.Multer.File) {
    const params = {
      Bucket: this.configService.get<string>('SPACES_BUCKET_NAME'),
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
