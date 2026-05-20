"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollegeAPI } from "@/services/api";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const initialCourse = { name: "", duration: "", fees: "", eligibility: "" };
const initialFaq = { question: "", answer: "" };

export default function NewCollegePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    state: "",
    city: "",
    address: "",
    fees: "",
    minFees: 0,
    rating: 4.5,
    placementPercentage: 90,
    highestPackage: "",
    averagePackage: "",
    ownershipType: "Private",
    degreeType: ["MBA"],
    courses: [initialCourse],
    topRecruiters: [""],
    facilities: [""],
    eligibility: "",
    admissionProcess: "",
    ranking: "#1",
    establishedYear: 2000,
    websiteUrl: "",
    featured: false,
    faqs: [initialFaq]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating college...");
    try {
      // Clean up empty strings in arrays
      const cleanedForm = {
        ...form,
        topRecruiters: form.topRecruiters.filter(r => r.trim() !== ""),
        facilities: form.facilities.filter(f => f.trim() !== ""),
        courses: form.courses.filter(c => c.name.trim() !== ""),
        faqs: form.faqs.filter(f => f.question.trim() !== "")
      };
      await createCollegeAPI(cleanedForm);
      toast.success("College created successfully!", { id: toastId });
      router.push("/admin/colleges");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (index: number, value: string, field: "topRecruiters" | "facilities") => {
    const newArr = [...form[field]];
    newArr[index] = value;
    setForm({ ...form, [field]: newArr });
  };

  const addArrayItem = (field: "topRecruiters" | "facilities") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (index: number, field: "topRecruiters" | "facilities") => {
    const newArr = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArr });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/colleges" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Colleges
          </Link>
          <h1 className="text-3xl font-bold text-navy">Add New College</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all font-bold disabled:opacity-50">
          <Save className="w-5 h-5" /> {loading ? "Saving..." : "Save College"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* Basic Info Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-navy border-b border-gray-50 pb-4 mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">College Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Slug (Auto-generated) *</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Short Description (Cards)</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary" placeholder="Brief 1-2 line overview" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Full Description *</label>
            <textarea required rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>

        {/* Location & Details */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-navy border-b border-gray-50 pb-4 mb-6">Location & Classification</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">State *</label><input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">City *</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Ownership *</label>
              <select value={form.ownershipType} onChange={(e) => setForm({ ...form, ownershipType: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none">
                <option value="Private">Private</option><option value="Government">Government</option>
              </select></div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Established Year</label><input type="number" value={form.establishedYear} onChange={(e) => setForm({ ...form, establishedYear: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Rating (1-5)</label><input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">NIRF Ranking</label><input value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Website URL</label><input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
        </div>

        {/* Fees & Placements */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-navy border-b border-gray-50 pb-4 mb-6">Fees & Placements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Fees Display String *</label><input required value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" placeholder="e.g. ₹2.5L - 8L" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Min Fees (Numeric) *</label><input required type="number" value={form.minFees} onChange={(e) => setForm({ ...form, minFees: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Placement % *</label><input required type="number" value={form.placementPercentage} onChange={(e) => setForm({ ...form, placementPercentage: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Highest Package</label><input value={form.highestPackage} onChange={(e) => setForm({ ...form, highestPackage: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" placeholder="e.g. ₹45 LPA" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Average Package</label><input value={form.averagePackage} onChange={(e) => setForm({ ...form, averagePackage: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl" placeholder="e.g. ₹8.5 LPA" /></div>
          </div>
        </div>

        {/* Dynamic Arrays: Recruiters, Facilities */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-navy">Top Recruiters</h3><button type="button" onClick={() => addArrayItem("topRecruiters")} className="p-2 bg-primary/10 text-primary rounded-lg"><Plus className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              {form.topRecruiters.map((r, i) => (
                <div key={i} className="flex gap-2"><input value={r} onChange={(e) => handleArrayChange(i, e.target.value, "topRecruiters")} className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl" /><button type="button" onClick={() => removeArrayItem(i, "topRecruiters")} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-navy">Campus Facilities</h3><button type="button" onClick={() => addArrayItem("facilities")} className="p-2 bg-primary/10 text-primary rounded-lg"><Plus className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              {form.facilities.map((f, i) => (
                <div key={i} className="flex gap-2"><input value={f} onChange={(e) => handleArrayChange(i, e.target.value, "facilities")} className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl" /><button type="button" onClick={() => removeArrayItem(i, "facilities")} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-navy">Courses Offered</h2>
            <button type="button" onClick={() => setForm({ ...form, courses: [...form.courses, initialCourse] })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"><Plus className="w-4 h-4" /> Add Course</button>
          </div>
          <div className="space-y-6">
            {form.courses.map((course, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                <button type="button" onClick={() => setForm({ ...form, courses: form.courses.filter((_, idx) => idx !== i) })} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Course Name</label><input value={course.name} onChange={(e) => { const newCourses = [...form.courses]; newCourses[i].name = e.target.value; setForm({...form, courses: newCourses}); }} className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Duration</label><input value={course.duration} onChange={(e) => { const newCourses = [...form.courses]; newCourses[i].duration = e.target.value; setForm({...form, courses: newCourses}); }} className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Yearly Fees</label><input value={course.fees} onChange={(e) => { const newCourses = [...form.courses]; newCourses[i].fees = e.target.value; setForm({...form, courses: newCourses}); }} className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Eligibility</label><input value={course.eligibility} onChange={(e) => { const newCourses = [...form.courses]; newCourses[i].eligibility = e.target.value; setForm({...form, courses: newCourses}); }} className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h2 className="text-xl font-bold text-navy">FAQs</h2>
            <button type="button" onClick={() => setForm({ ...form, faqs: [...form.faqs, initialFaq] })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"><Plus className="w-4 h-4" /> Add FAQ</button>
          </div>
          <div className="space-y-4">
            {form.faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl space-y-3">
                <div className="flex justify-between">
                  <input value={faq.question} onChange={(e) => { const newFaqs = [...form.faqs]; newFaqs[i].question = e.target.value; setForm({...form, faqs: newFaqs}); }} placeholder="Question" className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-lg font-bold" />
                  <button type="button" onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, idx) => idx !== i) })} className="ml-2 p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <textarea rows={2} value={faq.answer} onChange={(e) => { const newFaqs = [...form.faqs]; newFaqs[i].answer = e.target.value; setForm({...form, faqs: newFaqs}); }} placeholder="Answer" className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg resize-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-8">
           <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50">
            <Save className="w-6 h-6" /> {loading ? "Saving College Data..." : "Publish College Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
