import React from "react";
import { Lightbulb, CheckCircle2 } from "lucide-react";

export default function StrategySection({ data }: { data: any }) {
  if (!data || !data.content) return null;
  const strategies = Array.isArray(data.content) ? data.content : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <Lightbulb className="w-5 h-5 text-primary" /> 
        {data.title || "Preparation Strategy"}
      </h3>
      
      <div className="space-y-6">
        {strategies.map((strat: any, i: number) => (
          <div key={i} className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
            <h4 className="font-bold text-navy text-base mb-2">{strat.strategyName}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{strat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
