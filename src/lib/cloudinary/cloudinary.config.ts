/**
 * Cloudinary SDK configuration — server-only.
 * Used exclusively for delete operations via Server Actions.
 * Never import this file in client components.
 *
 * Upload is handled client-side via CldUploadWidget (next-cloudinary).
 */
import { v2 } from "cloudinary";

v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { v2 as cloudinary } from "cloudinary";
