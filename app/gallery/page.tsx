"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import FilterBar from "./components/FilterBar";
import GalleryCard from "./components/GalleryCard";
import MediaViewer from "./components/MediaViewer";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  publicId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

interface ApiResponse {
  mediaItems: MediaItem[];
  totalItems: number;
  totalPages: number;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

export default function GalleryPage() {
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [viewerItem, setViewerItem] = useState<MediaItem | null>(null);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // ── Fetch page ────────────────────────────────────────────────────────────

  const fetchPage = useCallback(async (pageNum: number): Promise<MediaItem[]> => {
    if (loadingRef.current) return [];
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<ApiResponse>(
        `${SERVER_URL}/api/media/`,
        {
          params: { page: pageNum },
          withCredentials: false,
        }
      );

      const items: MediaItem[] = res.data.mediaItems ?? [];
      
      setAllItems((prev) => (pageNum === 1 ? items : [...prev, ...items]));
      setTotalPages(res.data.totalPages ?? 1);
      setTotalItems(res.data.totalItems ?? items.length);
      setPage(pageNum);

      setCategories((prev) => {
        const map = new Map(prev.map((c) => [c.id, c]));
        items.forEach((item) => {
          if (item.category && !map.has(item.category.id)) {
            map.set(item.category.id, item.category);
          }
        });
        return Array.from(map.values());
      });

      return items;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message ?? "Failed to load media");
      } else {
        setError(err instanceof Error ? err.message : "Failed to load media");
      }
      return [];
    } finally {
      setLoading(false);
      setInitialLoad(false);
      setTimeout(() => {
        loadingRef.current = false;
      }, 200);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || initialLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && !loading) {
          setPage((prevPage) => {
            if (prevPage < totalPages) {
              fetchPage(prevPage + 1);
              return prevPage + 1;
            }
            return prevPage;
          });
        }
      },
      { root: null, rootMargin: "50px", threshold: 0.1 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [totalPages, fetchPage, initialLoad, loading]);

  // ── Filtered items ────────────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const typeMatch = selectedType === "all" || item.mediaType === selectedType;
      const catMatch = selectedCategory === "all" || item.categoryId === selectedCategory;
      return typeMatch && catMatch;
    });
  }, [allItems, selectedType, selectedCategory]);

  // ── Viewer navigation ─────────────────────────────────────────────────────

  const viewerIndex = useMemo(() => {
    if (!viewerItem) return -1;
    return filteredItems.findIndex((i) => i.id === viewerItem.id);
  }, [viewerItem, filteredItems]);

  const openViewer = (item: MediaItem) => {
    setViewerItem(item);
    document.body.style.overflow = "hidden";
  };

  const closeViewer = () => {
    setViewerItem(null);
    document.body.style.overflow = "";
  };

  const goNext = async () => {
    if (viewerIndex === -1) return;
    const nextIndex = viewerIndex + 1;
    
    if (nextIndex < filteredItems.length) {
      setViewerItem(filteredItems[nextIndex]);
      return;
    }

    if (page < totalPages) {
      setLoadingNextPage(true);
      const nextFetchedItems = await fetchPage(page + 1);
      setLoadingNextPage(false);

      if (nextFetchedItems.length > 0) {
        const newlyFiltered = nextFetchedItems.filter((item) => {
          const typeMatch = selectedType === "all" || item.mediaType === selectedType;
          const catMatch = selectedCategory === "all" || item.categoryId === selectedCategory;
          return typeMatch && catMatch;
        });

        if (newlyFiltered.length > 0) {
          setViewerItem(newlyFiltered[0]);
        }
      }
    }
  };

  const goPrev = () => {
    if (viewerIndex > 0) {
      setViewerItem(filteredItems[viewerIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#06283D]">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Media Gallery
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {initialLoad ? "Loading…" : `${totalItems} items across ${totalPages} pages`}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              {allItems.filter(i => i.mediaType === "image").length} Photos
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
              {allItems.filter(i => i.mediaType === "video").length} Videos
            </span>
          </div>
        </div>
      </div> */}

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#F8FAFC] px-4 py-3.5 mb-6">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onCategoryChange={(c) => setSelectedCategory(c)}
            onTypeChange={(t) => setSelectedType(t)}
          />
        </div>

        {(selectedCategory !== "all" || selectedType !== "all") && (
          <div className="flex items-center gap-2 mb-4 bg-[#F8FAFC] border border-[#FFC94D]/30 rounded-xl px-4 py-2 max-w-max">
            <p className="text-xs text-[#06283D]">
              Showing <span className="font-bold text-[#093C5D]">{filteredItems.length}</span> of{" "}
              <span className="font-bold text-[#093C5D]">{allItems.length}</span> total items loaded
            </p>
            <span className="text-[#FFC94D]/50">|</span>
            <button
              onClick={() => { setSelectedCategory("all"); setSelectedType("all"); }}
              className="text-xs font-bold text-[#FFC94D] hover:text-[#093C5D] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
              </svg>
              {error}
            </div>
            <button
              onClick={() => fetchPage(1)}
              className="mt-4 block mx-auto text-sm text-[#FFC94D] font-semibold underline hover:text-[#093C5D]"
            >
              Try again
            </button>
          </div>
        )}

        {initialLoad && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-[#FFC94D]/20 animate-pulse"
                style={{ aspectRatio: "4/3" }}
              />
            ))}
          </div>
        )}

        {!initialLoad && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => openViewer(item)}
              />
            ))}

            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skel-load-${i}`}
                className="rounded-xl bg-[#FFC94D]/20 animate-pulse"
                style={{ aspectRatio: "4/3" }}
              />
            ))}
          </div>
        )}

        {!initialLoad && !loading && filteredItems.length === 0 && !error && (
          <div className="text-center py-24 bg-white border border-[#F8FAFC] rounded-2xl shadow-sm">
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-[#06283D] font-medium">No media items found matching the selected filters.</p>
            <button
              onClick={() => { setSelectedCategory("all"); setSelectedType("all"); }}
              className="mt-3 text-sm font-semibold text-[#FFC94D] underline hover:text-[#093C5D]"
            >
              View All Content
            </button>
          </div>
        )}

        <div ref={sentinelRef} className="h-4 mt-4" />

        {loading && !initialLoad && filteredItems.length > 0 && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#06283D]/60 uppercase tracking-wider">
              <svg className="animate-spin w-4 h-4 text-[#FFC94D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Fetching more data…
            </div>
          </div>
        )}

        {!loading && !initialLoad && page >= totalPages && allItems.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-px bg-[#F8FAFC]" />
            <p className="text-xs font-medium text-[#06283D]/60 mt-2">All {totalItems} dynamic items loaded</p>
          </div>
        )}
      </div>

      {viewerItem && (
        <MediaViewer
          item={viewerItem}
          onClose={closeViewer}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={viewerIndex > 0}
          hasNext={viewerIndex < filteredItems.length - 1 || page < totalPages}
          isLoadingNext={loadingNextPage}
        />
      )}
    </div>
  );
}