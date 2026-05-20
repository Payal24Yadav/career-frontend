"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star, ArrowRight, UserCheck } from "lucide-react";
import { getCollegesAPI } from "@/services/api";

interface College {
  _id: string;
  name: string;
  slug: string;
  fees: string;
  rating: number;
  placementPercentage: number;
  city: string;
  state: string;
  ownershipType: string;
  courses: { name: string }[];
  shortDescription: string;
}

export default function FeaturedColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await getCollegesAPI("limit=4&featured=true"); // Configured limit to load 4 items for a full row grid layout
        setColleges(data.data);
      } catch {
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  return (
    <section className="py-7 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider block mb-2">Top Colleges</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-navy tracking-tight">
              Featured <span className="gradient-text">Colleges</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg text-base">Top-rated institutions for your academic journey.</p>
          </div>
          <Link href="/colleges" className="group flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all duration-300">
            View All Colleges <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeleton Grid (Adjusted to 4 per row) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-none rounded-bl-none overflow-hidden p-6 border border-gray-100 animate-pulse shadow-sm">
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-1/3 bg-gray-100 rounded" />
                  <div className="h-6 w-12 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-full bg-gray-100 rounded mb-3" />
                <div className="h-4 w-1/2 bg-gray-100 rounded mb-8" />
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="h-14 bg-gray-50 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none" />
                  <div className="h-14 bg-gray-50 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none" />
                </div>
                <div className="h-12 bg-gray-100 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none" />
              </div>
            ))}
          </div>
        ) : (
          
          /* Cards Content Grid (Adjusted to 4 per row with Asymmetric Corner Radii) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colleges.map((college) => (
              <div
                key={college._id}
                className="group bg-white rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-none rounded-bl-none p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Metabar */}
                  <div className="flex justify-between items-center mb-5">
                    <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none uppercase tracking-wider">
                      {college.ownershipType}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold bg-amber-50 px-2 py-1 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" /> {college.rating}
                    </div>
                  </div>

                  {/* College Title */}
                  <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors mb-2 line-clamp-2 min-h-[3.5rem] leading-snug">
                    {college.name}
                  </h3>
                  
                  {/* Location Meta */}
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-6">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> 
                    <span className="truncate">{college.city}, {college.state}</span>
                  </div>

                  {/* Asymmetric Highlights Container */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-gray-50 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-center border border-gray-100/50">
                      <div className="text-[9px] text-gray-400 uppercase font-bold mb-1 tracking-wider">Average Fees</div>
                      <div className="text-navy font-bold text-xs truncate">{college.fees}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-center border border-gray-100/50">
                      <div className="text-[9px] text-gray-400 uppercase font-bold mb-1 tracking-wider">Placement</div>
                      <div className="text-emerald-600 font-bold text-xs">{college.placementPercentage}%</div>
                    </div>
                  </div>

                  {/* Tag Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {college.courses?.slice(0, 2).map((c, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100/70 text-gray-500 text-[10px] font-bold rounded-tl-md rounded-br-md rounded-tr-none rounded-bl-none whitespace-nowrap">
                        {typeof c === 'string' ? c : c.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Profile Call to Action Button */}
                <Link 
                  href={`/colleges/${college.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-navy text-white text-sm font-bold rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none hover:bg-primary transition-all duration-300 shadow-md shadow-navy/5"
                >
                  <UserCheck className="w-4 h-4" /> View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}