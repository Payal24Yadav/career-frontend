"use client";
import { useState, useEffect } from "react";
import { getStatsAPI } from "@/services/api";
import {
  FileText, Briefcase, Building2, MessageSquare, Star, TrendingUp, GraduationCap,
  Users
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Stats {
  counts: {
    blogs: number; jobs: number; colleges: number; inquiries: number; testimonials: number; collegePartners: number;
    consultantPartners: number;
  };
  recentInquiries: any[];
  recentBlogs: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try { const { data } = await getStatsAPI(); setStats(data.data); } catch { } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    { label: "Total Blogs", value: stats.counts.blogs, icon: FileText, color: "bg-blue-500", bg: "bg-blue-50" },
    { label: "Total Jobs", value: stats.counts.jobs, icon: Briefcase, color: "bg-green-500", bg: "bg-green-50" },
    { label: "Total Colleges", value: stats.counts.colleges, icon: Building2, color: "bg-purple-500", bg: "bg-purple-50" },
    { label: "Total Inquiries", value: stats.counts.inquiries, icon: MessageSquare, color: "bg-orange-500", bg: "bg-orange-50" },
    { label: "Testimonials", value: stats.counts.testimonials, icon: Star, color: "bg-yellow-500", bg: "bg-yellow-50" },
    {
      label: "College Partners",
      value: stats.counts.collegePartners,
      icon: GraduationCap,
      color: "bg-pink-500",
      bg: "bg-pink-50",
      link: "/admin/college-partners"
    },

    // NEW CARD
    {
      label: "Consultant Partners",
      value: stats.counts.consultantPartners,
      icon: Users,
      color: "bg-cyan-500",
      bg: "bg-cyan-50",
      link: "/admin/consultant-partners"
    },
  ] : [];

  if (loading) return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6"><div className="h-8 w-16 skeleton-shimmer rounded mb-2" /><div className="h-4 w-24 skeleton-shimmer rounded" /></div>)}</div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your platform overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500"><TrendingUp className="w-4 h-4 text-green-500" /> All systems operational</div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          const CardContent = (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`} />
                </div>
              </div>

              <div className="text-2xl font-bold text-navy">
                {stat.value}
              </div>

              <div className="text-sm text-gray-500">
                {stat.label}
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={stat.label} href={stat.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={stat.label}>
              {CardContent}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-navy">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats?.recentInquiries.map((inq: any) => (
              <div key={inq._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">{inq.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between"><span className="font-medium text-sm text-navy">{inq.name}</span><span className="text-xs text-gray-400">{formatDate(inq.createdAt)}</span></div>
                  <div className="text-xs text-gray-500">{inq.course} • {inq.email}</div>
                </div>
              </div>
            ))}
            {(!stats?.recentInquiries || stats.recentInquiries.length === 0) && <p className="text-sm text-gray-500 text-center py-4">No inquiries yet</p>}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-navy">Recent Blogs</h2>
            <Link href="/admin/blogs" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats?.recentBlogs.map((blog: any) => (
              <div key={blog._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-sm font-bold flex-shrink-0">{blog.title.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-navy truncate">{blog.title}</div>
                  <div className="text-xs text-gray-500">{blog.category} • {formatDate(blog.createdAt)}</div>
                </div>
              </div>
            ))}
            {(!stats?.recentBlogs || stats.recentBlogs.length === 0) && <p className="text-sm text-gray-500 text-center py-4">No blogs yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
