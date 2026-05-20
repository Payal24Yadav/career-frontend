"use client";
import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FAQSection({ data }: { data: any }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!data || !data.content) return null;
  const faqs = Array.isArray(data.content) ? data.content : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <HelpCircle className="w-5 h-5 text-primary" /> 
        {data.title || "Frequently Asked Questions"}
      </h3>
      
      <div className="space-y-4">
        {faqs.map((faq: any, idx: number) => (
          <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50 transition-all duration-300">
            <button
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="w-full px-5 py-4 flex justify-between items-center text-left text-navy font-bold text-sm hover:bg-gray-100/50 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
            </button>
            {activeFaq === idx && (
              <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-100 mx-5 mt-2">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
