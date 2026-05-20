import React from "react";
import { TableProperties } from "lucide-react";

export default function ExamPatternSection({ data }: { data: any }) {
  if (!data || !data.content) return null;
  const sections = Array.isArray(data.content) ? data.content : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <TableProperties className="w-5 h-5 text-primary" /> 
        {data.title || "Exam Pattern"}
      </h3>
      
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-navy font-bold">
            <tr>
              <th className="px-6 py-4">Section Name</th>
              <th className="px-6 py-4 text-center">No. of Questions</th>
              <th className="px-6 py-4 text-center">Total Marks</th>
              <th className="px-6 py-4 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sections.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-700">{row.sectionName}</td>
                <td className="px-6 py-4 text-center text-gray-600">{row.questions}</td>
                <td className="px-6 py-4 text-center text-gray-600">{row.marks}</td>
                <td className="px-6 py-4 text-right text-gray-600">
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium text-xs">
                    {row.duration}
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
