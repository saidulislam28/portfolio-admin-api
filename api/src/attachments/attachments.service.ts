import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import { v4 as uuid } from 'uuid';

import { PrismaService } from "../prisma/prisma.service";

export const UPLOAD_WITH_ACL = 'public-read'

@Injectable()
export class AttachmentsService {
  constructor(private prismaService: PrismaService,
    private readonly configService: ConfigService,) { }


  async upload(file) {
    const { originalname } = file;
    const bucketS3 = this.configService.get('s3.bucket');
    const mime = file.mimetype;
    try {
      const uploadResult = await this.uploadS3(file.buffer, bucketS3, originalname, mime);
      return uploadResult;
    } catch (e) {
      return null;
    }
  }

  async create(data, file: any) {
    const url = `${process.env.APP_URL}/uploads/${file.filename}`
    const resp = await this.prismaService.attachment.create({
      data: {
        // desc: data.desc,
        url,
        // user: { connect: { id: data.user_id } }
      }
    });

    return resp;
  }

  async uploadS3(file, bucket, name, mime) {
    const s3 = this.getS3();
    // const params = {
    //   Bucket: bucket,
    //   Key: `${uuid()}-${name}`,
    //   Body: file,
    //   ContentType: mime
    // };
    return new Promise((resolve, reject) => {
      // s3.upload(params, (err, data) => {
      //   if (err) {
      //     // Logger.error(err);
      //     reject(err.message);
      //   }
      //   resolve(data);
      // });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: this.configService.get('s3.awsConfig.accessKeyId'),
      secretAccessKey: this.configService.get('s3.awsConfig.secretAccessKey'),
    });
  }

  async remove(id: number) {
    try {
      await this.prismaService.attachment.delete({ where: { id } })
    } catch (e) {
      /* if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email'
          )
        }
      }*/
      return { success: false };
      // throw e
    }
    return { success: true };
  }
}
