"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { type OPD } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Trash2, Building2, Loader2, AlertTriangle, X, Save } from "lucide-react";

export default function OPDPage() {
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OPD | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nama: "", singkatan: "" });
  const [editTarget, setEditTarget] = useState<OPD | null>(null);

  const load = async () => {
    const { data } = await supabase.from("opd").select("*").order("nama");
    if (data) setOpdList(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.nama || !form.singkatan) { toast.error("Nama dan singkatan wajib diisi"); return; }
    setSaving(true);

    if (editTarget) {
      const { error } = await supabase.from("opd").update({ nama: form.nama, singkatan: form.singkatan }).eq("id", editTarget.id);
      if (error) { toast.error("Gagal mengubah OPD"); setSaving(false); return; }
      toast.success("OPD berhasil diperbarui");
    } else {
      const { error } = await supabase.from("opd").insert({ nama: form.nama, singkatan: form.singkatan });
      if (error) { toast.error("Gagal menambah OPD"); setSaving(false); return; }
      toast.success("OPD berhasil ditambahkan");
    }

    setSaving(false);
    setForm({ nama: "", singkatan: "" });
    setShowForm(false);
    setEditTarget(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("opd").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) { toast.error("Gagal menghapus OPD. Pastikan tidak ada laporan yang menggunakan OPD ini, atau hapus kaitannya dulu."); return; }
    toast.success("OPD berhasil dihapus");
    setDeleteTarget(null);
    load();
  };

  const openEdit = (opd: OPD) => {
    setEditTarget(opd);
    setForm({ nama: opd.nama, singkatan: opd.singkatan });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm({ nama: "", singkatan: "" });
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kelola OPD</h1>
          <p className="text-sm text-gray-500">Organisasi Perangkat Daerah Kabupaten Aceh Barat</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" /> Tambah OPD
          </button>
        )}
      </div>

      {/* Form tambah/edit */}
      {showForm && (
        <div className="card p-5 border-primary-200 border-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">
              {editTarget ? `Edit: ${editTarget.nama}` : "Tambah OPD Baru"}
            </h3>
            <button onClick={closeForm} className="btn btn-ghost p-1.5"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Nama OPD <span className="text-red-400">*</span>
              </label>
              <input className="input" placeholder="Contoh: Dinas Kesehatan"
                value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Singkatan <span className="text-red-400">*</span>
              </label>
              <input className="input" placeholder="Contoh: Dinkes"
                value={form.singkatan} onChange={e => setForm(p => ({ ...p, singkatan: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={closeForm} className="btn btn-ghost">Batal</button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editTarget ? "Simpan Perubahan" : "Tambah OPD"}
            </button>
          </div>
        </div>
      )}

      {/* Daftar OPD */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Memuat...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Nama OPD</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Singkatan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Ditambahkan</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {opdList.map(opd => (
                <tr key={opd.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-800">{opd.nama}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge bg-gray-100 text-gray-600 text-xs">{opd.singkatan}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(opd.created_at)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(opd)} className="btn btn-ghost p-1.5 text-xs">
                        Edit
                      </button>
                      <button onClick={() => setDeleteTarget(opd)} className="btn btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {opdList.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400">Belum ada OPD terdaftar</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">
        ⚠️ OPD yang masih digunakan dalam laporan tidak bisa dihapus langsung. Ubah status laporan terkait terlebih dahulu.
      </p>

      {/* Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hapus OPD?</h3>
                <p className="text-sm text-gray-500">{deleteTarget.nama}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              OPD yang terhubung dengan laporan tidak bisa dihapus (laporan akan otomatis di-set ke tanpa OPD).
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost flex-1 justify-center">Batal</button>
              <button onClick={handleDelete} disabled={deleting} className="btn btn-danger flex-1 justify-center">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
