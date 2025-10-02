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

    // TODO allow chose between local & cloudinary based on .env
    return {
      url: `${process.env.APP_URL}/uploads/${file.filename}`,
      name,
      message: 'Success',
    };
  }
}
