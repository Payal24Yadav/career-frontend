"use client";
import { useState, useEffect } from "react";
import { getConsultantPartnersAPI, deleteConsultantPartnerAPI } from "@/services/api";
import { Trash2, Eye, MapPin, Mail, Phone, X, Calendar, Users, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ConsultantPartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data } = await getConsultantPartnersAPI();
      setPartners(data.data);
    } catch { toast.error("Failed to load applications"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const tid = toast.loading("Deleting...");
    try {
      await deleteConsultantPartnerAPI(id);
      toast.success("Application removed", { id: tid });
      setPartners(prev => prev.filter(p => p._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete", { id: tid }); 
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Consultant Partnership Applications</h1>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Firm Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Person</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(3)].map((_, i) => <tr key={i}><td colSpan={5} className="px-6 py-10"><div className="h-6 skeleton-shimmer rounded w-full" /></td></tr>) :
                partners.length === 0 ? <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-500 font-medium">No applications found</td></tr> :
                partners.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-6 font-bold text-navy">{p.firmName}</td>
                    <td className="px-6 py-6 font-medium text-navy">{p.contactPerson}</td>
                    <td className="px-6 py-6 text-sm text-gray-500">{p.cityLocation}</td>
                    <td className="px-6 py-6 text-sm text-gray-500">{p.experience} Years</td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelected(p)} className="p-2 text-primary hover:bg-primary/5 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-navy">Consultant Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Firm Name</label><p className="font-bold text-navy">{selected.firmName}</p></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Base Location</label><p className="font-bold text-navy">{selected.cityLocation}</p></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Contact Person</label><p className="font-bold text-navy">{selected.contactPerson}</p></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Experience</label><p className="font-bold text-navy">{selected.experience} Years</p></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</label><p className="font-bold text-primary">{selected.email}</p></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone</label><p className="font-bold text-navy">{selected.phone}</p></div>
              </div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Specialization</label><p className="text-gray-600 text-sm leading-relaxed">{selected.specialization}</p></div>
              <div className="grid grid-cols-2 gap-8">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Expected Leads/Month</label><p className="text-navy font-medium">{selected.expectedLeads || "N/A"}</p></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Partnership Model</label><p className="text-navy font-medium">{selected.partnershipModel || "N/A"}</p></div>
              </div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Additional Notes</label><p className="text-gray-600 text-sm leading-relaxed">{selected.additionalNotes || "No additional notes"}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
