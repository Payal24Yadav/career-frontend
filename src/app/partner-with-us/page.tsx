"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, Building2, TrendingUp, Target, ShieldCheck, 
  MessageSquare, LayoutDashboard, Globe, CheckCircle2, 
  Send, Phone, Mail, MapPin, Search, ArrowRight, UserPlus
} from "lucide-react";
import { submitCollegePartnerAPI, submitConsultantPartnerAPI } from "@/services/api";
import toast from "react-hot-toast";

const collegeBenefits = [
  { icon: Target, title: "Student Leads", desc: "High-quality, verified student leads interested in your courses." },
  { icon: Globe, title: "Increased Visibility", desc: "Boost your institute's presence across our pan-India network." },
  { icon: MessageSquare, title: "Counseling Support", desc: "Dedicated support to guide students through your admission process." },
  { icon: ShieldCheck, title: "Marketing Exposure", desc: "Premium branding on our portal reaching thousands daily." },
  { icon: MapPin, title: "State-wise Targeting", desc: "Target specific regions to diversify your student intake." },
  { icon: LayoutDashboard, title: "Lead Management", desc: "Real-time dashboard to manage and track your inquiries." }
];

const consultantBenefits = [
  { icon: CheckCircle2, title: "Verified Leads", desc: "Access to students actively seeking career guidance." },
  { icon: Building2, title: "College Tie-ups", desc: "Connect with premium institutes through our existing partnerships." },
  { icon: TrendingUp, title: "Higher Conversion", desc: "Support and tools to improve your student conversion rates." },
  { icon: LayoutDashboard, title: "Lead Dashboard", desc: "Simple interface to monitor your assigned student pool." },
  { icon: Globe, title: "Nationwide Reach", desc: "Reach students from all states without geographical limits." },
  { icon: UserPlus, title: "Growth Opportunities", desc: "Partner with us to scale your consultancy business rapidly." }
];

const steps = [
  { number: "01", title: "Submit Application", desc: "Fill out the detailed partnership form with your credentials." },
  { number: "02", title: "Team Review", desc: "Our specialists review your profile for alignment & quality." },
  { number: "03", title: "Verification Call", desc: "A brief discussion to understand goals and synergy." },
  { number: "04", title: "Approval", desc: "Formal onboarding into the CareerPath partner network." },
  { number: "05", title: "Go Live", desc: "Access your dashboard and start receiving student leads." }
];

