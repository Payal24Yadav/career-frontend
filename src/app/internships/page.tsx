"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getInternshipsAPI, submitInquiryAPI } from "@/services/api";
import { Search, MapPin, Briefcase, Calendar, Award, BookOpen, Clock, Users, ArrowRight, X, ChevronDown, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface Internship {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  duration: string;
  stipend: string;
  skillsRequired: string[];
  description: string;
  responsibilities?: string;
  eligibility?: string;
  category: string;
  applyLink: string;
  lastDate: string;
  isFeatured: boolean;
  status: string;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Application/Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Internship Support",
    message: "",
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    "All",
    "Software Development",
    "Web Development",
    "Data Science",
    "Digital Marketing",
    "Graphic Design",
    "Business Development",
    "Finance",
    "HR"
  ];

  const benefits = [
    {
      icon: Award,
      title: "Verified Certification",
      desc: "Gain industry-recognized internship completion certificates to boost your resume.",
      color: "from-blue-500/10 to-blue-600/10 text-blue-600",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      desc: "Get 1-on-1 guidance and review sessions from seasoned industry professionals.",
      color: "from-purple-500/10 to-purple-600/10 text-purple-600",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      desc: "Balance your academic schedule with flexible remote or hybrid work environments.",
      color: "from-teal-500/10 to-teal-600/10 text-teal-600",
    },
    {
      icon: BookOpen,
      title: "Hands-on Exposure",
      desc: "Work on live enterprise systems, resolving real challenges and shipping real features.",
      color: "from-orange-500/10 to-orange-600/10 text-orange-600",
    },
  ];

  const faqs = [
    {
      q: "Who is eligible to apply for these internships?",
      a: "Students currently enrolled in undergraduate/postgraduate programs (B.Tech, BCA, MCA, BBA, MBA, etc.) or recent graduates looking for practical industry exposure are highly eligible."
    },
    {
      q: "Are the internships listed paid?",
      a: "Yes! Most of the internships listed offer attractive monthly stipends. The specific stipend details for each position are clearly stated on their individual listings."
    },
    {
      q: "Will I get a certificate of completion?",
      a: "Absolutely! Upon successful completion of your internship tenure and feedback criteria, you will receive a formal certificate and an optional Letter of Recommendation (LOR) based on your performance."
    },
    {
      q: "How does the application process work?",
      a: "You can click on 'Apply Now' for any specific internship to proceed with the direct corporate link, or you can submit the general inquiry form on this page to let our counselors match you with relevant internships."
    }
  ];

  const fetchInternships = async () => {
    setLoading(true);
    try {
      let params = "status=active";
      if (search) params += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter !== "All") params += `&category=${encodeURIComponent(categoryFilter)}`;
      const { data } = await getInternshipsAPI(params);
      setInternships(data.data || []);
    } catch (err) {
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    const toastId = toast.loading("Submitting your application inquiry...");
    try {
      await submitInquiryAPI(inquiryForm);
      toast.success("Application inquiry submitted! Our team will contact you soon.", { id: toastId });
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        course: "Internship Support",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to submit inquiry. Please try again.", { id: toastId });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase bg-white border border-gray-200/80 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Launch Your Career
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Premium <span className="gradient-text">Internship Support</span> 2026
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Gain high-value industrial experience, earn monthly stipends, and secure verified placement credits.
          </p>
        </div>
      </section>

      {/* Main Internship Grid & Filters */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Listings side */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search internships, companies, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                />
              </form>

              {/* Mobile scrollable categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-navy shadow-sm cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                    <div className="h-6 bg-gray-100 rounded w-1/3 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                    <div className="h-10 bg-gray-50 rounded-2xl w-full" />
                  </div>
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">No Internships Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any active internships matching your requirements. Try adjusting your search.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {internships.map((internship) => (
                  <div
                    key={internship._id}
                    onClick={() => setSelectedInternship(internship)}
                    className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm"
                  >
                    {internship.isFeatured && (
                      <span className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-black py-1.5 px-4 rounded-bl-2xl">
                        Featured
                      </span>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase bg-primary/5 px-3 py-1 rounded-full">
                          {internship.category}
                        </span>
                        <h3 className="text-xl font-extrabold text-navy mt-3 group-hover:text-primary transition-colors">
                          {internship.title}
                        </h3>
                        <p className="text-gray-500 font-bold text-sm mt-0.5">{internship.companyName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-b border-gray-100/60 py-4 text-xs font-bold text-navy">
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span>{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Award className="w-4 h-4 text-primary shrink-0" />
                        <span>Stipend: {internship.stipend}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span>Last Date: {new Date(internship.lastDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">
                      <div className="flex flex-wrap gap-1.5">
                        {internship.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInternship(internship);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-navy text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 shrink-0"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inquiry Application Form side */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-28 bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-accent" />
              <h3 className="text-xl font-bold text-navy mb-2">Apply for Placement support</h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                Need guidance? Tell us your preference and our counsellors will contact you within 24 hours to find you the best internship.
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message / Preferences</label>
                  <textarea
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy resize-none"
                    placeholder="Specify domain, preferred locations or timing..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-[1.01]"
                >
                  {submittingInquiry ? "Submitting..." : "Send Application Inquiry"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* Benefits spotlight */}
      <section className="py-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase bg-white/5 border border-white/10 rounded-full shadow-sm">
            Internship Perks
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Our <span className="gradient-text">Internship Support?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {benefits.map((b, index) => {
              const Icon = b.icon;
              return (
                <div key={index} className="p-8 bg-white/5 rounded-3xl border border-white/10 text-left hover:-translate-y-1.5 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center ${b.color} mb-6`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-navy text-center mb-10">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left text-navy font-bold hover:bg-gray-100/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sliding Drawer details modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end animate-fade-in">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setSelectedInternship(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-l-3xl p-6 sm:p-8 h-[95vh] sm:h-screen overflow-y-auto animate-slide-left shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <span className="text-xs font-bold text-primary uppercase bg-primary/5 px-3 py-1 rounded-full">
                  {selectedInternship.category}
                </span>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-extrabold text-navy tracking-tight">{selectedInternship.title}</h2>
              <p className="text-gray-500 font-bold text-sm mt-1 mb-6">{selectedInternship.companyName}</p>

              <div className="grid grid-cols-3 gap-3 bg-gray-50/70 p-4 rounded-2xl mb-8 text-xs font-bold text-navy">
                <div className="flex flex-col gap-1 border-r border-gray-200/80">
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">Location</span>
                  <span>{selectedInternship.location}</span>
                </div>
                <div className="flex flex-col gap-1 border-r border-gray-200/80 pl-2">
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">Duration</span>
                  <span>{selectedInternship.duration}</span>
                </div>
                <div className="flex flex-col gap-1 pl-2">
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">Stipend</span>
                  <span>{selectedInternship.stipend}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-navy mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> About The Internship
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                    {selectedInternship.description}
                  </p>
                </div>

                {selectedInternship.responsibilities && (
                  <div>
                    <h4 className="font-bold text-navy mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Key Responsibilities
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                      {selectedInternship.responsibilities}
                    </p>
                  </div>
                )}

                {selectedInternship.eligibility && (
                  <div>
                    <h4 className="font-bold text-navy mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Who Can Apply
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                      {selectedInternship.eligibility}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-navy mb-2 text-sm uppercase tracking-wider">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skillsRequired.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-bold rounded-lg border border-primary/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between mt-8">
              <span className="text-xs text-gray-400 font-medium">
                Last date to apply: {new Date(selectedInternship.lastDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <a
                href={selectedInternship.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-navy text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/20 text-center uppercase tracking-wider"
              >
                Apply Direct Link
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
