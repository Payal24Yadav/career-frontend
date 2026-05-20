"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCollegeAPI, updateCollegeAPI } from "@/services/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const initialCourse = { name: "", duration: "", fees: "", eligibility: "" };
const initialFaq = { question: "", answer: "" };

export default function EditCollegePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const { data } = await getCollegeAPI(id);
        const c = data.data;
        // Ensure arrays exist
        setForm({
          ...c,
          courses: c.courses?.length ? c.courses : [initialCourse],
          faqs: c.faqs?.length ? c.faqs : [initialFaq],
          topRecruiters: c.topRecruiters?.length ? c.topRecruiters : [""],
          facilities: c.facilities?.length ? c.facilities : [""]
        });
      } catch {
        toast.error("Failed to load college data");
        router.push("/admin/colleges");
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Updating college...");
    try {
      const cleanedForm = {
        ...form,
        topRecruiters: form.topRecruiters.filter((r: any) => r.trim() !== ""),
        facilities: form.facilities.filter((f: any) => f.trim() !== ""),
        courses: form.courses.filter((c: any) => c.name.trim() !== ""),
        faqs: form.faqs.filter((f: any) => f.question.trim() !== "")
      };
      await updateCollegeAPI(id, cleanedForm);
      toast.success("College updated successfully!", { id: toastId });
      router.push("/admin/colleges");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (index: number, value: string, field: string) => {
    const newArr = [...form[field]];
    newArr[index] = value;
    setForm({ ...form, [field]: newArr });
  };

  if (loading) return <div className="pt-20 text-center text-gray-400 font-bold">Loading college data...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/colleges" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Colleges
          </Link>
          <h1 className="text-3xl font-bold text-navy">Edit College</h1>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all font-bold disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? "Updating..." : "Update College"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Same form structure as NewCollegePage */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-navy border-b border-gray-50 pb-4 mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">College Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Slug *</label><input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Short Description</label><input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Full Description *</label><textarea required rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl resize-none" /></div>
        </div>

        {/* Location & Details */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-navy border-b border-gray-50 pb-4 mb-6">Location & Classification</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">State *</label><input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">City *</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Ownership *</label>
              <select value={form.ownershipType} onChange={(e) => setForm({ ...form, ownershipType: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                <option value="Private">Private</option><option value="Government">Government</option>
              </select></div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Est. Year</label><input type="number" value={form.establishedYear} onChange={(e) => setForm({ ...form, establishedYear: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Rating</label><input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Ranking</label><input value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Website</label><input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
        </div>

        {/* Fees & Placements */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-navy border-b border-gray-50 pb-4 mb-6">Fees & Placements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Fees String</label><input required value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Min Fees</label><input required type="number" value={form.minFees} onChange={(e) => setForm({ ...form, minFees: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Placement %</label><input required type="number" value={form.placementPercentage} onChange={(e) => setForm({ ...form, placementPercentage: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Highest Package</label><input value={form.highestPackage} onChange={(e) => setForm({ ...form, highestPackage: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Average Package</label><input value={form.averagePackage} onChange={(e) => setForm({ ...form, averagePackage: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-navy">Courses Offered</h2>
            <button type="button" onClick={() => setForm({ ...form, courses: [...form.courses, initialCourse] })} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">Add Course</button>
          </div>
          <div className="space-y-6">
            {form.courses.map((course: any, i: number) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                <button type="button" onClick={() => setForm({ ...form, courses: form.courses.filter((_: any, idx: number) => idx !== i) })} className="absolute top-4 right-4 p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Name</label><input value={course.name} onChange={(e) => { const nc = [...form.courses]; nc[i].name = e.target.value; setForm({...form, courses: nc}); }} className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Fees</label><input value={course.fees} onChange={(e) => { const nc = [...form.courses]; nc[i].fees = e.target.value; setForm({...form, courses: nc}); }} className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="w-full py-5 bg-navy text-white font-extrabold rounded-2xl shadow-xl hover:bg-navy-light transition-all">
          {saving ? "Updating College Data..." : "Update College Profile"}
        </button>
      </form>
    </div>
  );
}
