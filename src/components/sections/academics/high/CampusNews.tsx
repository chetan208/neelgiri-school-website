import React from "react";

interface NewsItemType {
  title: string;
  date: string;
  image: string;
}

export default function CampusNews() {
  const news: NewsItemType[] = [
    {
      title: "Robotics Team Wins Regional Championship",
      date: "March 18, 2026",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Model UN Conference Hosted Successfully",
      date: "March 12, 2026",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Science Fair Showcases Student Innovations",
      date: "March 5, 2026",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="uppercase tracking-[4px] text-teal-700 font-semibold text-sm">Campus Blog</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">Latest School News</h2>
          </div>
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-7 py-4 rounded-2xl font-semibold transition duration-300 cursor-pointer">
            View All News
          </button>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.title} className="bg-white rounded-[30px] overflow-hidden shadow-md hover:-translate-y-2 transition duration-300 border border-slate-100">
              <div className="overflow-hidden h-64">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-8">
                <p className="text-teal-700 font-semibold text-sm">{item.date}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-4 leading-snug">{item.title}</h3>
                <p className="text-slate-600 mt-5 text-sm leading-relaxed">
                  Discover how our students are achieving excellence through innovation, teamwork, and experiential learning opportunities.
                </p>
                <button className="mt-6 text-teal-700 font-semibold hover:underline cursor-pointer bg-transparent border-0 text-base">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}