export default function PartnerWithUsPage() {
  const [benefitTab, setBenefitTab] = useState<"college" | "consultant">("college");
  const [formTab, setFormTab] = useState<"college" | "consultant">("college");
  const [loading, setLoading] = useState(false);

  // Form States
  const [collegeForm, setCollegeForm] = useState({
    instituteName: "", contactPerson: "", designation: "", officialEmail: "", 
    phone: "", cityState: "", coursesOffered: "", annualIntake: "", 
    leadTypeRequired: "", additionalRequirements: ""
  });

  const [consultantForm, setConsultantForm] = useState({
    firmName: "", contactPerson: "", email: "", phone: "", 
    cityLocation: "", experience: "", specialization: "", 
    expectedLeads: "", partnershipModel: "", additionalNotes: ""
  });

  const handleCollegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading("Submitting application...");
    try {
      await submitCollegePartnerAPI(collegeForm);
      toast.success("Application submitted! Our team will contact you soon.", { id: tid });
      setCollegeForm({
        instituteName: "", contactPerson: "", designation: "", officialEmail: "", 
        phone: "", cityState: "", coursesOffered: "", annualIntake: "", 
        leadTypeRequired: "", additionalRequirements: ""
      });
    } catch { toast.error("Submission failed. Please try again.", { id: tid }); }
    finally { setLoading(false); }
  };

  const handleConsultantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading("Submitting application...");
    try {
      await submitConsultantPartnerAPI(consultantForm);
      toast.success("Application submitted! Our team will contact you soon.", { id: tid });
      setConsultantForm({
        firmName: "", contactPerson: "", email: "", phone: "", 
        cityLocation: "", experience: "", specialization: "", 
        expectedLeads: "", partnershipModel: "", additionalNotes: ""
      });
    } catch { toast.error("Submission failed. Please try again.", { id: tid }); }
    finally { setLoading(false); }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="px-4 py-1.5 bg-white/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block backdrop-blur-sm border border-white/5">Empowering Growth</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            Partner With <span className="gradient-text">CareerPath</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Collaborate with us to connect students with the best colleges, consultants, and career opportunities across India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#apply" className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">Become a Partner</a>
            <a href="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">Contact Team</a>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-6">Why Partner With Us?</h2>
          <div className="inline-flex p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setBenefitTab("college")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${benefitTab === "college" ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
            >
              For Colleges
            </button>
            <button 
              onClick={() => setBenefitTab("consultant")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${benefitTab === "consultant" ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
            >
              For Consultants
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(benefitTab === "college" ? collegeBenefits : consultantBenefits).map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">How the Process Works</h2>
            <p className="text-gray-400">Simple steps to join India's fastest growing career network.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-4xl font-black text-white/10 mb-4">{step.number}</div>
                <h4 className="text-lg font-bold mb-2 text-primary">{step.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && <div className="hidden md:block absolute top-12 -right-4 w-8 h-[2px] bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-navy mb-4">Apply for Partnership</h2>
          <p className="text-gray-500">Fill in the relevant form below. Our team reviews all applications within 24 business hours.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy/5 border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setFormTab("college")}
              className={`flex-1 py-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${formTab === "college" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <Building2 className="w-4 h-4" /> College / Institute
            </button>
            <button 
              onClick={() => setFormTab("consultant")}
              className={`flex-1 py-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${formTab === "consultant" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <Users className="w-4 h-4" /> Consultant / Agency
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {formTab === "college" ? (
              <form onSubmit={handleCollegeSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Institute Name *</label><input required value={collegeForm.instituteName} onChange={e => setCollegeForm({...collegeForm, instituteName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Contact Person *</label><input required value={collegeForm.contactPerson} onChange={e => setCollegeForm({...collegeForm, contactPerson: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Designation *</label><input required value={collegeForm.designation} onChange={e => setCollegeForm({...collegeForm, designation: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Official Email *</label><input required type="email" value={collegeForm.officialEmail} onChange={e => setCollegeForm({...collegeForm, officialEmail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Phone Number *</label><input required type="tel" value={collegeForm.phone} onChange={e => setCollegeForm({...collegeForm, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">City / State *</label><input required value={collegeForm.cityState} onChange={e => setCollegeForm({...collegeForm, cityState: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Courses Offered *</label><input required value={collegeForm.coursesOffered} onChange={e => setCollegeForm({...collegeForm, coursesOffered: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" placeholder="e.g. B.Tech, MBA, Medical" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Annual Intake</label><input value={collegeForm.annualIntake} onChange={e => setCollegeForm({...collegeForm, annualIntake: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Lead Type Required</label><input value={collegeForm.leadTypeRequired} onChange={e => setCollegeForm({...collegeForm, leadTypeRequired: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" placeholder="e.g. State-wise, Course-wise" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Additional Requirements</label><textarea value={collegeForm.additionalRequirements} onChange={e => setCollegeForm({...collegeForm, additionalRequirements: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none resize-none" rows={3} /></div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    {loading ? "Submitting..." : <><Send className="w-5 h-5" /> Submit College Partnership Application</>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConsultantSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Firm / Agency Name *</label><input required value={consultantForm.firmName} onChange={e => setConsultantForm({...consultantForm, firmName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Contact Person *</label><input required value={consultantForm.contactPerson} onChange={e => setConsultantForm({...consultantForm, contactPerson: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Email Address *</label><input required type="email" value={consultantForm.email} onChange={e => setConsultantForm({...consultantForm, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Phone Number *</label><input required type="tel" value={consultantForm.phone} onChange={e => setConsultantForm({...consultantForm, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">City / Base Location *</label><input required value={consultantForm.cityLocation} onChange={e => setConsultantForm({...consultantForm, cityLocation: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Years of Experience</label><input value={consultantForm.experience} onChange={e => setConsultantForm({...consultantForm, experience: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Specialization *</label><input required value={consultantForm.specialization} onChange={e => setConsultantForm({...consultantForm, specialization: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" placeholder="e.g. Engineering, MBA, Study Abroad" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Expected Leads / Month</label><input value={consultantForm.expectedLeads} onChange={e => setConsultantForm({...consultantForm, expectedLeads: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Preferred Partnership Model</label><input value={consultantForm.partnershipModel} onChange={e => setConsultantForm({...consultantForm, partnershipModel: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none" placeholder="e.g. Fixed Fee, Revenue Share" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Additional Notes</label><textarea value={consultantForm.additionalNotes} onChange={e => setConsultantForm({...consultantForm, additionalNotes: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:border-primary outline-none resize-none" rows={3} /></div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" disabled={loading} className="w-full py-5 bg-navy text-white font-extrabold rounded-2xl shadow-xl shadow-navy/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    {loading ? "Submitting..." : <><Send className="w-5 h-5" /> Submit Consultant Partnership Application</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
