"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getInternshipsAPI, deleteInternshipAPI, updateInternshipAPI } from "@/services/api";
import { Plus, Edit, Trash2, Search, Briefcase, Star, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const categories = [
    "All",
    "Software Development",
    "Web Development",
    "Data Science",
    "Digital Marketing",
    "Graphic Design",
    "Business Development",
    "Finance",
    "HR"
  ];

  const fetchInternships = async (p = 1) => {
    setLoading(true);
    try {
      let params = `page=${p}&limit=10&admin=true`;
      if (search) params += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter !== "All") params += `&category=${encodeURIComponent(categoryFilter)}`;
      
      const { data } = await getInternshipsAPI(params);
      setInternships(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: data.count || 0 });
      setPage(p);
    } catch (err) {
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(1);
  }, [categoryFilter]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchInternships(1);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const toastId = toast.loading("Updating status...");
    try {
      await updateInternshipAPI(id, { status: newStatus });
      setInternships((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      toast.success(`Internship status set to ${newStatus}`, { id: toastId });
    } catch (err) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const handleFeaturedToggle = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    const toastId = toast.loading(nextFeatured ? "Marking featured..." : "Removing featured...");
    try {
      await updateInternshipAPI(id, { isFeatured: nextFeatured });
      setInternships((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isFeatured: nextFeatured } : item))
      );
      toast.success(nextFeatured ? "Internship marked as Featured" : "Featured tag removed", { id: toastId });
    } catch (err) {
      toast.error("Failed to update featured flag", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this internship? This cannot be undone.")) return;
    const toastId = toast.loading("Deleting internship...");
    try {
      await deleteInternshipAPI(id);
      toast.success("Internship deleted successfully", { id: toastId });
      setInternships((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete internship", { id: toastId });
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Manage Internships
          </h1>
          <p className="text-gray-400 text-xs mt-1">Create, update, curate, or delete active educational internships.</p>
        </div>
        <Link
          href="/admin/internships/new"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Internship
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, company, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shrink-0"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchInternships(1)}
              className="px-4 py-2 bg-navy text-white font-bold text-xs rounded-xl hover:bg-primary transition-all shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title & Company</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stipend</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Featured</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-5">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500 font-medium">
                    No internships found. Click "Add Internship" to create one.
                  </td>
                </tr>
              ) : (
                internships.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-bold text-navy">{item.title}</div>
                        <div className="text-xs text-gray-400 font-medium">{item.companyName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-navy">{item.category}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{item.location}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.stipend}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleFeaturedToggle(item._id, item.isFeatured)}
                        className={`p-1.5 rounded-lg transition-colors inline-block ${
                          item.isFeatured ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-gray-300 hover:text-navy hover:bg-gray-100"
                        }`}
                        title={item.isFeatured ? "Featured Internship" : "Click to mark Featured"}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                          item.status === "active"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : item.status === "closed"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-orange-50 text-orange-600 border-orange-200"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/internships/edit/${item._id}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Internship"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Internship"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {!loading && pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-navy">
            <span className="text-gray-400">
              Page {page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => fetchInternships(page - 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:bg-white"
              >
                Previous
              </button>
              <button
                disabled={page === pagination.pages}
                onClick={() => fetchInternships(page + 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
