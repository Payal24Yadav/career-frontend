"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJobAPI, updateJobAPI } from "@/services/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditJobPage() {
  const router = useRouter(); const params = useParams();
  const [loading, setLoading] = useState(false); const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ title: "", company: "", salary: "", skills: "", location: "", description: "", type: "Full-time" });

  useEffect(() => {
    const fetchJob = async () => {
      try { const { data } = await getJobAPI(params.id as string); const j = data.data; setForm({ title: j.title, company: j.company, salary: j.salary, skills: j.skills?.join(", ") || "", location: j.location, description: j.description, type: j.type }); } catch {} finally { setFetching(false); }
    }; fetchJob();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await updateJobAPI(params.id as string, { ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) }); router.push("/admin/jobs"); } catch { alert("Failed to update"); } finally { setLoading(false); }
  };

  if (fetching) return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton-shimmer rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/jobs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-bold text-navy">Edit Job</h1></div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Job Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Company *</label><input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Salary *</label><input required value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Location *</label><input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Remote</option></select></div>
        </div>
        <div><label className="block text-sm font-medium text-navy mb-2">Skills</label><input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-navy mb-2">Description *</label><textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" /></div>
        <div className="flex justify-end gap-4"><Link href="/admin/jobs" className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</Link><button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><Save className="w-4 h-4" /> {loading ? "Updating..." : "Update Job"}</button></div>
      </form>
    </div>
  );
}
