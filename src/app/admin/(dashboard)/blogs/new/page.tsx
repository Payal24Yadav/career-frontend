"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlogAPI, getBlogsAPI } from "@/services/api";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Type, List, TableProperties } from "lucide-react";
import Link from "next/link";

const categories = ["MBA", "Engineering", "Medical", "Law", "Career Tips", "Exam Updates", "Study Abroad", "General"];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", content: [] as any[], category: "General",
    author: "Admin", tags: "", metaTitle: "", metaDescription: "",
    status: "published", isFeatured: false, publishDate: new Date().toISOString().split("T")[0],
    relatedBlogs: [] as string[]
  });

  useEffect(() => {
    getBlogsAPI("admin=true&limit=100").then(res => setAllBlogs(res.data.data)).catch(() => {});
  }, []);

  const handleTitleChange = (title: string) => { setForm({ ...form, title, slug: slugify(title) }); };

  const handleRelatedBlogsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setForm({ ...form, relatedBlogs: options });
  };

  // Block Builder Methods
  const addBlock = (type: string) => {
    const newBlock = {
      type,
      ...(type === 'Heading/Paragraph' ? { sectionHeading: "", sectionParagraph: "" } : {}),
      ...(type === 'Bullet Points List' ? { listItems: [""] } : {}),
      ...(type === 'Data Table' ? { tableData: { headers: ["Header 1", "Header 2"], rows: [["", ""]] } } : {})
    };
    setForm({ ...form, content: [...form.content, newBlock] });
  };

  const removeBlock = (index: number) => {
    const newContent = [...form.content];
    newContent.splice(index, 1);
    setForm({ ...form, content: newContent });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === form.content.length - 1) return;
    const newContent = [...form.content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
    setForm({ ...form, content: newContent });
  };

  const updateBlock = (index: number, field: string, value: any) => {
    const newContent = [...form.content];
    newContent[index][field] = value;
    setForm({ ...form, content: newContent });
  };

  // List Item Methods
  const updateListItem = (blockIndex: number, itemIndex: number, value: string) => {
    const newContent = [...form.content];
    newContent[blockIndex].listItems[itemIndex] = value;
    setForm({ ...form, content: newContent });
  };
  const addListItem = (blockIndex: number) => {
    const newContent = [...form.content];
    newContent[blockIndex].listItems.push("");
    setForm({ ...form, content: newContent });
  };
  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const newContent = [...form.content];
    newContent[blockIndex].listItems.splice(itemIndex, 1);
    setForm({ ...form, content: newContent });
  };

  // Table Methods
  const updateTableHeader = (blockIndex: number, colIndex: number, value: string) => {
    const newContent = [...form.content];
    newContent[blockIndex].tableData.headers[colIndex] = value;
    setForm({ ...form, content: newContent });
  };
  const updateTableCell = (blockIndex: number, rowIndex: number, colIndex: number, value: string) => {
    const newContent = [...form.content];
    newContent[blockIndex].tableData.rows[rowIndex][colIndex] = value;
    setForm({ ...form, content: newContent });
  };
  const addTableColumn = (blockIndex: number) => {
    const newContent = [...form.content];
    newContent[blockIndex].tableData.headers.push(`Header ${newContent[blockIndex].tableData.headers.length + 1}`);
    newContent[blockIndex].tableData.rows.forEach((row: any) => row.push(""));
    setForm({ ...form, content: newContent });
  };
  const addTableRow = (blockIndex: number) => {
    const newContent = [...form.content];
    const cols = newContent[blockIndex].tableData.headers.length;
    newContent[blockIndex].tableData.rows.push(Array(cols).fill(""));
    setForm({ ...form, content: newContent });
  };
  const removeTableRow = (blockIndex: number, rowIndex: number) => {
    const newContent = [...form.content];
    newContent[blockIndex].tableData.rows.splice(rowIndex, 1);
    setForm({ ...form, content: newContent });
  };
  const removeTableColumn = (blockIndex: number, colIndex: number) => {
    const newContent = [...form.content];
    newContent[blockIndex].tableData.headers.splice(colIndex, 1);
    newContent[blockIndex].tableData.rows.forEach((row: any) => row.splice(colIndex, 1));
    setForm({ ...form, content: newContent });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (form.content.length === 0) {
      alert("Please add at least one content block.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      await createBlogAPI(payload);
      router.push("/admin/blogs");
    } catch (err: any) { alert(err.response?.data?.message || "Failed to create blog"); } finally { setLoading(false); }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy">Add New Blog</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-navy mb-2">Title *</label>
              <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="Blog title" /></div>
            <div><label className="block text-sm font-medium text-navy mb-2">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="blog-slug" /></div>
          </div>
          <div><label className="block text-sm font-medium text-navy mb-2">Description *</label>
            <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" placeholder="Short description" /></div>
        </div>

        {/* CONTENT BUILDER */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-navy">Content Builder</h2>
          </div>
          
          <div className="space-y-6">
            {form.content.map((block, index) => (
              <div key={index} className="border border-gray-200 rounded-xl bg-gray-50/50 relative overflow-hidden transition-all">
                {/* Block Header */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index===0} className="text-gray-400 hover:text-navy disabled:opacity-30"><GripVertical className="w-4 h-4 rotate-90" /></button>
                      <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index===form.content.length-1} className="text-gray-400 hover:text-navy disabled:opacity-30"><GripVertical className="w-4 h-4 rotate-90" /></button>
                    </div>
                    <span className="text-sm font-bold text-navy bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                      {block.type === 'Heading/Paragraph' && <Type className="w-3 h-3 text-primary" />}
                      {block.type === 'Bullet Points List' && <List className="w-3 h-3 text-primary" />}
                      {block.type === 'Data Table' && <TableProperties className="w-3 h-3 text-primary" />}
                      {block.type}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeBlock(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>

                {/* Block Body */}
                <div className="p-5 bg-white">
                  {block.type === 'Heading/Paragraph' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">Heading (Optional)</label>
                        <input value={block.sectionHeading} onChange={(e) => updateBlock(index, 'sectionHeading', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-bold text-navy" placeholder="e.g. Why Study in Germany?" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">Paragraph Content</label>
                        <textarea value={block.sectionParagraph} onChange={(e) => updateBlock(index, 'sectionParagraph', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-y" rows={4} placeholder="Start typing your content here..." />
                      </div>
                    </div>
                  )}

                  {block.type === 'Bullet Points List' && (
                    <div className="space-y-3">
                      {block.listItems.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary/30 shrink-0" />
                          <input value={item} onChange={(e) => updateListItem(index, i, e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm" placeholder="List point detail..." />
                          <button type="button" onClick={() => removeListItem(index, i)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addListItem(index)} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-navy transition-colors mt-2 px-2 py-1"><Plus className="w-4 h-4" /> Add Point</button>
                    </div>
                  )}

                  {block.type === 'Data Table' && (
                    <div className="space-y-4 overflow-x-auto pb-2">
                      <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-50">
                              {block.tableData.headers.map((h: string, cIdx: number) => (
                                <th key={cIdx} className="border border-gray-200 p-2 relative group min-w-[200px]">
                                  <input value={h} onChange={(e) => updateTableHeader(index, cIdx, e.target.value)} className="w-full bg-transparent font-bold text-xs uppercase tracking-wider text-navy text-center focus:outline-none focus:bg-white px-2 py-1 rounded" placeholder="Header Name" />
                                  <button type="button" onClick={() => removeTableColumn(index, cIdx)} className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded p-0.5"><Trash2 className="w-3 h-3" /></button>
                                </th>
                              ))}
                              <th className="bg-gray-100 border border-gray-200 w-12 text-center">
                                <button type="button" onClick={() => addTableColumn(index)} title="Add Column" className="w-full h-full flex justify-center items-center py-2 text-primary hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {block.tableData.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="bg-white group relative">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="border border-gray-200 p-2">
                                    <input value={cell} onChange={(e) => updateTableCell(index, rIdx, cIdx, e.target.value)} className="w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-primary rounded focus:outline-none text-sm text-gray-700" placeholder="..." />
                                  </td>
                                ))}
                                <td className="border border-gray-200 bg-gray-50 text-center">
                                  <button type="button" onClick={() => removeTableRow(index, rIdx)} className="text-red-500 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button type="button" onClick={() => addTableRow(index)} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-navy transition-colors px-2 py-1"><Plus className="w-4 h-4" /> Add Row</button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {form.content.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-500 font-medium mb-4">No content blocks yet. Click below to start building your blog.</p>
              </div>
            )}
          </div>

          {/* Add Block Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2">Add New:</span>
            <button type="button" onClick={() => addBlock('Heading/Paragraph')} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-navy border border-gray-200 hover:border-primary/30 transition-all font-bold rounded-xl shadow-sm text-sm">
              <Type className="w-4 h-4" /> Heading/Paragraph
            </button>
            <button type="button" onClick={() => addBlock('Bullet Points List')} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-navy border border-gray-200 hover:border-primary/30 transition-all font-bold rounded-xl shadow-sm text-sm">
              <List className="w-4 h-4" /> Bullet Points List
            </button>
            <button type="button" onClick={() => addBlock('Data Table')} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-navy border border-gray-200 hover:border-primary/30 transition-all font-bold rounded-xl shadow-sm text-sm">
              <TableProperties className="w-4 h-4" /> Data Table
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3">SEO & Metadata</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div><label className="block text-sm font-medium text-navy mb-2">Category *</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-navy mb-2">Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-navy mb-2">Publish Date</label>
              <input type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-navy mb-2">Meta Title</label>
              <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="SEO Title" /></div>
            <div><label className="block text-sm font-medium text-navy mb-2">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="admission, exams, career" /></div>
          </div>
          
          <div><label className="block text-sm font-medium text-navy mb-2">Meta Description</label>
            <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" placeholder="SEO Description" /></div>

          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-navy mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-navy mb-2">Related Blogs</label>
              <select multiple value={form.relatedBlogs} onChange={handleRelatedBlogsChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary h-32">
                {allBlogs.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="isFeatured" className="text-sm font-bold text-navy">Mark as Featured Blog</label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/blogs" className="px-8 py-4 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-colors text-navy">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-primary/25"><Save className="w-5 h-5" /> {loading ? "Publishing..." : "Publish Blog"}</button>
        </div>
      </form>
    </div>
  );
}
