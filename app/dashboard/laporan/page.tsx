"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { STATUS_CONFIG, KECAMATAN_LIST, KATEGORI_LIST, type Laporan, type OPD, type StatusLaporan, type LaporanInsert } from "@/types";
import { formatDate, formatDateTime, generateNomorRef } from "@/lib/utils";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  Search, Filter, Download, Upload, Plus, Pencil, Trash2,
  X, Save, Loader2, ChevronDown, Eye, AlertTriangle,
} from "lucide-react";

// ─── Modal Edit ───────────────────────────────────────────────
function EditModal({ laporan, opdList, onClose, onSaved }: {
  laporan: Laporan;
  opdList: OPD[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nama_pelapor: laporan.nama_pelapor ?? "",
    no_hp: laporan.no_hp,
    kecamatan: laporan.kecamatan,
    kategori: laporan.kategori,
    opd_id: laporan.opd_id ?? "",
    isi_laporan: laporan.isi_laporan,
    lokasi: laporan.lokasi ?? "",
    status: laporan.status,
    catatan_admin: laporan.catatan_admin ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("laporan").update({
      nama_pelapor: form.nama_pelapor || null,
      no_hp: form.no_hp,
      kecamatan: form.kecamatan,
      kategori: form.kategori,
      opd_id: form.opd_id || null,
      isi_laporan: form.isi_laporan,
      lokasi: form.lokasi || null,
      status: form.status as StatusLaporan,
      catatan_admin: form.catatan_admin || null,
    }).eq("id", laporan.id);
    setSaving(false);
    if (error) { toast.error("Gagal menyimpan: " + error.message); return; }
    toast.success("Laporan berhasil diperbarui");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900">Edit Laporan</h3>
            <p className="text-xs text-gray-400 font-mono">{laporan.nomor_ref}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Pelapor</label>
              <input className="input" value={form.nama_pelapor} onChange={e => set("nama_pelapor", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">No. HP <span className="text-red-400">*</span></label>
              <input className="input" value={form.no_hp} onChange={e => set("no_hp", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kecamatan <span className="text-red-400">*</span></label>
              <select className="input" value={form.kecamatan} onChange={e => set("kecamatan", e.target.value)}>
                {KECAMATAN_LIST.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategori <span className="text-red-400">*</span></label>
              <select className="input" value={form.kategori} onChange={e => set("kategori", e.target.value)}>
                {KATEGORI_LIST.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">OPD</label>
              <select className="input" value={form.opd_id} onChange={e => set("opd_id", e.target.value)}>
                <option value="">-- Tidak ada --</option>
                {opdList.map(o => <option key={o.id} value={o.id}>{o.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select className="input" value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="pending">Belum Diproses</option>
                <option value="proses">Sedang Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lokasi</label>
            <input className="input" value={form.lokasi} onChange={e => set("lokasi", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Isi Laporan <span className="text-red-400">*</span></label>
            <textarea className="input min-h-[100px]" value={form.isi_laporan} onChange={e => set("isi_laporan", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Catatan Admin</label>
            <textarea className="input min-h-[60px]" value={form.catatan_admin} onChange={e => set("catatan_admin", e.target.value)} placeholder="Catatan internal untuk tim..." />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="btn btn-ghost flex-1 justify-center">Batal</button>
          <button onClick={save} disabled={saving} className="btn btn-primary flex-1 justify-center">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Detail ──────────────────────────────────────────────
function DetailModal({ laporan, onClose }: { laporan: Laporan; onClose: () => void }) {
  const st = STATUS_CONFIG[laporan.status];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Detail Laporan</h3>
            <p className="text-xs text-gray-400 font-mono">{laporan.nomor_ref}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-3">
          {[
            ["Tanggal", formatDateTime(laporan.created_at)],
            ["Nama Pelapor", laporan.nama_pelapor || "(Anonim)"],
            ["No. HP", laporan.no_hp],
            ["Kecamatan", laporan.kecamatan],
            ["Kategori", laporan.kategori],
            ["OPD", laporan.opd?.nama || "-"],
            ["Lokasi", laporan.lokasi || "-"],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5 font-medium">{k}</span>
              <span className="text-sm text-gray-800">{v}</span>
            </div>
          ))}
          <div className="flex gap-3 items-start">
            <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5 font-medium">Status</span>
            <span className="badge text-xs" style={{ background: st.bg, color: st.color }}>{st.label}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mt-2">
            <p className="text-xs text-gray-400 font-medium mb-1">Isi Laporan</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{laporan.isi_laporan}</p>
          </div>
          {laporan.catatan_admin && (
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs text-amber-600 font-medium mb-1">Catatan Admin</p>
              <p className="text-sm text-gray-800">{laporan.catatan_admin}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function LaporanPage() {
  const [laporan, setLaporan]   = useState<Laporan[]>([]);
  const [opdList, setOpdList]   = useState<OPD[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editTarget, setEditTarget]     = useState<Laporan | null>(null);
  const [detailTarget, setDetailTarget] = useState<Laporan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Laporan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Filters
  const [search, setSearch]       = useState("");
  const [filterStatus, setFS]     = useState("");
  const [filterKec, setFK]        = useState("");
  const [filterKat, setFKat]      = useState("");

  const load = async () => {
    const { data } = await supabase.from("laporan").select("*, opd(id,nama,singkatan)").order("created_at", { ascending: false });
    if (data) setLaporan(data as Laporan[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    supabase.from("opd").select("*").order("nama").then(({ data }) => { if (data) setOpdList(data); });
  }, []);

  const filtered = laporan.filter(l => {
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterKec && l.kecamatan !== filterKec) return false;
    if (filterKat && l.kategori !== filterKat) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.nomor_ref.toLowerCase().includes(q) ||
        l.isi_laporan.toLowerCase().includes(q) ||
        (l.nama_pelapor ?? "").toLowerCase().includes(q) ||
        l.no_hp.includes(q);
    }
    return true;
  });

  // Hapus
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("laporan").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) { toast.error("Gagal menghapus"); return; }
    toast.success("Laporan berhasil dihapus");
    setDeleteTarget(null);
    load();
  };

  // Export CSV
  const exportCSV = () => {
    const rows = filtered.map(l => ({
      "No. Ref": l.nomor_ref,
      "Tanggal": formatDate(l.created_at),
      "Nama Pelapor": l.nama_pelapor ?? "",
      "No. HP": l.no_hp,
      "Kecamatan": l.kecamatan,
      "Kategori": l.kategori,
      "OPD": l.opd?.nama ?? "",
      "Lokasi": l.lokasi ?? "",
      "Isi Laporan": l.isi_laporan,
      "Status": STATUS_CONFIG[l.status].label,
      "Catatan Admin": l.catatan_admin ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `laporan-bupati-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("File berhasil diexport");
  };

  // Import Excel
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb  = XLSX.read(buf, { type: "array" });
      const ws  = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string,string>>(ws);

      const toInsert = rows.map((row) => ({
        nomor_ref:    row["No. Ref"] || row["nomor_ref"] || generateNomorRef(),
        nama_pelapor: row["Nama Pelapor"] || row["nama_pelapor"] || undefined,
        no_hp:        String(row["No. HP"] || row["no_hp"] || "-"),
        kecamatan:    row["Kecamatan"] || row["kecamatan"] || "-",
        kategori:     row["Kategori"]  || row["kategori"]  || "Lainnya",
        isi_laporan:  row["Isi Laporan"] || row["isi_laporan"] || "-",
        lokasi:       row["Lokasi"] || row["lokasi"] || undefined,
        status:       (row["Status"]?.toLowerCase() === "selesai" ? "selesai"
                     : row["Status"]?.toLowerCase().includes("proses") ? "proses"
                     : row["Status"]?.toLowerCase() === "ditolak" ? "ditolak"
                     : "pending") as StatusLaporan,
        catatan_admin: row["Catatan Admin"] || row["catatan_admin"] || undefined,
      }));

      // Insert batch
      const { error, count } = await supabase.from("laporan").upsert(toInsert as any, { onConflict: "nomor_ref" });
      if (error) throw error;
      toast.success(`Berhasil import ${rows.length} laporan`);
      load();
    } catch (err: any) {
      toast.error("Gagal import: " + (err?.message ?? "Format file tidak sesuai"));
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Daftar Laporan</h1>
          <p className="text-sm text-gray-500">{filtered.length} laporan ditemukan</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          <button onClick={() => fileRef.current?.click()} disabled={importing} className="btn btn-secondary text-sm">
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Import Excel
          </button>
          <button onClick={exportCSV} className="btn btn-secondary text-sm">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Cari no. ref, nama, isi..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto min-w-[140px]" value={filterStatus} onChange={e => setFS(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="pending">Belum Diproses</option>
          <option value="proses">Sedang Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="ditolak">Ditolak</option>
        </select>
        <select className="input w-auto min-w-[140px]" value={filterKec} onChange={e => setFK(e.target.value)}>
          <option value="">Semua Kecamatan</option>
          {KECAMATAN_LIST.map(k => <option key={k}>{k}</option>)}
        </select>
        <select className="input w-auto min-w-[150px]" value={filterKat} onChange={e => setFKat(e.target.value)}>
          <option value="">Semua Kategori</option>
          {KATEGORI_LIST.map(k => <option key={k}>{k}</option>)}
        </select>
        {(search || filterStatus || filterKec || filterKat) && (
          <button onClick={() => { setSearch(""); setFS(""); setFK(""); setFKat(""); }} className="btn btn-ghost text-sm">
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Memuat...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["No. Ref", "Tanggal", "Nama / HP", "Kecamatan", "Kategori", "OPD", "Status", "Aksi"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const st = STATUS_CONFIG[l.status];
                  return (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-gray-600 whitespace-nowrap">{l.nomor_ref}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(l.created_at)}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800 text-xs">{l.nama_pelapor || <span className="text-gray-400 italic">Anonim</span>}</p>
                        <p className="text-gray-400 text-xs">{l.no_hp}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-xs whitespace-nowrap">{l.kecamatan}</td>
                      <td className="py-3 px-4 text-gray-700 text-xs">{l.kategori}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{l.opd?.singkatan || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="badge text-xs" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailTarget(l)} className="btn btn-ghost p-1.5" title="Lihat detail">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditTarget(l)} className="btn btn-ghost p-1.5" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(l)} className="btn btn-ghost p-1.5 text-red-500 hover:bg-red-50" title="Hapus">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">Tidak ada laporan ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {editTarget   && <EditModal laporan={editTarget} opdList={opdList} onClose={() => setEditTarget(null)} onSaved={load} />}
      {detailTarget && <DetailModal laporan={detailTarget} onClose={() => setDetailTarget(null)} />}

      {/* Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hapus Laporan?</h3>
                <p className="text-xs text-gray-400 font-mono">{deleteTarget.nomor_ref}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Laporan ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
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
