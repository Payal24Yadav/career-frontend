"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, MoreVertical, BookOpen, Star } from "lucide-react";
import { getMockTestsAPI, updateMockTestAPI, deleteMockTestAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function AdminMockTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchTests = async () => {
    try {
      const { data } = await getMockTestsAPI("admin=true");
      setTests(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch mock tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this mock test? This action cannot be undone.")) {
      try {
        await deleteMockTestAPI(id);
        toast.success("Mock test deleted successfully");
        fetchTests();
      } catch (error) {
        toast.error("Failed to delete mock test");
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateMockTestAPI(id, { status: newStatus });
      toast.success("Status updated");
      fetchTests();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleFeatured = async (test: any) => {
    try {
      await updateMockTestAPI(test._id, { isFeatured: !test.isFeatured });
      toast.success(test.isFeatured ? "Removed from featured" : "Added to featured");
      fetchTests();
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Mock Tests Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage mock exams, series, and practice tests</p>
        </div>
        <Link
          href="/admin/mock-tests/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Mock Test
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search mock tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            <option value="All">All Categories</option>
            <option value="MBA & Management">MBA & Management</option>
            <option value="Engineering (B.Tech)">Engineering (B.Tech)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Title & Category</th>
                <th className="px-6 py-4 font-semibold text-center">Featured</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No mock tests found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{test.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{test.category}</span>
                        <span className="text-gray-400">/{test.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleFeatured(test)}
                        className={`p-1.5 rounded-full transition-colors ${
                          test.isFeatured 
                            ? "bg-amber-100 text-amber-500 hover:bg-amber-200" 
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={test.isFeatured ? "Remove from featured" : "Mark as featured"}
                      >
                        <Star className={`w-4 h-4 ${test.isFeatured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={test.status}
                        onChange={(e) => handleStatusChange(test._id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 ${
                          test.status === 'active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                            : test.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500'
                            : 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/mock-tests/edit/${test._id}`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(test._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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
      </div>
    </div>
  );
}
