"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import MockTestSectionBuilder from "@/components/admin/MockTestSectionBuilder";
import { createMockTestAPI } from "@/services/api";

export default function AddMockTestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "MBA & Management",
    subtitle: "",
    badgeType: "",
    shortDescription: "",
    duration: 30,
    totalQuestions: 0,
    totalMarks: 0,
    instructions: "",
    examSections: [{ name: "General", duration: 30, totalQuestions: 0 }],
    status: "active",
    isFeatured: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const examSections = formData.examSections
        .filter((section: any) => section.name.trim())
        .map((section: any) => ({
          name: section.name.trim(),
          duration: Number(section.duration) || formData.duration || 30,
          totalQuestions: Number(section.totalQuestions) || 0,
        }));

      await createMockTestAPI({ ...formData, examSections, sections });
      toast.success("Mock Test created with CMS sections successfully!");
      router.push("/admin/mock-tests");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create mock test");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/mock-tests" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CMS Builder: New Mock Test</h1>
            <p className="text-sm text-gray-500 mt-1">Design dynamic pages using structured content blocks</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors shadow-sm"
        >
          {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          {submitting ? "Saving..." : "Publish Page"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MockTestSectionBuilder sections={sections} setSections={setSections} />
        </div>

        <PageSettings formData={formData} setFormData={setFormData} handleTitleChange={handleTitleChange} />
      </div>
    </form>
  );
}

function PageSettings({
  formData,
  setFormData,
  handleTitleChange,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Page Settings</h2>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Page Title *</label>
            <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none font-bold" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">URL Slug *</label>
            <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none font-mono text-primary bg-gray-50" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
              <option value="MBA & Management">MBA & Management</option>
              <option value="Engineering (B.Tech)">Engineering (B.Tech)</option>
              <option value="SSC">SSC</option>
              <option value="Govt Exams">Govt Exams</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subtitle *</label>
            <input required type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Short Description</label>
            <textarea rows={3} value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Duration</label>
              <input type="number" min={1} value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Questions</label>
              <input type="number" min={0} value={formData.totalQuestions} onChange={(e) => setFormData({ ...formData, totalQuestions: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Marks</label>
              <input type="number" min={0} value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Instructions</label>
            <textarea rows={4} value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none resize-none" placeholder="Add test rules, timing notes, marking scheme..." />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase">Exam Sections</label>
              <button type="button" onClick={() => setFormData({ ...formData, examSections: [...formData.examSections, { name: "", duration: formData.duration || 30, totalQuestions: 0 }] })} className="text-xs font-bold text-primary hover:underline">+ Add Section</button>
            </div>
            <div className="space-y-3">
              {formData.examSections.map((section: any, index: number) => (
                <div key={index} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 items-center">
                  <input type="text" placeholder="VARC" value={section.name} onChange={(e) => setFormData({ ...formData, examSections: formData.examSections.map((item: any, i: number) => i === index ? { ...item, name: e.target.value } : item) })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                  <input type="number" min={1} placeholder="Min" value={section.duration} onChange={(e) => setFormData({ ...formData, examSections: formData.examSections.map((item: any, i: number) => i === index ? { ...item, duration: Number(e.target.value) } : item) })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                  <input type="number" min={0} placeholder="Qs" value={section.totalQuestions} onChange={(e) => setFormData({ ...formData, examSections: formData.examSections.map((item: any, i: number) => i === index ? { ...item, totalQuestions: Number(e.target.value) } : item) })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                  <button type="button" onClick={() => setFormData({ ...formData, examSections: formData.examSections.filter((_: any, i: number) => i !== index) })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">x</button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Badge</label>
              <select value={formData.badgeType} onChange={(e) => setFormData({ ...formData, badgeType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="">None</option>
                <option value="HOT">HOT</option>
                <option value="NEW">NEW</option>
                <option value="EXPERT">EXPERT</option>
                <option value="LATEST">LATEST</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 pt-4 border-t border-gray-100 cursor-pointer">
            <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm font-bold text-gray-700">Featured Test</span>
          </label>
        </div>
      </div>
    </div>
  );
}
