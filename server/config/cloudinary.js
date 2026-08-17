// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Configure cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure multer storage for cloudinary
// export const storage = new CloudinaryStorage({
//   cloudinary,
//   folder: 'smart-lost-found',
//   allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
//   transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
// });

// export default cloudinary;

// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// const cloudinaryV2 = cloudinary.v2;

// // Configure cloudinary
// cloudinaryV2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure multer storage for cloudinary
// export const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryV2,   // ← must pass .v2 explicitly
//   params: {
//     folder: 'smart-lost-found',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
//   },
// });

// export default cloudinaryV2;

// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;

import { v2 as cloudinary } from 'cloudinary';

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

export default configureCloudinary;