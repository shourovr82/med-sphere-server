/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import httpStatus from 'http-status';
import multer from 'multer';
import config from '../config';
import ApiError from '../errors/ApiError';
import { ICloudinaryResponse, IUploadFile } from '../interfaces/file';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.cloud_api_key,
  api_secret: config.cloudinary.cloud_api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// upload middleware with fileValidator
const upload = multer({ storage: storage });

const uploadImageToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    if (file === undefined) {
      reject(new ApiError(httpStatus.BAD_REQUEST, 'Image is required !!'));
    } else if (file) {
      cloudinary.uploader.upload(
        file.path,
        {
          folder: 'med-sphere',
        },
        (error: any, result: any) => {
          fs.unlinkSync(file.path);
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    }
  });
};

export const FileUploadHelper = {
  uploadImageToCloudinary,
  upload,
};
