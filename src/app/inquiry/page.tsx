"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, Send } from "lucide-react";
import { useState } from "react";
import { submitInquiryAPI } from "@/services/api";
import toast from "react-hot-toast";

const courses = ["MBA/PGDM", "B.Tech", "BBA", "BCA", "Medical (MBBS)", "Law", "Study Abroad", "Online MBA", "Career Counselling", "Other"];

export default function InquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course) return toast.error("Please select a course");
    
    const loadId = toast.loading("Submitting inquiry...");
    setLoading(true);
    try { 
      await submitInquiryAPI(form); 
      setSuccess(true); 
      setForm({ name: "", email: "", phone: "", course: "", message: "" }); 
      toast.success("Inquiry submitted successfully!", { id: loadId });
    } catch { 
      toast.error("Failed to submit. Please try again.", { id: loadId }); 
    } finally { setLoading(false); }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-24 min-h-screen bg-gradient-to-b from-navy to-navy-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6"><GraduationCap className="w-8 h-8 text-white" /></div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Get Free <span className="gradient-text">Career Counselling</span></h1>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">Fill in the form below and our expert counsellors will reach out to you within 24 hours.</p>
          </div>

          {success ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-2xl font-bold text-navy mb-2">Inquiry Submitted!</h3>
              <p className="text-gray-500">Thank you! Our counsellor will contact you within 24 hours.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors">Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 space-y-6 shadow-2xl">
              <div className="grid sm:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-navy mb-2">Full Name *</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Your full name" /></div>
                <div><label className="block text-sm font-medium text-navy mb-2">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="+91 98765 43210" /></div>
              </div>
              <div><label className="block text-sm font-medium text-navy mb-2">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="you@example.com" /></div>
              <div><label className="block text-sm font-medium text-navy mb-2">Course of Interest *</label>
                <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option value="">Select a course</option>{courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-navy mb-2">Message</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" placeholder="Tell us about your goals..." /></div>
              <button type="submit" disabled={loading} className="w-full px-6 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 text-lg">
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>
              <p className="text-xs text-center text-gray-400">By submitting, you agree to our privacy policy. We will never share your information.</p>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
