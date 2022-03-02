const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage }= require('multer-storage-cloudinary');
const res = require('express/lib/response');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'node_shop',
      format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });
  const parser = multer({storage});
  
  // const uploadFile = async(image) => {
  //   const response = await cloudinary.uploader.upload(image);
  //     return res.secure_url
  // }
  
  module.exports = parser;