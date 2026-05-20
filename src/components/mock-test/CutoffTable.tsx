import React from "react";
import { TrendingUp } from "lucide-react";

export default function CutoffTable({ data }: { data: any }) {
  if (!data || !data.content) return null;
  const rows = Array.isArray(data.content) ? data.content : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <TrendingUp className="w-5 h-5 text-primary" /> 
        {data.title || "Expected Cutoffs"}
      </h3>
      
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-navy font-bold">
            <tr>
              <th className="px-6 py-4">Institute / College</th>
              <th className="px-6 py-4 text-center">Expected Cutoff</th>
              <th className="px-6 py-4 text-right">Safe Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {row.institute}
                </td>
                <td className="px-6 py-4 text-center text-gray-600 font-medium">{row.cutoff}</td>
                <td className="px-6 py-4 text-right text-gray-600">
                  <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-bold text-xs">
                    {row.safeScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
