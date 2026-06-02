import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Copy, Check, Trash2, RefreshCw } from 'lucide-react';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';

interface CloudinaryUploaderProps {
  currentImage?: string;
  currentPublicId?: string;
  folder?: string;
  theme?: 'light' | 'dark';
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  onClearImage?: () => void;
}

export default function CloudinaryUploader({
  currentImage = '',
  currentPublicId = '',
  folder = 'ekaksh-pharma/products',
  theme = 'dark',
  onUploadSuccess,
  onUploadError,
  onClearImage
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!isCloudinaryConfigured) {
      const errMsg = "Cloudinary is not configured. Please define variables in .env.";
      onUploadError?.(errMsg);
      alert(errMsg);
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      const errMsg = "Image size should be less than 5MB.";
      onUploadError?.(errMsg);
      alert(errMsg);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // If we already have a custom Cloudinary image uploaded, delete it first
      if (currentPublicId) {
        await deleteFromCloudinary(currentPublicId);
      }

      const response = await uploadToCloudinary(file, folder, (p) => {
        setProgress(p);
      });

      onUploadSuccess(response.secure_url, response.public_id);
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      const errMsg = err?.message || "Failed to upload image to Cloudinary.";
      onUploadError?.(errMsg);
      alert(errMsg);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [currentPublicId, folder, onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isUploading
  });

  const handleCopyUrl = async () => {
    if (!currentImage) return;
    try {
      await navigator.clipboard.writeText(currentImage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy URL:", e);
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Are you sure you want to delete this image from Cloudinary?")) {
      try {
        if (currentPublicId) {
          await deleteFromCloudinary(currentPublicId);
        }
        onClearImage?.();
      } catch (err) {
        console.error("Error deleting Cloudinary image:", err);
        alert("Failed to delete image.");
      }
    }
  };

  // Theme variable toggles
  const textClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-700';
  const bgClass = theme === 'dark' ? 'bg-slate-900/60' : 'bg-slate-50';
  const borderClass = theme === 'dark' ? 'border-slate-800' : 'border-slate-200';

  return (
    <div className={`space-y-4`}>
      {/* 1. Drag & Drop Zone / Preview Mode */}
      {currentImage ? (
        // Preview State
        <div className={`p-4 rounded-2xl border ${borderClass} ${bgClass} flex flex-col sm:flex-row items-center gap-4`}>
          <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-sm">
            <img src={currentImage} alt="Uploaded asset preview" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex-1 w-full min-w-0 space-y-2 text-center sm:text-left">
            <div>
              <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider block">Uploaded Asset CDN URL</span>
              <span className={`text-xs ${textClass} truncate block font-mono mt-0.5 select-all`}>{currentImage}</span>
              {currentPublicId && (
                <span className="text-[9px] text-slate-500 font-medium block mt-0.5">ID: {currentPublicId}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
              
              {/* Replace trigger */}
              <div {...getRootProps()} className="inline-block">
                <input {...getInputProps()} />
                <button
                  type="button"
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isUploading ? "animate-spin" : ""} />
                  Replace
                </button>
              </div>

              <button
                type="button"
                onClick={handleDeleteImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/30 text-rose-400 hover:text-rose-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Dropzone State
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[140px] text-center
            ${isDragActive 
              ? 'border-teal-400 bg-teal-500/5' 
              : theme === 'dark' 
                ? 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/50' 
                : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/50'
            } ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 mb-3 shadow-inner shadow-teal-500/5">
            <UploadCloud size={28} className={isDragActive ? "animate-bounce" : ""} />
          </div>
          <p className={`text-xs font-bold ${textClass} tracking-wide`}>
            {isDragActive ? "Drop the file here..." : "Drag & Drop Image"}
          </p>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[240px] leading-normal font-light">
            Supports JPEG, PNG, WebP or SVG (max 5MB). Click to browse device.
          </p>
        </div>
      )}

      {/* 2. Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-teal-400 font-bold uppercase tracking-wider">
            <span>Uploading to Cloudinary CDN...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-150 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
