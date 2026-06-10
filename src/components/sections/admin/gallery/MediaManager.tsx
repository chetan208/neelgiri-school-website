"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import MediaCard from "./components/MediaCard";
import UploadModal from "./components/UploadModal";
import DeleteConfirm from "./components/DeleteConfirm";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface MediaItem {
  id: string;
  title: string;
  mediaType: "image" | "video";
  url: string;
  publicId: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

interface ApiResponse {
  data?: MediaItem[];
  items?: MediaItem[];
  totalItems: number;
  totalPages: number;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function GalleryManagerPage() {
  // Data
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // UI state
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Modals
  const [showUpload, setShowUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // ── Toast helper ─────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch categories ──────────────────────────────────────────────────────────

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get<Category[]>(`${SERVER_URL}/api/media/categories`);
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      // non-fatal
    }
  }, []);

  // ── Fetch media page ──────────────────────────────────────────────────────────

  const fetchPage = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const { data: json } = await axios.get<ApiResponse>(`${SERVER_URL}/api/media/`, {
        params: { page: pageNum },
      });

      const items: MediaItem[] = json.data ?? json.items ?? [];
      setAllItems((prev) => (pageNum === 1 ? items : [...prev, ...items]));
      setTotalItems(json.totalItems);
      setTotalPages(json.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : "Failed to load media"
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
      loadingRef.current = false;
    }
  }, []);

  // ── Init ──────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchCategories();
    fetchPage(1);
  }, [fetchCategories, fetchPage]);

  // ── Infinite scroll ───────────────────────────────────────────────────────────

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && page < totalPages) {
          fetchPage(page + 1);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, totalPages, fetchPage]);

  // ── Filtered items ────────────────────────────────────────────────────────────

  const filteredItems = allItems.filter((item) => {
    if (filterType !== "all" && item.mediaType !== filterType) return false;
    if (filterCategory !== "all" && item.categoryId !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Selection ─────────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(filteredItems.map((i) => i.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const isAllSelected =
    filteredItems.length > 0 && filteredItems.every((i) => selected.has(i.id));

  // ── Delete ────────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    // Collect publicIds of selected items (videos have publicId: null)
    const selectedItems = allItems.filter((i) => selected.has(i.id));
    const publicIds = selectedItems
      .map((i) => i.publicId)
      .filter((pid): pid is string => pid !== null && pid !== "");

    try {
      if (publicIds.length > 0) {
        await axios.post(`${SERVER_URL}/api/media/delete`, { publicIds });
      }
      // Remove from local state
      setAllItems((prev) => prev.filter((i) => !selected.has(i.id)));
      setTotalItems((prev) => prev - selected.size);
      clearSelection();
      setShowDeleteConfirm(false);
      showToast(`${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} deleted successfully`, "success");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Delete failed";
      setDeleteError(msg);
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Upload success ────────────────────────────────────────────────────────────

  const handleUploadSuccess = () => {
    setShowUpload(false);
    // Reset to page 1 and refetch all
    setAllItems([]);
    setInitialLoad(true);
    setSelected(new Set());
    fetchPage(1);
    showToast("Media uploaded successfully!", "success");
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white flex items-center gap-2 transition-all ${
          toast.type === "success" ? "bg-teal-600" : "bg-red-500"
        }`}>
          {toast.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top row */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Gallery Manager</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {initialLoad ? "Loading…" : `${totalItems} total · ${allItems.length} loaded`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete button — shown when selection exists */}
              {selected.size > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete ({selected.size})
                </button>
              )}

              {/* Upload button */}
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2 pb-3">
            {/* Search */}
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-4 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 w-36 sm:w-48"
              />
            </div>

            {/* Type filter */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {["all", "image", "video"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                    filterType === t
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "all" ? "All" : t === "image" ? "📷 Photos" : "🎬 Videos"}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filterCategory === "all"
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all ${
                    filterCategory === cat.id
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-teal-300 hover:text-teal-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* Selection toolbar */}
        {filteredItems.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={isAllSelected ? clearSelection : selectAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                isAllSelected ? "bg-teal-500 border-teal-500" : "border-gray-400"
              }`}>
                {isAllSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {isAllSelected ? "Deselect All" : "Select All"}
            </button>

            {selected.size > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-teal-600 font-semibold">{selected.size} selected</span>
                <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                  Clear
                </button>
              </>
            )}

            <span className="ml-auto text-xs text-gray-400">
              Showing {filteredItems.length} of {allItems.length} loaded
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-600">
              {error}
            </div>
            <button onClick={() => fetchPage(1)} className="mt-3 block mx-auto text-sm text-teal-600 underline">
              Try again
            </button>
          </div>
        )}

        {/* Delete error */}
        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {deleteError}
          </div>
        )}

        {/* Skeleton */}
        {initialLoad && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse" style={{ aspectRatio: "4/3" }} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!initialLoad && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onToggle={() => toggleSelect(item.id)}
              />
            ))}
            {/* Loading more skeletons */}
            {loading && !initialLoad &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`sk-${i}`} className="rounded-xl bg-gray-200 animate-pulse" style={{ aspectRatio: "4/3" }} />
              ))
            }
          </div>
        )}

        {/* Empty */}
        {!initialLoad && !loading && filteredItems.length === 0 && !error && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-semibold text-lg">No media found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting filters or upload something new</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              Upload Media
            </button>
          </div>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} className="h-1 mt-2" />

        {/* Loading spinner */}
        {loading && !initialLoad && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="animate-spin w-4 h-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading more…
            </div>
          </div>
        )}

        {/* End */}
        {!loading && !initialLoad && page >= totalPages && allItems.length > 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">All {totalItems} items loaded</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showUpload && (
        <UploadModal
          categories={categories}
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirm
          count={selected.size}
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteConfirm(false); setDeleteError(""); }}
          deleting={deleting}
        />
      )}
    </div>
  );
}