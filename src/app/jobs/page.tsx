"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getJobsAPI } from "@/services/api";
import { Search, MapPin, IndianRupee, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

interface Job { _id: string; title: string; company: string; salary: string; skills: string[]; location: string; description: string; type: string; createdAt: string; }
interface Pagination { page: number; pages: number; total: number; }

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      let params = `page=${page}&limit=8`;
      if (search) params += `&search=${search}`;
      if (typeFilter !== "All") params += `&type=${typeFilter}`;
      const { data } = await getJobsAPI(params);
      setJobs(data.data);
      setPagination(data.pagination);
    } catch { setJobs([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [typeFilter]);
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchJobs(); };
  const types = ["All", "Full-time", "Part-time", "Internship", "Contract", "Remote"];

  return (
    <main>
      <Navbar />
      <section className="pt-24 pb-8 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Job <span className="gradient-text">Opportunities</span></h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">Find your dream job from top companies across India.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search jobs, companies..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </form>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${typeFilter === t ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100"><div className="h-6 w-1/2 skeleton-shimmer rounded mb-3" /><div className="h-4 w-1/3 skeleton-shimmer rounded mb-4" /><div className="h-4 w-full skeleton-shimmer rounded" /></div>)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20"><p className="text-gray-500 text-lg">No jobs found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job._id} onClick={() => setSelectedJob(selectedJob?._id === job._id ? null : job)}
                  className={`cursor-pointer bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${selectedJob?._id === job._id ? "border-primary shadow-lg" : "border-gray-100 hover:border-primary/20"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-navy">{job.title}</h3>
                      <p className="text-gray-500 text-sm">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-semibold rounded-full">{job.type}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" />{job.salary}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">{job.skills.map((s) => <span key={s} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-medium">{s}</span>)}</div>
                  {selectedJob?._id === job._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                      <p className="text-gray-500 text-sm leading-relaxed">{job.description}</p>
                      <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">Apply Now</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => fetchJobs(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="w-5 h-5" /></button>
              {[...Array(pagination.pages)].map((_, i) => <button key={i} onClick={() => fetchJobs(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-medium ${pagination.page === i + 1 ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50"}`}>{i + 1}</button>)}
              <button onClick={() => fetchJobs(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
