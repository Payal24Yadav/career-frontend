"use client";
import React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const quickLinks = [
  { name: "Top Colleges", href: "/colleges" },
  { name: "Latest Blogs", href: "/blog" },
  { name: "Job Opportunities", href: "/jobs" },
  { name: "Partner With Us", href: "/partner-with-us" },
  { name: "Contact Us", href: "/contact" },
  { name: "About Us", href: "/about" },
];

const courses = [
  "MBA/PGDM Admission",
  "B.Tech Admission",
  "BBA/BCA Programs",
  "Study Abroad",
  "Online Degrees",
  "Career Counselling",
];

const resources = [
  { name: "Mock Test Hub", href: "/mock-tests", badge: "NEW" },
  { name: "Free CAT Mock 2026", href: "/tools/cat-mock-test", badge: "POPULAR" },
  { name: "Free JEE Mock 2026", href: "/tools/jee-mock-test", badge: "NEW" },
  { name: "PYQ Papers", href: "/pyq-papers" },
  { name: "Resume Score & Audit", href: "/resume-score", badge: "NEW" },
  { name: "Online Degrees", href: "/online-degree-certification" },
  { name: "Abroad Education", href: "/inquiry" },
  { name: "Certifications", href: "/certifications", badge: "NEW" },
  { name: "Govt Jobs", href: "/govt-jobs" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to Start Your Career Journey?
              </h3>
              <p className="text-gray-400">
                Get expert guidance for Admissions 2026, career counselling, and more.
              </p>
            </div>
            <Link
              href="/inquiry"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Career<span className="text-accent">Path</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your ultimate destination for career counselling, college admissions, and
              professional growth. We help you build a 10x career.
            </p>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent" />
                +91 98765 43210
              </a>
              <a href="mailto:info@careerpath.com" className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent" />
                info@careerpath.com
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-accent" />
                New Delhi, India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-lg">Resources</h4>
            <ul className="space-y-3">
              {resources.map((res) => (
                <li key={res.name} className="flex items-center flex-wrap gap-2">
                  <Link
                    href={res.href}
                    className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {res.name}
                  </Link>
                  {res.badge === "NEW" && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                      NEW
                    </span>
                  )}
                  {res.badge === "POPULAR" && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                      POPULAR
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-lg">Our Services</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course}>
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {course}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-lg">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest updates on admissions, exams, and career opportunities.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
                suppressHydrationWarning
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500" suppressHydrationWarning>
            © {new Date().getFullYear()} CareerPath. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
