import React from "react";
import { Star, Clock, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

interface ProgramCardProps {
  program: any;
  onViewDetails: (program: any) => void;
}

export default function ProgramCard({ program, onViewDetails }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
          {program.degreeType}
        </span>
        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-sm font-bold">{program.rating}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-navy group-hover:text-primary transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">
        {program.title}
      </h3>
      <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-primary" /> {program.universityName}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Total Fees</div>
          <div className="text-navy font-bold text-sm">{program.fees}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Duration</div>
          <div className="text-navy font-bold text-sm">{program.duration}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">UGC Approved - {program.grade} Grade</span>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => onViewDetails(program)}
          className="w-full py-3 px-4 border border-navy text-navy text-sm font-bold rounded-2xl hover:bg-navy hover:text-white transition-all"
        >
          View Details
        </button>
        
      </div>
    </div>
  );
}
