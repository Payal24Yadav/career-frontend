"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, Users, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  const rules = [
    {
      icon: Users,
      title: "Account Registration & Safety",
      desc: "To access Mock Test registrations, expert counselling forms, and resume tools, users must supply authentic, accurate personal identifiers and secure their credential passcodes.",
    },
    {
      icon: Scale,
      title: "Acceptable Use Boundaries",
      desc: "You may not engage in reverse engineering, server penetration tests, scrape our certification database, or disrupt network connections to the live Render host.",
    },
    {
      icon: ShieldAlert,
      title: "Intellectual Property Rights",
      desc: "All source files, logo seals, premium mock test questions, resume templates, and portal software remain exclusive properties of CareerPath and proprietary partners.",
    },
    {
      icon: Award,
      title: "Disclaimer of Liability",
      desc: "Counselling evaluations and resume ratings constitute recommendation models. Final academic admissions and job interview results depend purely on your direct actions.",
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
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">User Agreement</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Terms of Service</h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Please read these terms and conditions carefully before utilizing CareerPath systems and expert counselling resources.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {rules.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{rule.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{rule.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Details / Standard Copy */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-navy mb-6">Terms Conditions and Policy Details</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-navy flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  1. Agreement of Service Usage
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  By accessing the CareerPath platform, you affirm your agreement with our service criteria and all local regional laws. If you disagree, access to portal content is revoked.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-navy flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  2. User Content Contribution
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  When submitting testimonials, inquiries, or uploading files, you declare ownership or necessary rights over those materials and authorize CareerPath to process them.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-navy flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  3. Access Termination
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  We reserve the right to suspend user profiles or block network addresses for users showing persistent malicious behaviour, database abuse, or payment breaches.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">
                Last updated: May 2026. For questions on these terms, contact <a href="mailto:support@careerpath.com" className="text-primary hover:underline font-medium">support@careerpath.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
