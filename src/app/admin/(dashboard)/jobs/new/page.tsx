"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJobAPI } from "@/services/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", salary: "", skills: "", location: "", description: "", type: "Full-time" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await createJobAPI({ ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) }); router.push("/admin/jobs"); } catch { alert("Failed to create job"); } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/jobs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-bold text-navy">Add New Job</h1></div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Job Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="e.g. Software Developer" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Company *</label><input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="e.g. TCS" /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Salary *</label><input required value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="e.g. ₹5-8 LPA" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Location *</label><input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="e.g. Bangalore" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Remote</option></select></div>
        </div>
        <div><label className="block text-sm font-medium text-navy mb-2">Skills (comma separated)</label><input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="Java, Python, SQL" /></div>
        <div><label className="block text-sm font-medium text-navy mb-2">Description *</label><textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" placeholder="Job description..." /></div>
        <div className="flex justify-end gap-4"><Link href="/admin/jobs" className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</Link><button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><Save className="w-4 h-4" /> {loading ? "Creating..." : "Create Job"}</button></div>
      </form>
    </div>
  );
}
