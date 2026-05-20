import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-navy overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium animate-fade-in-up">
              <Sparkles className="w-4 h-4" />
              Admissions 2026 Open Now
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Expert Career
              <br />
              <span className="gradient-text">Counselling</span> &
              <br />
              Guidance
            </h1>

            <p className="text-lg text-gray-400 max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Expert career counselling, admission guidance, and bold strategies to help
              you dominate your professional goals. Your future starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/inquiry"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                Free Counselling <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/colleges"
                className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Explore Colleges
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-500">Students Guided</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-500">Partner Colleges</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 animate-float" style={{ animationDelay: "0s" }}>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-2">Career Growth</h3>
                <p className="text-sm text-gray-400">Strategic guidance for exponential career growth</p>
              </div>
              <div className="glass rounded-2xl p-6 animate-float" style={{ animationDelay: "1s" }}>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Top Placements</h3>
                <p className="text-sm text-gray-400">Our students placed at top MNCs and startups</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="glass rounded-2xl p-6 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-white font-semibold mb-2">Expert Mentors</h3>
                <p className="text-sm text-gray-400">Learn from industry professionals and alumni</p>
              </div>
              <div className="glass rounded-2xl p-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                <div className="relative">
                  <div className="text-4xl font-bold text-white mb-1">10x</div>
                  <div className="text-sm text-gray-300">Career Impact</div>
                  <p className="text-xs text-gray-400 mt-2">Average salary growth for our mentees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
