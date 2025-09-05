import { diskStorage } from 'multer';
import { extname } from 'path';

// Multer configuration
export const multerConfig = {
  dest: './public/uploads'/*process.env.UPLOAD_LOCATION*/,
};

export const multerOptionsLocal = {

  storage: diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    console.log('Uploading file:', file.originalname, 'MIME:', file.mimetype);
    cb(null, true); // Allow all file types
  },
};