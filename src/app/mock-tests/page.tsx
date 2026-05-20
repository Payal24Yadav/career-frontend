"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMockTestsAPI } from "@/services/api";
import { Search, BookOpen, ArrowRight, Star, GraduationCap } from "lucide-react";

interface MockTest {
  _id: string;
  title: string;
  slug: string;
  category: string;
  subtitle: string;
  badgeType?: string;
  isFeatured: boolean;
}

const defaultMockTests: MockTest[] = [
  {
    _id: "seed-cat",
    title: "CAT 2026",
    subtitle: "Common Admission Test Practice Series",
    category: "MBA & Management",
    badgeType: "HOT",
    slug: "cat-mock-test",
    isFeatured: true,
  },
  {
    _id: "seed-xat",
    title: "XAT 2026",
    subtitle: "Xavier Aptitude Test Practice Series",
    category: "MBA & Management",
    badgeType: "NEW",
    slug: "xat-mock-test",
    isFeatured: false,
  },
  {
    _id: "seed-snap",
    title: "SNAP Dec 2026",
    subtitle: "Symbiosis National Aptitude Test Practice Series",
    category: "MBA & Management",
    badgeType: "HOT",
    slug: "snap",
    isFeatured: true,
  },
  {
    _id: "seed-nmat",
    title: "NMAT 2026",
    subtitle: "NMAT by GMAC Preparation Series",
    category: "MBA & Management",
    badgeType: "EXPERT",
    slug: "nmat-mock-test",
    isFeatured: false,
  },
  {
    _id: "seed-atma",
    title: "ATMA 2026",
    subtitle: "AIMS Test for Management Admissions Series",
    category: "MBA & Management",
    badgeType: "LATEST",
    slug: "atma-mock-test",
    isFeatured: false,
  },
  {
    _id: "seed-jee-main",
    title: "JEE Main",
    subtitle: "Joint Entrance Examination - Mains Series",
    category: "Engineering (B.Tech)",
    badgeType: "HOT",
    slug: "jee-main-mock-test",
    isFeatured: true,
  },
  {
    _id: "seed-jee-adv",
    title: "JEE Advanced",
    subtitle: "Joint Entrance Examination - Advanced Series",
    category: "Engineering (B.Tech)",
    badgeType: "EXPERT",
    slug: "jee-advanced-mock-test",
    isFeatured: true,
  },
  {
    _id: "seed-bitsat",
    title: "BITSAT 2026",
    subtitle: "Birla Institute of Technology Aptitude Test",
    category: "Engineering (B.Tech)",
    badgeType: "NEW",
    slug: "bitsat-mock-test",
    isFeatured: false,
  },
  {
    _id: "seed-viteee",
    title: "VITEEE 2026",
    subtitle: "Vellore Institute of Technology Entrance Exam",
    category: "Engineering (B.Tech)",
    badgeType: "LATEST",
    slug: "viteee-mock-test",
    isFeatured: false,
  },
  {
    _id: "seed-srmjeee",
    title: "SRMJEEE 2026",
    subtitle: "SRM Joint Engineering Entrance Exam Series",
    category: "Engineering (B.Tech)",
    badgeType: "NEW",
    slug: "srmjeee-mock-test",
    isFeatured: false,
  },
];

export default function MockTestsHubPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await getMockTestsAPI("status=active");
        if (data.data && data.data.length > 0) {
          setTests(data.data);
        } else {
          setTests(defaultMockTests);
        }
      } catch (err) {
        setTests(defaultMockTests);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const getRoute = (slug: string) => {
    if (slug === "cat-mock-test") return "/tools/cat-mock-test";
    if (slug === "snap") return "/tools/mock-test/snap";
    if (slug === "atma-mock-test") return "/tools/atma-mock-test";
    return `/mock-tests/${slug}`;
  };

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const mbaTests = filteredTests.filter((t) => t.category === "MBA & Management");
  const engineeringTests = filteredTests.filter((t) => t.category === "Engineering (B.Tech)");

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-24 pb-12 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase bg-white border border-gray-200/80 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            100% Free Practice
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Mock Test <span className="gradient-text">Practice Hub</span> 2026
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Sharpen your accuracy with professional mock test environments curated to match official exam difficulty levels.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exam mock series (e.g. CAT, SNAP)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm shadow-lg text-navy"
            />
          </div>
        </div>
      </section>

      {/* Lists Sections */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* MBA Section */}
        {mbaTests.length > 0 && (
          <div>
            <div className="border-b border-gray-200/60 pb-4 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-navy">MBA & Management Mock Series</h2>
                <p className="text-gray-400 text-xs mt-0.5">Top MBA exams practice tests curated by specialists.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mbaTests.map((t) => (
                <Link
                  key={t._id}
                  href={getRoute(t.slug)}
                  className="group bg-white border border-gray-100 hover:border-primary/20 rounded-[2rem] p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  {t.isFeatured && (
                    <span className="absolute top-0 right-0 bg-primary/10 text-primary text-[8px] uppercase tracking-widest font-black py-1 px-3.5 rounded-bl-xl">
                      Featured
                    </span>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                        MBA
                      </span>
                      {t.badgeType && (
                        <span className="text-[8px] font-black uppercase bg-rose-500 text-white px-2 py-0.5 rounded shadow">
                          {t.badgeType}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-navy group-hover:text-primary transition-colors mt-2">
                      {t.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-3">
                      {t.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-primary border-t border-gray-50 pt-4">
                    <span>Unlock Free Mock</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Engineering Section */}
        {engineeringTests.length > 0 && (
          <div>
            <div className="border-b border-gray-200/60 pb-4 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-navy">Engineering (B.Tech) Mock Series</h2>
                <p className="text-gray-400 text-xs mt-0.5">Top undergraduate engineering entrance test practice papers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {engineeringTests.map((t) => (
                <Link
                  key={t._id}
                  href={getRoute(t.slug)}
                  className="group bg-white border border-gray-100 hover:border-primary/20 rounded-[2rem] p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  {t.isFeatured && (
                    <span className="absolute top-0 right-0 bg-primary/10 text-primary text-[8px] uppercase tracking-widest font-black py-1 px-3.5 rounded-bl-xl">
                      Featured
                    </span>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                        B.Tech
                      </span>
                      {t.badgeType && (
                        <span className="text-[8px] font-black uppercase bg-rose-500 text-white px-2 py-0.5 rounded shadow">
                          {t.badgeType}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-navy group-hover:text-primary transition-colors mt-2">
                      {t.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-3">
                      {t.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-primary border-t border-gray-50 pt-4">
                    <span>Unlock Free Mock</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredTests.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy">No Mock Tests Found</h3>
            <p className="text-gray-400 text-sm mt-1">We couldn't find any mock tests matching your search query.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
