// import multer from 'multer';
// import { storage } from '../config/cloudinary.js';

// // File filter - images only
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
// });

// export default upload;


import multer from 'multer';

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),  // store in buffer, not disk, not cloudinary
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;