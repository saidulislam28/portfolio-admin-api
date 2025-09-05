import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { AttachmentsService } from "./attachments.service";
import { multerOptionsLocal } from "./utils/multerOptionsLocal";



@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) { }

  /*
  * upload to S3 & return the url
  * */

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', multerOptionsLocal))
  async uploadImage(
    @UploadedFile() file,
    @Body('name') name: string,
    @Req() req: Request
  ) {

    console.log('request reached: attachements/upload-image', file)

    if (process.env.NODE_ENV === 'development') {
      return {
        url: `${process.env.APP_URL}/uploads/${file.filename}`,
        name,
        message: 'Success',
      };
    } else {
      const uploaded: any = await this.attachmentsService.upload(file);
      if (uploaded) {
        return {
          url: uploaded?.Location,
          name,
          message: 'Success',
        };
      } else {
        throw new Error('Failed to upload file');
      }
    }
  }
}
