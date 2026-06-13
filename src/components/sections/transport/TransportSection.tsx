'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TransportSection() {
  const stations = [
    "Ghorab", "Ocha", "Nichla Ocha", "Bhadrer", "Guglahad", 
    "Massal", "Bhangali", "Jharet", "Rajhoon", "Jamula", 
    "Chambi", "Lower Hatwas", "Nagrota Bagwan", "Tharu", 
    "Thanpuri", "Mumta Bandi", "Baldhar", "Kawari", 
    "Upper Hatwas", "Malan", "61 Miles"
  ];

  const busImages = [
    "/assets/transport/bus_parked.png",
    "/assets/transport/bus_garland.png",
    "/assets/transport/bus_students.png",
    "/assets/transport/bus_staff.png"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % busImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [busImages.length]);

  const filteredStations = stations.filter(station =>
    station.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[#F8FAFC] text-[#06283D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Header Section */}
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#093C5D] tracking-tight">Our Transport Network</h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Neelgiri Public Senior Secondary School provides safe, reliable, and widespread bus connectivity across the region.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Slider & Info Panel */}
          <div className={`lg:col-span-5 space-y-6 transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
            <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-2 aspect-[4/3] border border-[#093C5D]/10">
              <div className="absolute inset-2 overflow-hidden rounded-xl">
                {busImages.map((imgUrl, idx) => (
                  <Image 
                    key={idx}
                    src={imgUrl} 
                    alt={`Neelgiri Public School bus fleet - Bus ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority={idx === 0}
                    className={`object-cover transition-[opacity,transform] duration-700 ease-in-out transform transform-gpu will-change-[transform,opacity] ${
                      idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  />
                ))}
              </div>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {busImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 border-0 cursor-pointer ${
                      idx === currentImageIndex ? 'bg-[#FA6781] w-4' : 'bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#FFC94D]/10 border-l-4 border-[#FFC94D] p-4 rounded-r-xl">
              <h3 className="font-semibold text-[#093C5D] text-sm">Safety First</h3>
              <p className="text-xs text-slate-600 mt-1">
                All routes are managed by experienced drivers with fully compliant safety measures and GPS tracking.
              </p>
            </div>
          </div>

          {/* Stations Coverage Panel */}
          <div className={`lg:col-span-7 transition-all duration-1000 delay-400 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Route Coverage</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Showing {filteredStations.length} active stops</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search your route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all duration-200"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
              </div>

              {filteredStations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredStations.map((station, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-2.5 bg-slate-50 hover:bg-[#FFC94D]/10 border border-slate-100 hover:border-[#FFC94D]/30 rounded-xl transition-colors duration-300 group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#093C5D]/10 flex items-center justify-center text-[#093C5D] group-hover:bg-[#093C5D] group-hover:text-white transition-colors duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {station}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-xs">No routes found matching &quot;{searchQuery}&quot;</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}