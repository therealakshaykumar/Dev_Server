var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as cloudinary } from "cloudinary";
import { Cloudinary } from "../configs/creds.js";
cloudinary.config({
    cloud_name: Cloudinary.CLOUDINARY_CLOUD_NAME,
    api_key: Cloudinary.CLOUDINARY_API_KEY,
    api_secret: Cloudinary.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = (buffer, folder = "profile-images") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: "image",
            transformation: [
                { width: 500, height: 500, crop: "fill" },
                { quality: "auto" },
            ],
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        });
        uploadStream.end(buffer);
    });
};
export const deleteFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("Failed to delete image:", error);
    }
});
export default cloudinary;
