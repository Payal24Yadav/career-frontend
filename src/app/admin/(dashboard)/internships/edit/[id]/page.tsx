"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getInternshipByIdAPI, updateInternshipAPI } from "@/services/api";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditInternshipPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    duration: "",
    stipend: "",
    skillsRequired: "",
    description: "",
    responsibilities: "",
    eligibility: "",
    category: "Software Development",
    applyLink: "",
    lastDate: "",
    isFeatured: false,
    status: "active",
  });

  const categories = [
    "Software Development",
    "Web Development",
    "Data Science",
    "Digital Marketing",
    "Graphic Design",
    "Business Development",
    "Finance",
    "HR"
  ];

  useEffect(() => {
    const fetchInternshipDetail = async () => {
      try {
        const { data } = await getInternshipByIdAPI(params.id as string);
        const item = data.data;
        if (item) {
          setForm({
            title: item.title || "",
            companyName: item.companyName || "",
            location: item.location || "",
            duration: item.duration || "",
            stipend: item.stipend || "",
            skillsRequired: item.skillsRequired ? item.skillsRequired.join(", ") : "",
            description: item.description || "",
            responsibilities: item.responsibilities || "",
            eligibility: item.eligibility || "",
            category: item.category || "Software Development",
            applyLink: item.applyLink || "",
            lastDate: item.lastDate ? new Date(item.lastDate).toISOString().split("T")[0] : "",
            isFeatured: item.isFeatured || false,
            status: item.status || "active",
          });
        }
      } catch (err: any) {
        toast.error("Failed to load internship details");
        router.push("/admin/internships");
      } finally {
        setFetching(false);
      }
    };

    if (params.id) {
      fetchInternshipDetail();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating internship details...");
    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await updateInternshipAPI(params.id as string, payload);
      toast.success("Internship updated successfully!", { id: toastId });
      router.push("/admin/internships");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update internship", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/internships" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" /> Edit Internship
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Internship Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy font-semibold"
                placeholder="e.g. Front-end Web Developer Intern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Company Name *</label>
              <input
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy font-semibold"
                placeholder="e.g. Google India"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Location / Environment *</label>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
                placeholder="e.g. Bangalore (Remote)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Duration *</label>
              <input
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
                placeholder="e.g. 6 Months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Stipend Details *</label>
              <input
                required
                value={form.stipend}
                onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
                placeholder="e.g. ₹15,000 / Month"
              />
            </div>
          </div>
        </div>

        {/* Content details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">Internship Specifications</h2>
          
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Skills Required (Comma separated)</label>
            <input
              value={form.skillsRequired}
              onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
              placeholder="e.g. React.js, Tailwind CSS, TypeScript, Next.js"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">About The Internship *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y leading-relaxed text-gray-700"
              placeholder="Describe the company project, stack, environment, and general description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Key Responsibilities (Optional)</label>
            <textarea
              rows={3}
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y leading-relaxed text-gray-700"
              placeholder="e.g. - Design responsive dashboards&#10;- Integrate REST APIs&#10;- Optimize code performance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Who Can Apply / Eligibility (Optional)</label>
            <textarea
              rows={3}
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y leading-relaxed text-gray-700"
              placeholder="e.g. - B.Tech / BCA / MCA final year students&#10;- Strong knowledge of HTML/CSS&#10;- Available for full 6 months"
            />
          </div>
        </div>

        {/* Publication, Apply Link & Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">Publication & Metadata</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy font-semibold bg-white cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Direct Apply Link *</label>
              <input
                required
                type="url"
                value={form.applyLink}
                onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
                placeholder="https://company.careers/apply/job-id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Last Date to Apply *</label>
              <input
                required
                type="date"
                value={form.lastDate}
                onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100/60">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Publication Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy font-semibold bg-white cursor-pointer"
              >
                <option value="active">Active (Visible immediately)</option>
                <option value="draft">Draft (Admin eyes only)</option>
                <option value="closed">Closed (Expired listing)</option>
              </select>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-primary/5 rounded-2xl border border-primary/10 self-end">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <div className="flex flex-col gap-0.5">
                <label htmlFor="isFeatured" className="text-sm font-bold text-navy uppercase tracking-wider cursor-pointer">
                  Mark as Featured Internship
                </label>
                <span className="text-[11px] text-gray-400">
                  Featured internships appear with badges and sit at the top of organic listings.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form controls */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/internships"
            className="px-8 py-4 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 text-navy transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            <Save className="w-5 h-5" /> {loading ? "Updating..." : "Update Internship"}
          </button>
        </div>
      </form>
    </div>
  );
}
