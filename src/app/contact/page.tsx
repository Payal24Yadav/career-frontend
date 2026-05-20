"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { submitInquiryAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading("Sending message...");
    setLoading(true);
    try { 
      await submitInquiryAPI(form); 
      setSuccess(true); 
      setForm({ name: "", email: "", phone: "", course: "General Inquiry", message: "" }); 
      toast.success("Message sent successfully!", { id: loadId });
    } catch { 
      toast.error("Failed to send message. Please try again.", { id: loadId }); 
    } finally { setLoading(false); }
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
    { icon: Mail, label: "Email", value: "info@careerpath.com", href: "mailto:info@careerpath.com" },
    { icon: MapPin, label: "Address", value: "New Delhi, India" },
    { icon: Clock, label: "Working Hours", value: "Mon-Sat, 9AM-7PM" },
  ];

  return (
    <main>
      <Navbar />
      <section className="pt-24 pb-8 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Contact <span className="gradient-text">Us</span></h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">Get in touch with our expert career counsellors today.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">Get in Touch</h2>
              <p className="text-gray-500">Have questions? We would love to hear from you. Reach out and our team will respond within 24 hours.</p>
              <div className="space-y-4">
                {contactInfo.map((item) => { const Icon = item.icon; return (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-primary" /></div>
                    <div><div className="text-sm text-gray-500">{item.label}</div>
                      {item.href ? <a href={item.href} className="font-semibold text-navy hover:text-primary transition-colors">{item.value}</a> : <div className="font-semibold text-navy">{item.value}</div>}
                    </div>
                  </div>
                );})}
              </div>
            </div>

            <div className="lg:col-span-2">
              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-green-600" /></div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-600">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-navy mb-2">Full Name *</label>
                      <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white" placeholder="Your name" /></div>
                    <div><label className="block text-sm font-medium text-navy mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white" placeholder="you@example.com" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-navy mb-2">Phone *</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white" placeholder="+91 98765 43210" /></div>
                    <div><label className="block text-sm font-medium text-navy mb-2">Subject</label>
                      <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white">
                        <option>General Inquiry</option><option>MBA Admission</option><option>B.Tech Admission</option><option>Study Abroad</option><option>Career Counselling</option><option>Placement Support</option>
                      </select></div>
                  </div>
                  <div><label className="block text-sm font-medium text-navy mb-2">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white resize-none" placeholder="How can we help you?" /></div>
                  <button type="submit" disabled={loading} className="w-full px-6 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? "Sending..." : <><Send className="w-5 h-5" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
