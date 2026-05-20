"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProgramAPI } from "@/services/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const initialSem = { semester: "Semester 1", subjects: [""] };

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    universityName: "",
    degreeType: "MBA",
    grade: "A+",
    fees: "",
    minFees: 0,
    duration: "2 Years",
    eligibility: "",
    rating: 4.5,
    shortDescription: "",
    fullDescription: "",
    curriculum: [initialSem],
    careerOpportunities: [""],
    admissionProcess: "",
    featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating program...");
    try {
      await createProgramAPI(form);
      toast.success("Program created!", { id: toastId });
      router.push("/admin/programs");
    } catch { toast.error("Failed to create", { id: toastId }); }
    finally { setLoading(false); }
  };

  const addSubject = (semIndex: number) => {
    const newCur = [...form.curriculum];
    newCur[semIndex].subjects.push("");
    setForm({ ...form, curriculum: newCur });
  };

  const removeSubject = (semIndex: number, subIndex: number) => {
    const newCur = [...form.curriculum];
    newCur[semIndex].subjects = newCur[semIndex].subjects.filter((_, i) => i !== subIndex);
    setForm({ ...form, curriculum: newCur });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/programs" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-2"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <h1 className="text-3xl font-bold text-navy">Add New Program</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Program Title *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-")})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Slug *</label><input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary outline-none" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">University Name *</label><input required value={form.universityName} onChange={e => setForm({...form, universityName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary outline-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Degree Type</label><input required value={form.degreeType} onChange={e => setForm({...form, degreeType: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary outline-none" /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Grade</label><input required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-primary outline-none" /></div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Fees (String)</label><input required value={form.fees} onChange={e => setForm({...form, fees: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" placeholder="₹50,000" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Min Fees (Numeric)</label><input type="number" value={form.minFees} onChange={e => setForm({...form, minFees: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Duration</label><input required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Rating</label><input type="number" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Short Description *</label><input required value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Full Description *</label><textarea required rows={5} value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Eligibility</label><input value={form.eligibility} onChange={e => setForm({...form, eligibility: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
        </div>

        {/* Curriculum Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-navy">Curriculum</h2>
            <button type="button" onClick={() => setForm({...form, curriculum: [...form.curriculum, { semester: `Semester ${form.curriculum.length + 1}`, subjects: [""] }]})} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold">Add Semester</button>
          </div>
          <div className="space-y-6">
            {form.curriculum.map((sem, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                <button type="button" onClick={() => setForm({...form, curriculum: form.curriculum.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                <input value={sem.semester} onChange={e => { const nc = [...form.curriculum]; nc[i].semester = e.target.value; setForm({...form, curriculum: nc}); }} className="bg-transparent font-bold text-navy mb-4 border-b border-navy/10 focus:outline-none" />
                <div className="space-y-2">
                  {sem.subjects.map((sub, j) => (
                    <div key={j} className="flex gap-2">
                      <input value={sub} onChange={e => { const nc = [...form.curriculum]; nc[i].subjects[j] = e.target.value; setForm({...form, curriculum: nc}); }} placeholder={`Subject ${j+1}`} className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm" />
                      <button type="button" onClick={() => removeSubject(i, j)} className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSubject(i)} className="text-xs text-primary font-bold mt-2">Add Subject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-5 bg-navy text-white font-extrabold rounded-2xl shadow-xl hover:bg-navy-light transition-all disabled:opacity-50">
          {loading ? "Saving Program..." : "Publish Online Program"}
        </button>
      </form>
    </div>
  );
}
