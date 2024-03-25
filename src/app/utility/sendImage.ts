import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import config from "../config";
import { TCloudinaryImage } from "../interface";
import fs from 'fs'

cloudinary.config({
    cloud_name: config.imageUpload.cloud_name,
    api_key: config.imageUpload.api_key,
    api_secret: config.imageUpload.api_secret,
});

const uploadImage = async (path: string): Promise<TCloudinaryImage | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(path,
            function (error: Error, result: TCloudinaryImage) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                    fs.unlinkSync(path)

                }
            });
    })
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

export const fileUploader = {
    upload,
    uploadImage
}