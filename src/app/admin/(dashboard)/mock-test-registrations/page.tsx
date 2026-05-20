"use client";

import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Download, Mail, MapPin, Phone, Search, Trash2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { deleteMockTestRegistrationAPI, getMockTestRegistrationsAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";

type Registration = {
  _id: string;
  examTitle: string;
  examSlug?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function AdminMockTestRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [exams, setExams] = useState<string[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(pagination.page || 1));
    params.set("limit", "20");
    if (search.trim()) params.set("search", search.trim());
    if (examFilter) params.set("examTitle", examFilter);
    return params.toString();
  }, [examFilter, pagination.page, search]);

  const fetchRegistrations = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(queryString);
      params.set("page", String(page));
      const { data } = await getMockTestRegistrationsAPI(params.toString());
      setRegistrations(data.data || []);
      setExams(data.exams || []);
      setPagination(data.pagination || { page, limit: 20, total: 0, pages: 1 });
    } catch {
      toast.error("Failed to load mock test registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRegistrations(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, examFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this registration?")) return;

    const toastId = toast.loading("Deleting registration...");
    try {
      await deleteMockTestRegistrationAPI(id);
      toast.success("Registration deleted", { id: toastId });
      setRegistrations((current) => current.filter((registration) => registration._id !== id));
      if (selected?._id === id) setSelected(null);
      fetchRegistrations(pagination.page);
    } catch {
      toast.error("Failed to delete registration", { id: toastId });
    }
  };

  const exportCSV = async () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "10000");
    if (search.trim()) params.set("search", search.trim());
    if (examFilter) params.set("examTitle", examFilter);

    try {
      const { data } = await getMockTestRegistrationsAPI(params.toString());
      const rows: Registration[] = data.data || [];
      const csv = [
        ["Exam Title", "Exam Slug", "Full Name", "Email", "Phone", "Location", "Submitted At"],
        ...rows.map((registration) => [
          registration.examTitle,
          registration.examSlug || "",
          registration.fullName,
          registration.email,
          registration.phone,
          registration.location,
          registration.createdAt,
        ]),
      ].map((row) => row.map(csvCell).join(",")).join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mock-test-registrations.csv";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Test Registrations</h1>
          <p className="text-sm text-gray-500 mt-1">Track mock test registrations submitted from exam detail pages.</p>
        </div>
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
            <label className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </label>
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="">All Exams</option>
              {exams.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Exam</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 skeleton-shimmer rounded w-full" /></td></tr>
                )) : registrations.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No registrations found</td></tr>
                ) : registrations.map((registration) => (
                  <tr
                    key={registration._id}
                    className={`hover:bg-gray-50 cursor-pointer ${selected?._id === registration._id ? "bg-blue-50" : ""}`}
                    onClick={() => setSelected(registration)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-navy">{registration.fullName}</div>
                      <div className="text-xs text-gray-400">{registration.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/5 text-primary text-xs rounded-full font-medium">{registration.examTitle}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{registration.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(registration.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(registration._id); }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        aria-label="Delete registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</span>
              <div className="flex gap-2">
                <button disabled={pagination.page === 1} onClick={() => fetchRegistrations(pagination.page - 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Previous</button>
                <button disabled={pagination.page === pagination.pages} onClick={() => fetchRegistrations(pagination.page + 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {selected ? (
            <div>
              <h3 className="font-bold text-navy text-lg mb-4">Registration Details</h3>
              <div className="space-y-4">
                <Detail icon={UserRound} label="Name" value={selected.fullName} />
                <Detail icon={Mail} label="Email" value={selected.email} href={`mailto:${selected.email}`} />
                <Detail icon={Phone} label="Phone" value={selected.phone} href={`tel:${selected.phone}`} />
                <Detail icon={MapPin} label="Location" value={selected.location} />
                <div><label className="text-xs text-gray-500 uppercase">Exam</label><p className="font-medium text-navy">{selected.examTitle}</p></div>
                <div><label className="text-xs text-gray-500 uppercase">Date</label><p className="text-sm text-gray-500">{formatDate(selected.createdAt)}</p></div>
                <button onClick={() => handleDelete(selected._id)} className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Registration
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <UserRound className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Select a registration to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 uppercase">{label}</label>
      <p className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        {href ? <a href={href} className="text-primary hover:underline">{value}</a> : <span className="text-navy">{value}</span>}
      </p>
    </div>
  );
}

function csvCell(value: string) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}
