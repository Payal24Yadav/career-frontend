"use client";
import React from "react";
import { X, CheckCircle2, IndianRupee, Clock, GraduationCap, Briefcase, BookOpen, ShieldCheck } from "lucide-react";

interface ProgramModalProps {
  program: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgramModal({ program, isOpen, onClose }: ProgramModalProps) {
  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">{program.degreeType}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">{program.grade} Grade</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">{program.title}</h2>
            <p className="text-gray-500 font-medium flex items-center gap-2 mt-2">
              <GraduationCap className="w-5 h-5 text-primary" /> {program.universityName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Program Overview
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{program.fullDescription}</p>
              </div>

              {/* Curriculum */}
              {program.curriculum?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Curriculum Overview
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {program.curriculum.map((sem: any, i: number) => (
                      <div key={i} className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                        <h4 className="font-bold text-navy mb-3 text-sm">{sem.semester}</h4>
                        <ul className="space-y-2">
                          {sem.subjects.map((sub: string, j: number) => (
                            <li key={j} className="text-xs text-gray-500 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 flex-shrink-0" />
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Opportunities */}
              <div>
                <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Career Opportunities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {program.careerOpportunities?.map((opp: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-primary/5 text-primary text-xs font-bold rounded-xl border border-primary/10">
                      {opp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admission Process */}
              <div>
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Admission Process
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{program.admissionProcess}</p>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="p-8 bg-navy rounded-[2rem] text-white">
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary">Quick Stats</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary"><IndianRupee className="w-5 h-5" /></div>
                    <div><div className="text-[10px] text-gray-400 font-bold uppercase">Total Fees</div><div className="font-bold">{program.fees}</div></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary"><Clock className="w-5 h-5" /></div>
                    <div><div className="text-[10px] text-gray-400 font-bold uppercase">Duration</div><div className="font-bold">{program.duration}</div></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary"><ShieldCheck className="w-5 h-5" /></div>
                    <div><div className="text-[10px] text-gray-400 font-bold uppercase">Eligibility</div><div className="font-bold text-sm">{program.eligibility}</div></div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <h4 className="font-bold text-navy mb-4">Enroll Now</h4>
                <p className="text-xs text-gray-500 mb-6">Start your application for the 2026 intake and boost your career.</p>
                <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">Apply Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
