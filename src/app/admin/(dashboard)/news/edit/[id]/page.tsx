"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getNewsByIdAPI, updateNewsAPI } from "@/services/api";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Type, List, Bell } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const categories = ["Exam Updates", "Admissions", "College Notifications", "Scholarships", "General"];

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    fullContent: [] as any[],
    category: "General",
    author: "Admin",
    tags: "",
    isBreakingNews: false,
    publishDate: "",
  });

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const { data } = await getNewsByIdAPI(params.id as string);
        const newsItem = data.data;
        if (newsItem) {
          // Backward compatibility check for content formats
          let parsedContent = newsItem.fullContent;
          if (typeof newsItem.fullContent === "string") {
            parsedContent = [{ type: "Heading/Paragraph", sectionHeading: "", sectionParagraph: newsItem.fullContent }];
          } else if (!Array.isArray(newsItem.fullContent)) {
            parsedContent = [];
          }

          setForm({
            title: newsItem.title,
            slug: newsItem.slug,
            shortDescription: newsItem.shortDescription,
            fullContent: parsedContent,
            category: newsItem.category || "General",
            author: newsItem.author || "Admin",
            tags: newsItem.tags ? newsItem.tags.join(", ") : "",
            isBreakingNews: newsItem.isBreakingNews || false,
            publishDate: newsItem.publishDate ? new Date(newsItem.publishDate).toISOString().split("T")[0] : "",
          });
        }
      } catch (err: any) {
        toast.error("Failed to load news details");
        router.push("/admin/news");
      } finally {
        setFetching(false);
      }
    };

    if (params.id) {
      fetchNewsDetail();
    }
  }, [params.id]);

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: slugify(title) });
  };

  // Block Builder Methods
  const addBlock = (type: string) => {
    const newBlock = {
      type,
      ...(type === "Heading/Paragraph" ? { sectionHeading: "", sectionParagraph: "" } : {}),
      ...(type === "Bullet Points List" ? { listItems: [""] } : {}),
    };
    setForm({ ...form, fullContent: [...form.fullContent, newBlock] });
  };

  const removeBlock = (index: number) => {
    const newContent = [...form.fullContent];
    newContent.splice(index, 1);
    setForm({ ...form, fullContent: newContent });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === form.fullContent.length - 1) return;
    const newContent = [...form.fullContent];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
    setForm({ ...form, fullContent: newContent });
  };

  const updateBlock = (index: number, field: string, value: any) => {
    const newContent = [...form.fullContent];
    newContent[index][field] = value;
    setForm({ ...form, fullContent: newContent });
  };

  // Bullet Point List Methods
  const updateListItem = (blockIndex: number, itemIndex: number, value: string) => {
    const newContent = [...form.fullContent];
    newContent[blockIndex].listItems[itemIndex] = value;
    setForm({ ...form, fullContent: newContent });
  };

  const addListItem = (blockIndex: number) => {
    const newContent = [...form.fullContent];
    newContent[blockIndex].listItems.push("");
    setForm({ ...form, fullContent: newContent });
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const newContent = [...form.fullContent];
    newContent[blockIndex].listItems.splice(itemIndex, 1);
    setForm({ ...form, fullContent: newContent });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fullContent.length === 0) {
      toast.error("Please add at least one content block.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating news article...");
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await updateNewsAPI(params.id as string, payload);
      toast.success("News article updated successfully!", { id: toastId });
      router.push("/admin/news");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update news article", { id: toastId });
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
        <Link href="/admin/news" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" /> Edit News Article
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy font-semibold"
                placeholder="News article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-500 font-mono text-sm"
                placeholder="news-article-slug"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Short Description *</label>
            <textarea
              required
              rows={2}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none text-gray-700 leading-relaxed"
              placeholder="Provide a quick summary of the announcement..."
            />
          </div>
        </div>

        {/* Content Block Builder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-navy">Content Builder</h2>
            <span className="text-xs text-gray-400">Modify dynamic, styled content sections.</span>
          </div>

          <div className="space-y-6">
            {form.fullContent.map((block, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl bg-gray-50/50 relative overflow-hidden transition-all shadow-sm"
              >
                {/* Block Header */}
                <div className="bg-gray-100/80 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-navy disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <GripVertical className="w-4 h-4 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === form.fullContent.length - 1}
                        className="text-gray-400 hover:text-navy disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <GripVertical className="w-4 h-4 rotate-90" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-navy bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                      {block.type === "Heading/Paragraph" && <Type className="w-3.5 h-3.5 text-primary" />}
                      {block.type === "Bullet Points List" && <List className="w-3.5 h-3.5 text-primary" />}
                      {block.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Remove Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Block Body */}
                <div className="p-5 bg-white">
                  {block.type === "Heading/Paragraph" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Section Heading (Optional)
                        </label>
                        <input
                          value={block.sectionHeading}
                          onChange={(e) => updateBlock(index, "sectionHeading", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-navy"
                          placeholder="e.g. Registration Dates & Guidelines"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Paragraph Content *
                        </label>
                        <textarea
                          required
                          value={block.sectionParagraph}
                          onChange={(e) => updateBlock(index, "sectionParagraph", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y leading-relaxed text-gray-700"
                          rows={4}
                          placeholder="Write section narrative details..."
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "Bullet Points List" && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">
                        Bullet Point Items *
                      </label>
                      {block.listItems?.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                          <input
                            required
                            value={item}
                            onChange={(e) => updateListItem(index, i, e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-gray-700"
                            placeholder="Detail point..."
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(index, i)}
                            className="text-gray-400 hover:text-red-500 shrink-0 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addListItem(index)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-navy transition-colors mt-2 px-2.5 py-1.5 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {form.fullContent.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <p className="text-gray-400 font-medium text-sm">
                  No content blocks yet. Click below to add your news content blocks.
                </p>
              </div>
            )}
          </div>

          {/* Add Block Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Add Content Section:</span>
            <button
              type="button"
              onClick={() => addBlock("Heading/Paragraph")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-navy border border-gray-200 hover:border-primary/30 transition-all font-bold rounded-xl shadow-sm text-sm"
            >
              <Type className="w-4 h-4" /> Heading/Paragraph Block
            </button>
            <button
              type="button"
              onClick={() => addBlock("Bullet Points List")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-navy border border-gray-200 hover:border-primary/30 transition-all font-bold rounded-xl shadow-sm text-sm"
            >
              <List className="w-4 h-4" /> Bulleted List Block
            </button>
          </div>
        </div>

        {/* Publication Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">Publication & Metadata</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy font-medium bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Author</label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 font-semibold"
                placeholder="Admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Publish Date</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Tags (Comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700"
              placeholder="registration, ugc, exam-schedule"
            />
          </div>

          {/* Breaking News Toggle */}
          <div className="flex items-center gap-3.5 p-5 bg-red-500/5 rounded-2xl border border-red-500/10">
            <input
              type="checkbox"
              id="isBreakingNews"
              checked={form.isBreakingNews}
              onChange={(e) => setForm({ ...form, isBreakingNews: e.target.checked })}
              className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500"
            />
            <div className="flex flex-col gap-0.5">
              <label htmlFor="isBreakingNews" className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                Mark as Breaking News
              </label>
              <span className="text-xs text-gray-400">
                This places a high-visibility badge on the homepage alert slider and lists it as breaking news.
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/news"
            className="px-8 py-4 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 text-navy transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            <Save className="w-5 h-5" /> {loading ? "Updating..." : "Update News Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
