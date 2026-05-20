"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProgramAPI, updateProgramAPI } from "@/services/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const initialSem = { semester: "Semester 1", subjects: [""] };

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const { data } = await getProgramAPI(id);
        const p = data.data;
        setForm({
          ...p,
          curriculum: p.curriculum?.length ? p.curriculum : [initialSem],
          careerOpportunities: p.careerOpportunities?.length ? p.careerOpportunities : [""]
        });
      } catch { toast.error("Failed to load program"); router.push("/admin/programs"); }
      finally { setLoading(false); }
    };
    fetchProgram();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Updating program...");
    try {
      await updateProgramAPI(id, form);
      toast.success("Program updated!", { id: toastId });
      router.push("/admin/programs");
    } catch { toast.error("Failed to update", { id: toastId }); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="pt-20 text-center text-gray-400 font-bold">Loading program data...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/programs" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-2"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <h1 className="text-3xl font-bold text-navy">Edit Program</h1>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all font-bold">
            <Save className="w-5 h-5" /> {saving ? "Updating..." : "Update Program"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Form fields same as NewProgramPage */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Program Title *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Slug *</label><input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">University *</label><input required value={form.universityName} onChange={e => setForm({...form, universityName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Type</label><input required value={form.degreeType} onChange={e => setForm({...form, degreeType: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Grade</label><input required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Fees</label><input value={form.fees} onChange={e => setForm({...form, fees: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Duration</label><input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
        </div>
        
        {/* Curriculum Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-navy">Curriculum</h2>
            <button type="button" onClick={() => setForm({...form, curriculum: [...form.curriculum, { semester: `Semester ${form.curriculum.length + 1}`, subjects: [""] }]})} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold">Add Semester</button>
          </div>
          <div className="space-y-6">
            {form.curriculum.map((sem: any, i: number) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                <button type="button" onClick={() => setForm({...form, curriculum: form.curriculum.filter((_: any, idx: number) => idx !== i)})} className="absolute top-4 right-4 p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                <input value={sem.semester} onChange={e => { const nc = [...form.curriculum]; nc[i].semester = e.target.value; setForm({...form, curriculum: nc}); }} className="bg-transparent font-bold text-navy mb-4 border-b border-navy/10 focus:outline-none" />
                <div className="space-y-2">
                  {sem.subjects.map((sub: string, j: number) => (
                    <div key={j} className="flex gap-2">
                      <input value={sub} onChange={e => { const nc = [...form.curriculum]; nc[i].subjects[j] = e.target.value; setForm({...form, curriculum: nc}); }} className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm" />
                    </div>
                  ))}
                  <button type="button" onClick={() => { const nc = [...form.curriculum]; nc[i].subjects.push(""); setForm({...form, curriculum: nc}); }} className="text-xs text-primary font-bold mt-2">Add Subject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full py-5 bg-navy text-white font-extrabold rounded-2xl shadow-xl hover:bg-navy-light transition-all">
          {saving ? "Updating Program Data..." : "Update Online Program"}
        </button>
      </form>
    </div>
  );
}
