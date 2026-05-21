"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      desc: "We collect information you provide directly to us when using CareerPath services, including your name, email address, phone number, academic records, resume files, and career preferences.",
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      desc: "Your data is used to deliver premium career counselling, process mock exam registrations, analyze resumes via our ATS tool, and suggest matching government jobs and internships.",
    },
    {
      icon: Shield,
      title: "Information Sharing & Security",
      desc: "We do not sell your personal data. We only share information with certified academic partner institutions under strict confidentiality agreements. All traffic is secured via SSL/TLS encryption.",
    },
    {
      icon: FileText,
      title: "Your Privacy Rights",
      desc: "You hold absolute rights to inspect, modify, download, or permanently delete any of your personal records from our database. Simply submit a deletion request via our support channels.",
    },
  ];

  return (
    <main className="min-h-screen bg-navy flex flex-col justify-between">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-28 pb-16 relative overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">Compliance & Trust</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Privacy Policy</h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            At CareerPath, your privacy is our utmost priority. Learn how we safeguard your data and secure your personal records.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {sections.map((sec, index) => {
              const Icon = sec.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{sec.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{sec.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Details / Standard Copy */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-navy mb-6">Detailed Data Policy Rules</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-navy flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  1. Data Collection Methods
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  We gather details directly when you register an account, upload a resume for grading, submit university admission applications, or submit a request on our contact form.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-navy flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  2. Cookies and Device Tracking
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  CareerPath employs lightweight standard cookies to remember login sessions, optimize user navigation states, and gather anonymous analytics regarding site usage performance.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-navy flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  3. Retention Period
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  Your academic records and uploaded resume profiles are deleted from our primary servers after 12 months of inactivity, unless you explicitly request prior purging.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">
                Last updated: May 2026. For inquiries, email us at <a href="mailto:privacy@careerpath.com" className="text-primary hover:underline font-medium">privacy@careerpath.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
