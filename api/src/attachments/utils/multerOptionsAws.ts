import { extname } from "path";
import { memoryStorage } from "multer";
import { HttpException, HttpStatus } from "@nestjs/common";

// Multer configuration
export const multerConfig = {
  dest: './public/uploads'/*process.env.UPLOAD_LOCATION*/,
};

// Multer upload options
export const multerOptionsAws = {
  // Enable file size limits
  /*limits: {
    fileSize: +process.env.MAX_FILE_SIZE,
  },*/
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi|wmv|mov|webm)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  // Storage properties
  storage: memoryStorage(),
};
