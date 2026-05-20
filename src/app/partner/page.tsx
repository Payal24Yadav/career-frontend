"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Handshake, Building2, Users, TrendingUp, Send } from "lucide-react";
import { useState } from "react";
import { submitInquiryAPI } from "@/services/api";
import toast from "react-hot-toast";

const benefits = [
  { icon: Users, title: "Wider Reach", desc: "Connect with thousands of students actively seeking admissions and career guidance." },
  { icon: TrendingUp, title: "Brand Visibility", desc: "Get featured on our platform and reach your target audience effectively." },
  { icon: Building2, title: "Quality Leads", desc: "Receive qualified student inquiries directly relevant to your institution." },
  { icon: Handshake, title: "Long-term Partnership", desc: "Build lasting relationships with dedicated support and regular engagement." },
];

export default function PartnerPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "Partnership Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading("Submitting request...");
    setLoading(true);
    try { 
      await submitInquiryAPI(form); 
      setSuccess(true); 
      toast.success("Partnership request sent!", { id: loadId });
    } catch { 
      toast.error("Failed to submit request.", { id: loadId }); 
    } finally { setLoading(false); }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-24 pb-8 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Partner <span className="gradient-text">With Us</span></h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">Join our growing network of educational institutions and organizations.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((b) => { const Icon = b.icon; return (
              <div key={b.title} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-7 h-7 text-primary" /></div>
                <h3 className="font-bold text-navy mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            );})}
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-navy text-center mb-8">Become a Partner</h2>
            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                <Send className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Request Submitted!</h3>
                <p className="text-green-600">Our partnership team will contact you shortly.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-navy mb-2">Organization Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary" placeholder="Your organization" /></div>
                  <div><label className="block text-sm font-medium text-navy mb-2">Contact Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary" placeholder="email@org.com" /></div>
                </div>
                <div><label className="block text-sm font-medium text-navy mb-2">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary" placeholder="+91 98765 43210" /></div>
                <div><label className="block text-sm font-medium text-navy mb-2">Partnership Details</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary resize-none" placeholder="Tell us about your organization and partnership goals..." /></div>
                <button type="submit" disabled={loading} className="w-full px-6 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? "Submitting..." : "Submit Partnership Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
