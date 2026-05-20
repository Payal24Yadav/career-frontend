import React from "react";
import Link from "next/link";
import { MapPin, Star, GraduationCap, TrendingUp, ArrowRight, UserCheck } from "lucide-react";

interface CollegeCardProps {
  college: {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    city: string;
    state: string;
    rating: number;
    fees: string;
    placementPercentage: number;
    ownershipType: string;
    degreeType: string[];
  };
}

export default function CollegeCard({ college }: CollegeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-navy/5 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
          {college.ownershipType}
        </span>
        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-sm font-bold">{college.rating}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-navy group-hover:text-primary transition-colors mb-2 line-clamp-1">
        {college.name}
      </h3>
      
      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
        <MapPin className="w-4 h-4 text-gray-400" />
        {college.city}, {college.state}
      </div>

      <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
        {college.shortDescription || "One of India's leading institutions offering world-class education and top-tier placements."}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-xl">
          <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Average Fees</div>
          <div className="text-navy font-bold">{college.fees}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Placement</div>
          <div className="text-green-600 font-bold">{college.placementPercentage}%</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {college.degreeType.slice(0, 3).map((type) => (
          <span key={type} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            {type}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <Link 
          href={`/colleges/${college.slug}`}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light transition-all"
        >
          <UserCheck className="w-4 h-4" /> Profile
        </Link>
        <Link 
          href={`/colleges/${college.slug}`}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-navy text-navy text-xs font-bold rounded-xl hover:bg-navy hover:text-white transition-all"
        >
          View Details
        </Link>
      </div>
      <Link 
        href="/inquiry"
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Apply Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
