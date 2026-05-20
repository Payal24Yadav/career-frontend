"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollegeCard from "@/components/CollegeCard";
import { getCollegesAPI } from "@/services/api";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X, LayoutGrid, List } from "lucide-react";

const states = ["Delhi", "Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Haryana", "Rajasthan", "Punjab"];
const degrees = ["MBA", "BTech", "Medical", "Law", "BBA", "BCA"];
const ownerships = ["Private", "Government"];

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  
  // Filter States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read URL search parameter for degree on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const degreeParam = urlParams.get("degree");
      if (degreeParam) {
        setSelectedDegree(degreeParam);
      }
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      let params = `page=${page}&limit=9&sort=${sortBy}`;
      if (debouncedSearch) params += `&search=${debouncedSearch}`;
      if (selectedState) params += `&state=${selectedState}`;
      if (selectedDegree) params += `&degreeType=${selectedDegree}`;
      if (selectedOwnership) params += `&ownershipType=${selectedOwnership}`;

      const { data } = await getCollegesAPI(params);
      setColleges(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch colleges", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedState, selectedDegree, selectedOwnership, sortBy]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const resetFilters = () => {
    setSearch("");
    setSelectedState("");
    setSelectedDegree("");
    setSelectedOwnership("");
    setSortBy("newest");
    setPage(1);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Header Section */}
      <section className="pt-24 pb-12 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Explore Top <span className="gradient-text">Colleges & Universities</span> 2026
              </h1>
              <p className="text-gray-400 text-lg">
                Discover your perfect educational destination with detailed profiles, placement data, and authentic reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Sort Bar */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by college name, course, or location..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rating</option>
                <option value="fees">Lowest Fees</option>
                <option value="placement">Highest Placement</option>
                <option value="az">A - Z Order</option>
              </select>
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden p-3 bg-primary text-white rounded-2xl"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-40 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-navy flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
                  </h3>
                  <button onClick={resetFilters} className="text-xs text-primary font-bold hover:underline">Reset All</button>
                </div>
                
                {/* State Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">State</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                    {states.map(state => (
                      <label key={state} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="state" 
                          checked={selectedState === state}
                          onChange={() => setSelectedState(state)}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" 
                        />
                        <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Degree Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Degree Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {degrees.map(degree => (
                      <button 
                        key={degree}
                        onClick={() => setSelectedDegree(selectedDegree === degree ? "" : degree)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedDegree === degree ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary"}`}
                      >
                        {degree}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ownership Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Ownership</h4>
                  <div className="space-y-2">
                    {ownerships.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="ownership" 
                          checked={selectedOwnership === type}
                          onChange={() => setSelectedOwnership(type)}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" 
                        />
                        <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Widget */}
              <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-2xl text-white">
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-xs text-gray-400 mb-4">Talk to our expert counsellors for personalized guidance.</p>
                <button className="w-full py-2 bg-accent text-navy text-xs font-extrabold rounded-lg hover:bg-white transition-colors">Book Free Session</button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500 font-medium">
                Showing <span className="text-navy font-bold">{colleges.length}</span> of <span className="text-navy font-bold">{pagination.total || 0}</span> Colleges
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                <button className="p-1.5 bg-gray-50 text-navy rounded-lg"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 text-gray-400 hover:text-navy"><List className="w-4 h-4" /></button>
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                    <div className="h-6 bg-gray-100 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="h-12 bg-gray-50 rounded-xl" />
                      <div className="h-12 bg-gray-50 rounded-xl" />
                    </div>
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">No Colleges Found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any colleges matching your current filters. Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard key={college._id} college={college} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="p-3 border border-gray-200 rounded-2xl bg-white text-navy hover:bg-navy hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-navy transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 rounded-2xl text-sm font-bold transition-all ${page === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={page === pagination.pages}
                      onClick={() => setPage(page + 1)}
                      className="p-3 border border-gray-200 rounded-2xl bg-white text-navy hover:bg-navy hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-navy transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-navy">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            
            {/* Same Filters as Desktop but for Mobile */}
            <div className="space-y-8">
              {/* Add mobile versions of filters here if needed or reuse component */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">State</h4>
                <div className="grid grid-cols-2 gap-3">
                  {states.map(state => (
                    <button 
                      key={state}
                      onClick={() => setSelectedState(state === selectedState ? "" : state)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedState === state ? "bg-primary text-white" : "bg-gray-50 border border-transparent text-gray-600"}`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
              {/* ... more mobile filters */}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <button onClick={resetFilters} className="py-4 border border-gray-200 rounded-2xl font-bold text-navy">Reset</button>
              <button onClick={() => setShowMobileFilters(false)} className="py-4 bg-primary text-white rounded-2xl font-bold">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
