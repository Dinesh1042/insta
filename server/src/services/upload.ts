import { v2 as cloudinary } from 'cloudinary';
import DataURIParser from 'datauri/parser';

cloudinary.config({
  secure: true,
});

const getDataURI = (file: Express.Multer.File) => {
  return new DataURIParser().format(file.originalname, file.buffer)
    .content as string;
};

const upload = (file: Express.Multer.File) => {
  const fileContent = getDataURI(file);
  return cloudinary.uploader
    .upload(fileContent, {
      folder: 'insta',
      filename_override: `${file.originalname}_${new Date().getTime()}`,
      resource_type: 'auto',
    })
    .then((response) => response.secure_url);
};

const uploadPosts = (medias: Express.Multer.File[]) => {
  return Promise.all(medias.map((media) => upload(media)));
};

export default {
  upload,
  uploadPosts,
};
