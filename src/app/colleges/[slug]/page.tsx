"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCollegeBySlugAPI, getCollegesAPI, submitInquiryAPI } from "@/services/api";
import { 
  MapPin, Star, GraduationCap, Building2, Calendar, Trophy, Globe,
  CheckCircle2, ArrowRight, BookOpen, IndianRupee, Briefcase, 
  HelpCircle, MessageSquare, ShieldCheck, Download, Mail, Phone, Send,
  TrendingUp
} from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import toast from "react-hot-toast";

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "courses", label: "Courses & Fees", icon: IndianRupee },
  { id: "placement", label: "Placement", icon: Briefcase },
  { id: "admission", label: "Admission", icon: ShieldCheck },
  { id: "facilities", label: "Facilities", icon: Building2 },
];

export default function CollegeProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [college, setCollege] = useState<any>(null);
  const [similarColleges, setSimilarColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Inquiry Form State
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data } = await getCollegeBySlugAPI(slug);
        setCollege(data.data);
        
        // Fetch similar colleges
        const similarRes = await getCollegesAPI(`state=${data.data.state}&limit=3`);
        setSimilarColleges(similarRes.data.data.filter((c: any) => c._id !== data.data._id));
      } catch (error) {
        console.error("Error fetching college profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Submitting inquiry...");
    try {
      await submitInquiryAPI({ ...form, message: `Interest in ${college?.name}. ${form.message}` });
      toast.success("Inquiry sent successfully!", { id: toastId });
      setForm({ name: "", email: "", phone: "", course: "", message: "" });
    } catch {
      toast.error("Failed to send inquiry.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-48 bg-gray-100 rounded-3xl animate-pulse mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />)}
          </div>
          <div className="space-y-8">
            <div className="h-96 bg-gray-50 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!college) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-40 text-center">
        <h1 className="text-3xl font-bold text-navy">College Not Found</h1>
        <p className="text-gray-500 mt-4">The college you are looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold rounded-full uppercase tracking-widest">{college.ownershipType}</span>
                <span className="px-3 py-1 bg-white/10 text-white/80 text-[10px] font-bold rounded-full uppercase tracking-widest">Est. {college.establishedYear}</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">Ranked {college.ranking || "#1"}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-accent" /> <span className="text-white/80 font-medium">{college.city}, {college.state}</span></div>
                <div className="flex items-center gap-2 font-bold text-white bg-white/5 px-4 py-1.5 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> {college.rating} / 5.0
                </div>
                {college.websiteUrl && <a href={college.websiteUrl} target="_blank" className="flex items-center gap-2 hover:text-white transition-colors"><Globe className="w-5 h-5" /> Official Website</a>}
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <button className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Apply Now 2026</button>
              <button className="flex-1 sm:flex-none px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Brochure</button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <nav className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 py-4 whitespace-nowrap">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? "text-primary" : "text-gray-500 hover:text-navy"}`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                  {activeTab === tab.id && <div className="absolute -bottom-[1.1rem] left-0 right-0 h-1 bg-primary rounded-t-full" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Sections */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview Section */}
            <div id="overview" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" /> About {college.name}
              </h2>
              <div className="prose prose-navy max-w-none text-gray-600 leading-relaxed">
                {college.description.split('\n').map((para: string, i: number) => <p key={i} className="mb-4">{para}</p>)}
              </div>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-navy/5 rounded-2xl border border-navy/5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary font-bold">#1</div>
                  <div><div className="text-xs text-gray-400 uppercase font-bold">Nirf Ranking</div><div className="text-navy font-bold">Top Ranked in {college.state}</div></div>
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary"><IndianRupee className="w-5 h-5" /></div>
                  <div><div className="text-xs text-gray-400 uppercase font-bold">Estimated Fees</div><div className="text-navy font-bold">{college.fees}</div></div>
                </div>
              </div>
            </div>

            {/* Courses & Fees */}
            <div id="courses" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-3">
                <IndianRupee className="w-6 h-6 text-primary" /> Courses, Fees & Eligibility
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fees (Yearly)</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {college.courses?.map((course: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-navy">{course.name}</div>
                          <div className="text-xs text-gray-400">{course.duration}</div>
                        </td>
                        <td className="px-6 py-5 font-bold text-primary">{course.fees}</td>
                        <td className="px-6 py-5 text-sm text-gray-600">{course.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Placement Section */}
            <div id="placement" className="bg-navy text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase className="w-48 h-48" /></div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <TrendingUp className="w-6 h-6 text-accent" /> Placement Statistics
              </h2>
              <div className="grid sm:grid-cols-3 gap-8 relative z-10 mb-12">
                <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="text-4xl font-extrabold text-accent mb-2">{college.placementPercentage}%</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Placement Ratio</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="text-4xl font-extrabold text-white mb-2">{college.highestPackage || "₹45L"}</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Highest CTC</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="text-4xl font-extrabold text-white mb-2">{college.averagePackage || "₹8.5L"}</div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Average CTC</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-accent mb-6 uppercase tracking-widest text-sm">Top Recruiters</h4>
                <div className="flex flex-wrap gap-4">
                  {college.topRecruiters?.map((r: string) => (
                    <span key={r} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/90 hover:bg-white/10 transition-all cursor-default">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Admission Process */}
            <div id="admission" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" /> Admission Process 2026
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-primary">
                  <h4 className="font-bold text-navy mb-2">Eligibility Criteria</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{college.eligibility || "Candidates must have passed 10+2 with minimum 50% marks from a recognized board."}</p>
                </div>
                <div className="prose prose-navy max-w-none text-sm text-gray-600">
                  {college.admissionProcess?.split('\n').map((step: string, i: number) => <p key={i} className="mb-2">{step}</p>)}
                </div>
              </div>
            </div>

            {/* Facilities Section */}
            <div id="facilities" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-navy mb-8 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" /> Campus Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {college.facilities?.map((f: string) => (
                  <div key={f} className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6 text-primary/40 group-hover:text-primary" /></div>
                    <span className="text-xs font-bold text-gray-600 group-hover:text-primary">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            {college.faqs?.length > 0 && (
              <div id="faqs" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {college.faqs.map((faq: any, i: number) => (
                    <details key={i} className="group p-6 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <summary className="flex items-center justify-between font-bold text-navy list-none">
                        {faq.question} <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="mt-4 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Inquiry Form & Info */}
          <aside className="space-y-8 sticky top-40">
            {/* Inquiry Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-navy/5">
              <h3 className="text-xl font-bold text-navy mb-2">Admission Inquiry</h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">Get direct counselling for {college.name}</p>
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <input required type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary transition-all text-sm" />
                <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary transition-all text-sm" />
                <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary transition-all text-sm" />
                <select value={form.course} onChange={e => setForm({...form, course: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-primary transition-all text-sm">
                  <option value="">Select Course</option>
                  {college.courses?.map((c: any, i: number) => <option key={c._id || `${c.name}-${i}`} value={c.name}>{c.name}</option>)}
                </select>
                <button disabled={submitting} type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  {submitting ? "Submitting..." : <><Send className="w-4 h-4" /> Request Call Back</>}
                </button>
              </form>
              <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <span className="text-[10px] text-green-800 font-bold uppercase tracking-wider">100% Secure & Private</span>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-navy rounded-3xl p-8 text-white">
              <h4 className="font-bold mb-4">Direct Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone className="w-4 h-4 text-accent" /> +91 98765 43210
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail className="w-4 h-4 text-accent" /> info@careerpath.com
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Colleges */}
        {similarColleges.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-navy mb-8">Similar Colleges in <span className="text-primary">{college.state}</span></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarColleges.map(c => <CollegeCard key={c._id} college={c} />)}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
