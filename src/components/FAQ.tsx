"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "What services does CareerPath offer?", answer: "CareerPath provides comprehensive career counselling, college admission guidance (MBA, B.Tech, BBA, BCA), study abroad consulting, placement support, scholarship assistance, and internship guidance." },
  { question: "How does the counselling process work?", answer: "Our process starts with a free initial consultation to understand your goals. We then create a personalized roadmap covering college shortlisting, exam strategy, application support, and interview coaching." },
  { question: "Is the initial consultation free?", answer: "Yes! We offer a completely free initial counselling session. Submit an inquiry through our website, and our expert counsellors will reach out within 24 hours." },
  { question: "Which colleges do you help with admissions?", answer: "We partner with 50+ top colleges including IIMs, IITs, NITs, BITS, Christ University, Symbiosis, Amity, and many more. We also assist with international university admissions." },
  { question: "Do you help with placements?", answer: "Absolutely! Our placement support includes resume building, mock interviews, GD preparation, aptitude training, and corporate communication skills." },
  { question: "How can I apply for scholarships?", answer: "We identify merit-based and need-based scholarships that match your profile and assist with the entire application process including documentation and essays." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors">
              <button
                suppressHydrationWarning
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-navy pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6"><p className="text-gray-500 leading-relaxed">{faq.answer}</p></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
