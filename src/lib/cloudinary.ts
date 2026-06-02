/**
 * Cloudinary Integration Utility Client
 * Provides client-side unsigned uploads, optimized CDN image delivery transformations,
 * and deletion helpers for Cloudinary.
 */

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

// Check if Cloudinary is configured
export const isCloudinaryConfigured = !!(
  cloudName &&
  uploadPreset &&
  cloudName !== "your_cloud_name_here" &&
  uploadPreset !== "your_unsigned_upload_preset_here"
);

/**
 * Uploads a file (File object or Base64 Data URL) to Cloudinary via unsigned upload preset.
 * Streams progress through XMLHttpRequest.
 */
export const uploadToCloudinary = (
  file: File | string,
  folder: string = "ekaksh-pharma/products",
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      reject(new Error("Cloudinary environment variables are not configured. Please define VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file."));
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // Track upload progress
    if (onProgress && xhr.upload) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          onProgress(percentage);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            secure_url: response.secure_url,
            public_id: response.public_id
          });
        } catch (e) {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        try {
          const errResponse = JSON.parse(xhr.responseText);
          reject(new Error(errResponse?.error?.message || `Cloudinary upload failed with status: ${xhr.status}`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload."));
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    xhr.send(formData);
  });
};

/**
 * Deletes a media asset from Cloudinary using public ID.
 * Note: Unsigned API uploads do not support client-side deletions directly due to security.
 * Under development, this simulates deletion in console. In production, this can call a secure backend.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  console.log(`[Cloudinary Utility] Requested deletion of asset: ${publicId}`);
  
  // Production secure backend configuration example:
  // To perform a secure server-side delete, you can deploy a serverless function:
  //
  // const cloudinary = require('cloudinary').v2;
  // cloudinary.config({ 
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  //   api_key: process.env.CLOUDINARY_API_KEY, 
  //   api_secret: process.env.CLOUDINARY_API_SECRET 
  // });
  // await cloudinary.uploader.destroy(publicId);
  //
  // If your project integrates a backend endpoint, call it here:
  // try {
  //   const res = await fetch('/api/cloudinary/delete', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ publicId })
  //   });
  //   return res.ok;
  // } catch (e) {
  //   console.error("Backend delete failed:", e);
  //   return false;
  // }

  return true; 
};

/**
 * Dynamically parses a Cloudinary CDN URL and inserts performance transformations:
 * f_auto (Automatic WebP/AVIF format based on browser support)
 * q_auto (Automatic compression/quality optimization)
 * w_XXX (Responsive image width)
 */
export const getOptimizedUrl = (url: string, width?: number): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  // Insert format, quality, and resizing parameters
  const transform = width 
    ? `f_auto,q_auto,w_${width},c_limit` 
    : "f_auto,q_auto";

  const uploadStr = "/upload/";
  const uploadIndex = url.indexOf(uploadStr);
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + uploadStr.length);
  const suffix = url.substring(uploadIndex + uploadStr.length);

  return `${prefix}${transform}/${suffix}`;
};
