import React from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, BookOpen, Globe, Award, Users, Laptop, Landmark } from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "MBA/PGDM Admission",
    description: "Strategic guidance for top-tier management programs across India.",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500",
    href: "/colleges?degree=MBA",
  },
  {
    icon: Laptop,
    title: "B.Tech Admission",
    description: "Engineering admissions consulting for premier institutes like IITs and NITs.",
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-500",
    href: "/colleges?degree=BTech",
  },
  {
    icon: BookOpen,
    title: "BBA/BCA Admission",
    description: "Foundation mapping for early professional undergraduate degrees.",
    color: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-500",
    href: "/colleges?degree=BBA",
  },
  {
    icon: Globe,
    title: "Study Abroad",
    description: "Comprehensive guidance for international university admissions.",
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-500",
    href: "/inquiry",
  },
  {
    icon: Briefcase,
    title: "Placement Support",
    description: "End-to-end interview prep and placement strategy for top companies.",
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-500",
    href: "/jobs",
  },
  {
    icon: Award,
    title: "Scholarship Support",
    description: "Identifying and applying for merit and need-based financial aid.",
    color: "from-yellow-500/20 to-yellow-600/20",
    iconColor: "text-yellow-500",
    href: "/inquiry",
  },
  {
    icon: Users,
    title: "Internship Support",
    description: "Personalized guidance to find the right internship for you.",
    color: "from-teal-500/20 to-teal-600/20",
    iconColor: "text-teal-500",
    href: "/internships",
  },
  {
    icon: Landmark,
    title: "Online Degrees",
    description: "Navigating flexible, globally recognized online education programs.",
    color: "from-indigo-500/20 to-indigo-600/20",
    iconColor: "text-indigo-500",
    href: "/online-degree-certification",
  },
];

export default function ServicesSection() {
  // Mapping dynamic hover border utility states based on icon colors safely
  const borderHoverStyles: { [key: string]: string } = {
    "text-blue-500": "hover:border-blue-500/80 hover:shadow-blue-500/5",
    "text-purple-500": "hover:border-purple-500/80 hover:shadow-purple-500/5",
    "text-green-500": "hover:border-green-500/80 hover:shadow-green-500/5",
    "text-orange-500": "hover:border-orange-500/80 hover:shadow-orange-500/5",
    "text-red-500": "hover:border-red-500/80 hover:shadow-red-500/5",
    "text-yellow-500": "hover:border-yellow-500/80 hover:shadow-yellow-500/5",
    "text-teal-500": "hover:border-teal-500/80 hover:shadow-teal-500/5",
    "text-indigo-500": "hover:border-indigo-500/80 hover:shadow-indigo-500/5",
  };

  return (
    <section className="py-7 bg-slate-50/50 relative overflow-hidden" id="services">
      {/* Decorative Grid Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Modernized Header */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase bg-white border border-gray-200/80 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Our Services
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-navy tracking-tight max-w-3xl mx-auto leading-[1.15]">
            End-to-End Support for Your{" "}
            <span className="gradient-text relative inline-block">Education Journey</span>
          </h2>
          <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From admission guidance to placement support, we cover every aspect of your
            academic and professional journey.
          </p>
        </div>

        {/* Dynamic Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const hoverClass = borderHoverStyles[service.iconColor] || "hover:border-gray-400";
            
            return (
              <Link
                href={service.href}
                key={service.title}
                className={`group relative p-8 bg-white border border-gray-200/80 rounded-[2rem] transition-all duration-300 cursor-pointer hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-[0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-xl ${hoverClass}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  {/* Card Header Info */}
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner`}>
                      <Icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    {/* Index Sequence Counter */}
                    <span className="text-2xl font-black text-gray-100 group-hover:text-black/5 select-none transition-colors duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}