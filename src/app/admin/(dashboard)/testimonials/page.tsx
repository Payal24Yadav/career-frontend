"use client";
import { useState, useEffect } from "react";
import { getTestimonialsAPI, createTestimonialAPI, deleteTestimonialAPI } from "@/services/api";
import { Plus, Trash2, Star, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", message: "", rating: "5" });
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => { setLoading(true); try { const { data } = await getTestimonialsAPI(); setTestimonials(data.data); } catch {} finally { setLoading(false); } };
  useEffect(() => { fetchTestimonials(); }, []);

  const handleDelete = async (id: string) => { 
    if (!confirm("Delete this testimonial?")) return; 
    const loadId = toast.loading("Deleting...");
    try { 
      await deleteTestimonialAPI(id); 
      toast.success("Deleted successfully", { id: loadId });
      // Optimistic update
      setTestimonials(prev => prev.filter(t => t._id !== id));
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete", { id: loadId });
      fetchTestimonials();
    } 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const loadId = toast.loading("Saving testimonial...");
    try { 
      await createTestimonialAPI({ ...form, rating: parseInt(form.rating) }); 
      setShowForm(false); 
      setForm({ name: "", role: "", message: "", rating: "5" }); 
      toast.success("Testimonial added", { id: loadId });
      fetchTestimonials(); 
    } catch { 
      toast.error("Failed to add", { id: loadId }); 
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-navy">Manage Testimonials</h1><button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4" /> Add Testimonial</button></div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold text-navy">Add Testimonial</h3><button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-navy mb-2">Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="Student name" /></div>
              <div><label className="block text-sm font-medium text-navy mb-2">Role *</label><input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="e.g. MBA Student, IIM Lucknow" /></div>
              <div><label className="block text-sm font-medium text-navy mb-2">Message *</label><textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" placeholder="Testimonial message..." /></div>
              <div><label className="block text-sm font-medium text-navy mb-2">Rating</label><select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option></select></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button><button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button></div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100"><div className="h-20 skeleton-shimmer rounded mb-4" /><div className="h-4 w-1/2 skeleton-shimmer rounded" /></div>)}</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100"><p className="text-gray-500">No testimonials yet. Add your first one!</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.message}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold">{t.name.charAt(0)}</div><div><div className="font-medium text-sm text-navy">{t.name}</div><div className="text-xs text-gray-400">{t.role}</div></div></div>
                <button onClick={() => handleDelete(t._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
