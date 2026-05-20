"use client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import FeaturedColleges from "@/components/FeaturedColleges";
import LatestBlogs from "@/components/LatestBlogs";
import AdmissionNews from "@/components/AdmissionNews";
import JobOpportunities from "@/components/JobOpportunities";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AdmissionNews />
      <FeaturedColleges />
      <LatestBlogs />
      <JobOpportunities />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
