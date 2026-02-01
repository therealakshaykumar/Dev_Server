import { v2 as cloudinary } from "cloudinary";
import { Cloudinary } from "../configs/creds.js";

cloudinary.config({
    cloud_name: Cloudinary.CLOUDINARY_CLOUD_NAME,
    api_key: Cloudinary.CLOUDINARY_API_KEY,
    api_secret: Cloudinary.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string = "profile-images"
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                transformation: [
                    { width: 500, height: 500, crop: "fill" },
                    { quality: "auto" },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );

        uploadStream.end(buffer);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Failed to delete image:", error);
    }
};

export default cloudinary;