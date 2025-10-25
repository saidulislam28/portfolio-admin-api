// import { diskStorage } from 'multer';
// import { extname } from 'path';

// // Multer configuration
// export const multerConfig = {
//   dest: './public/uploads',
// };

// export const multerOptionsLocal = {

//   storage: diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     console.log('Uploading file:', file.originalname, 'MIME:', file.mimetype);
//     cb(null, true); // Allow all file types
//   },
// };

import multer from 'multer';
import { extname } from 'path';

// Multer configuration (keep for reference, not used for storage path anymore)
export const multerConfig = {
  dest: process.env.UPLOAD_LOCATION || './public/uploads',
};

// ✅ Use memory storage (Vercel-safe)
export const multerOptionsLocal = {
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    console.log('Uploading file:', file.originalname, 'MIME:', file.mimetype);
    cb(null, true);
  },
};
