"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Briefcase, ArrowRight, IndianRupee } from "lucide-react";
import { getJobsAPI } from "@/services/api";

interface Job {
  _id: string;
  title: string;
  company: string;
  salary: string;
  skills: string[];
  location: string;
  type: string;
}

export default function JobOpportunities() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobsAPI("limit=4");
        setJobs(data.data);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Opportunities</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy">
              Latest <span className="gradient-text">Job Openings</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg">Discover exciting career opportunities from top companies.</p>
          </div>
          <Link href="/jobs" className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="h-6 w-1/2 skeleton-shimmer rounded mb-3" />
                <div className="h-4 w-1/3 skeleton-shimmer rounded mb-4" />
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-16 skeleton-shimmer rounded-full" />
                  <div className="h-6 w-20 skeleton-shimmer rounded-full" />
                </div>
                <div className="h-4 w-1/4 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/50 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-semibold rounded-full">
                    {job.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {job.salary}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1 text-sm text-primary font-semibold group-hover:gap-2 transition-all"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
