"use client";

import { useRef, useState, useCallback } from "react";
import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";
const MAX_IMAGES = 25;
const MAX_SIZE_MB = 10;

interface Category {
  id: string;
  name: string;
}

interface UploadModalProps {
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

type MediaType = "image" | "video";

interface ImageFile {
  file: File;
  preview: string;
  error?: string;
}

function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/,
    /^https?:\/\/youtu\.be\/[\w-]{11}/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{11}/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]{11}/,
  ];
  return patterns.some((p) => p.test(url.trim()));
}

export default function UploadModal({ categories, onClose, onSuccess }: UploadModalProps) {
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [ytError, setYtError] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Image file validation ──────────────────────────────────────────────────

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = arr.slice(0, remaining);

    const validated: ImageFile[] = toAdd.map((file) => {
      const sizeMB = file.size / (1024 * 1024);
      const isImage = file.type.startsWith("image/");
      let error: string | undefined;
      if (!isImage) error = "Not an image file";
      else if (sizeMB > MAX_SIZE_MB) error = `Too large (${sizeMB.toFixed(1)}MB > 10MB)`;
      return {
        file,
        preview: URL.createObjectURL(file),
        error,
      };
    });

    setImages((prev) => [...prev, ...validated]);
  }, [images.length]);

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // drag-drop
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // ── YouTube validation ─────────────────────────────────────────────────────

  const handleYtChange = (val: string) => {
    setYoutubeUrl(val);
    if (val.trim() === "") { setYtError(""); return; }
    setYtError(isValidYouTubeUrl(val) ? "" : "Invalid YouTube URL");
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const canSubmit = () => {
    if (!title.trim()) return false;
    if (!categoryId) return false;
    if (mediaType === "video") {
      return youtubeUrl.trim() !== "" && isValidYouTubeUrl(youtubeUrl);
    }
    const valid = images.filter((i) => !i.error);
    return valid.length > 0;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setUploading(true);
    setUploadError("");
    setProgress(0);

    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("mediaType", mediaType);
      formData.append("category", selectedCat?.name ?? "");

      if (mediaType === "video") {
        formData.append("url", youtubeUrl.trim());
      } else {
        const validImages = images.filter((i) => !i.error);
        validImages.forEach((img) => formData.append("images", img.file));
      }

      await axios.post(`${SERVER_URL}/api/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setUploadError(err.response?.data?.message ?? err.message ?? "Upload failed");
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const validImageCount = images.filter((i) => !i.error).length;
  const invalidImageCount = images.filter((i) => !!i.error).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Upload Media</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add photos or a YouTube video to the gallery</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Media type toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Media Type
            </label>
            <div className="flex gap-2">
              {(["image", "video"] as MediaType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setMediaType(t); setImages([]); setYoutubeUrl(""); setYtError(""); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    mediaType === t
                      ? t === "image"
                        ? "bg-teal-50 border-teal-400 text-teal-700"
                        : "bg-violet-50 border-violet-400 text-violet-700"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {t === "image" ? "📷 Images" : "🎬 YouTube Video"}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2025"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white capitalize"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="capitalize">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* ── Image Upload ── */}
          {mediaType === "image" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Images <span className="text-red-400">*</span>
                </label>
                <span className={`text-xs font-medium ${images.length >= MAX_IMAGES ? "text-red-500" : "text-gray-400"}`}>
                  {images.length} / {MAX_IMAGES} selected
                </span>
              </div>

              {/* Drop zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-teal-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Click to select or drag & drop images
                  </p>
                  <p className="text-xs text-gray-400">
                    Max {MAX_IMAGES} images · Max {MAX_SIZE_MB}MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              )}

              {/* Preview grid */}
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 ${
                        img.error ? "border-red-400" : "border-transparent"
                      }`}
                      style={{ aspectRatio: "1" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/* Error overlay */}
                      {img.error && (
                        <div className="absolute inset-0 bg-red-500/70 flex items-end p-1">
                          <p className="text-[9px] text-white font-semibold leading-tight">{img.error}</p>
                        </div>
                      )}
                      {/* Remove button */}
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {images.length > 0 && (
                <div className="flex gap-3 mt-2">
                  {validImageCount > 0 && (
                    <span className="text-xs text-teal-600 font-medium">✓ {validImageCount} valid</span>
                  )}
                  {invalidImageCount > 0 && (
                    <span className="text-xs text-red-500 font-medium">✗ {invalidImageCount} invalid (will be skipped)</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── YouTube URL ── */}
          {mediaType === "video" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                YouTube URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => handleYtChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  ytError
                    ? "border-red-300 focus:ring-red-400"
                    : youtubeUrl && !ytError
                    ? "border-green-300 focus:ring-green-400"
                    : "border-gray-200 focus:ring-violet-400"
                }`}
              />
              {ytError && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {ytError}
                </p>
              )}
              {youtubeUrl && !ytError && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid YouTube URL
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Accepted: youtube.com/watch, youtu.be, youtube.com/shorts
              </p>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {uploadError}
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-gray-50/50">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || uploading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}