"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { analyzeResumeAPI } from "@/services/api";
import { 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Briefcase, 
  Target, 
  TrendingUp, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

const rolesList = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
];

export default function ResumeScorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(rolesList[0]);
  const [customRole, setCustomRole] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" || 
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        droppedFile.name.endsWith(".pdf") ||
        droppedFile.name.endsWith(".docx")
      ) {
        setFile(droppedFile);
        toast.success(`Selected file: ${droppedFile.name}`);
      } else {
        toast.error("Please upload only PDF or DOCX files");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      toast.success(`Selected file: ${selectedFile.name}`);
    }
  };

  const runAnalysis = async () => {
    if (!file) {
      toast.error("Please select a resume file first");
      return;
    }

    const finalRole = targetRole === "custom" ? customRole : targetRole;
    if (!finalRole.trim()) {
      toast.error("Please specify a target job role");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setScanStep(0);

    // Multi-step scanning animation sequence
    const steps = [
      "Parsing document format and reading characters...",
      "Analyzing section layouts and syntax structures...",
      "Matching keywords with ATS criteria...",
      "Calculating compliance metrics and recommendations..."
    ];

    const timer = setInterval(() => {
      setScanStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 450);

    try {
      const { data } = await analyzeResumeAPI({ targetRole: finalRole });
      if (data.success) {
        setResult(data.data);
        toast.success("Resume analysis completed successfully!");
      } else {
        toast.error(data.message || "Failed to analyze resume");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred during resume analysis");
    } finally {
      clearInterval(timer);
      setAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult(null);
    setScanStep(0);
  };

  // Color helper based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500 bg-emerald-50";
    if (score >= 60) return "text-amber-500 border-amber-500 bg-amber-50";
    return "text-rose-500 border-rose-500 bg-rose-50";
  };

  return (
    <main className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="px-4 py-1.5 bg-white/10 text-accent text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-flex items-center gap-1.5 border border-white/5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> Advanced ATS Auditing
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            ATS Resume <span className="gradient-text">Score & Audit</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Get an instant compatibility audit for your dream role. Maximize your recruiter responses by resolving critical ATS errors.
          </p>
        </div>
      </section>

      {/* Main Feature Area */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upload State */}
        {!analyzing && !result && (
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
            
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group ${
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100/50 hover:border-gray-300"
              }`}
            >
              <input
                type="file"
                id="resume-upload"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              
              {file ? (
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1.5 flex items-center justify-center gap-1.5">
                    <FileText className="w-5 h-5 text-primary" /> {file.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB • PDF or Word Document
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-extrabold text-navy mb-1.5">
                    Drag & Drop your Resume
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Supports PDF, DOCX (Max size: 5MB)
                  </p>
                  <span className="text-xs font-bold text-primary hover:underline">
                    or browse file
                  </span>
                </div>
              )}
            </div>

            {/* Target Job Role Form */}
            <div className="grid sm:grid-cols-2 gap-8 items-end">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-primary" /> Target Job Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-150 rounded-xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {rolesList.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="custom">Other / Custom Role</option>
                </select>
              </div>

              {targetRole === "custom" && (
                <div className="animate-fade-in-up">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 block">
                    Specify Target Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UI/UX Designer, Marketing Lead"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-150 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}
            </div>

            {/* CTA Analyze Button */}
            <button
              onClick={runAnalysis}
              className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              Analyze My Resume <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Scanning State */}
        {analyzing && (
          <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-24 h-24 mb-8">
              {/* Spinning outer circle */}
              <div className="absolute inset-0 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
              {/* Inner glowing pulse */}
              <div className="absolute inset-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center animate-pulse">
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-navy mb-3">ATS Audit in Progress</h3>
            <p className="text-gray-500 text-sm text-center max-w-sm leading-relaxed mb-6">
              Please wait while our engine performs deep structural and semantic scoring...
            </p>

            {/* Progress indicators */}
            <div className="space-y-2 w-full max-w-md bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {[
                "1. Reading Layout Structures",
                "2. Parsing Semantic Keywords",
                "3. Checking Compliance Checklist",
                "4. Running Recommendations Engine"
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                    idx < scanStep
                      ? "text-emerald-500 font-black"
                      : idx === scanStep
                      ? "text-primary font-black animate-pulse"
                      : "text-gray-400 font-medium"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    idx < scanStep
                      ? "bg-emerald-500"
                      : idx === scanStep
                      ? "bg-primary animate-ping"
                      : "bg-gray-300"
                  }`} />
                  {step} {idx < scanStep && "✓"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Results Dashboard */}
        {result && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Header / Summary Card */}
            <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row items-center gap-10">
              
              {/* Circular Score representation */}
              <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-gray-100"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className={`stroke-current ${
                      result.score >= 80 
                        ? "text-emerald-500" 
                        : result.score >= 60 
                        ? "text-amber-500" 
                        : "text-rose-500"
                    }`}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (427 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-navy">{result.score}%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ATS Score</span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-wider border border-primary/20">
                    Audit Report Completed
                  </span>
                  <h2 className="text-3xl font-extrabold text-navy mt-2">
                    Resume Compatibility Score
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    Evaluated specifically for the <strong className="text-navy font-bold">{result.targetRole}</strong> position.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-3 h-3 rounded-full ${
                      result.score >= 80 ? "bg-emerald-500" : result.score >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`} />
                    <span>Verdict: <strong>{
                      result.score >= 80 ? "Strong Fit" : result.score >= 60 ? "Moderate Match" : "Needs Optimization"
                    }</strong></span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={resetAnalyzer}
                    className="px-6 py-2.5 border border-gray-200 hover:border-navy rounded-xl text-xs font-bold text-gray-600 hover:text-navy transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Analyze Another Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist and Keywords Section */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Checklist */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                <h3 className="text-lg font-extrabold text-navy mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Structural Checklist
                </h3>
                
                <div className="space-y-4">
                  {result.metrics?.structuralChecklist?.map((check: any, idx: number) => (
                    <div key={idx} className="flex gap-3.5 items-start p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      {check.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-xs font-extrabold text-navy">{check.name}</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">{check.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords Tagging */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-navy mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" /> ATS Keyword Analysis
                  </h3>

                  <div className="space-y-6">
                    {/* Matched */}
                    <div>
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Matched Keywords ({result.metrics?.matchedKeywords?.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.metrics?.matchedKeywords?.map((kw: string) => (
                          <span key={kw} className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-lg">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing */}
                    <div>
                      <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Missing Keywords ({result.metrics?.missingKeywords?.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.metrics?.missingKeywords?.map((kw: string) => (
                          <span key={kw} className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-lg">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                    💡 Integrate these missing keywords into your Skills block to optimize match rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Improvement Recommendations */}
            <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-extrabold text-navy mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Strategic Audit Recommendations
              </h3>

              <div className="space-y-4">
                {result.metrics?.suggestions?.map((suggestion: string, idx: number) => (
                  <div key={idx} className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center font-bold text-amber-600 flex-shrink-0 text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
