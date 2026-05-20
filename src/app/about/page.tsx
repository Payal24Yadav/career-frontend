"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Users, Award, TrendingUp, CheckCircle } from "lucide-react";

const stats = [
  { value: "500+", label: "Students Guided" },
  { value: "50+", label: "Partner Colleges" },
  { value: "95%", label: "Success Rate" },
  { value: "100+", label: "Companies Hiring" },
];

const values = [
  { icon: Target, title: "Personalized Approach", desc: "Every student gets a customized roadmap based on their unique goals and strengths." },
  { icon: Users, title: "Expert Mentors", desc: "Our team includes IIM/IIT alumni, industry leaders, and certified career counsellors." },
  { icon: Award, title: "Proven Results", desc: "95% of our students secure admission in their top 3 preferred colleges." },
  { icon: TrendingUp, title: "End-to-End Support", desc: "From exam prep to placement — we are with you at every step of the journey." },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">About Us</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Your Trusted <span className="gradient-text">Career Partner</span></h1>
            <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">We are dedicated to transforming students&apos; careers through expert guidance, personalized counselling, and unwavering support.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Mission</span>
              <h2 className="mt-3 text-3xl font-bold text-navy">Empowering Students to Build <span className="gradient-text">10x Careers</span></h2>
              <p className="mt-6 text-gray-500 leading-relaxed">CareerPath was founded with a simple mission — to democratize access to quality career guidance. We believe every student deserves expert mentorship, regardless of their background.</p>
              <p className="mt-4 text-gray-500 leading-relaxed">Our team of experienced counsellors, IIM/IIT alumni, and industry professionals work together to provide personalized guidance that helps students make informed decisions about their education and career.</p>
              <div className="mt-8 space-y-3">
                {["Free initial consultation for all students", "Personalized career roadmap creation", "24/7 support throughout the admission process", "Post-admission mentorship and guidance"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="mt-3 text-3xl font-bold text-navy">Our Core <span className="gradient-text">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => { const Icon = v.icon; return (
              <div key={v.title} className="bg-white rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Icon className="w-7 h-7 text-primary" /></div>
                <h3 className="font-bold text-navy mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            );})}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
