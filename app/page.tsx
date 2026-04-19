"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { generateNomorRef } from "@/lib/utils";
import { KECAMATAN_LIST, KATEGORI_LIST, type OPD } from "@/types";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

type Step = 1 | 2;

export default function HomePage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nomorRef, setNomorRef] = useState("");
  const [opdList, setOpdList] = useState<OPD[]>([]);

  const [form, setForm] = useState({
    nama_pelapor: "",
    no_hp: "",
    kecamatan: "",
    kategori: "",
    opd_id: "",
    isi_laporan: "",
    lokasi: "",
  });

  useEffect(() => {
    supabase.from("opd").select("*").order("nama").then(({ data }) => {
      if (data) setOpdList(data);
    });
  }, []);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.no_hp || !form.kecamatan || !form.kategori || !form.isi_laporan) return;
    setLoading(true);
    const ref = generateNomorRef();
    const { error } = await supabase.from("laporan").insert({
      nomor_ref: ref,
      nama_pelapor: form.nama_pelapor || null,
      no_hp: form.no_hp,
      kecamatan: form.kecamatan,
      kategori: form.kategori,
      opd_id: form.opd_id || null,
      isi_laporan: form.isi_laporan,
      lokasi: form.lokasi || null,
      status: "pending",
    });
    setLoading(false);
    if (!error) {
      setNomorRef(ref);
      setSubmitted(true);
    }
  };

  const reset = () => {
    setForm({ nama_pelapor:"", no_hp:"", kecamatan:"", kategori:"", opd_id:"", isi_laporan:"", lokasi:"" });
    setStep(1);
    setSubmitted(false);
    setNomorRef("");
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Laporan Berhasil Dikirim!</h2>
          <p className="text-gray-500 text-sm mb-6">Simpan nomor referensi berikut untuk memantau status laporan Anda.</p>
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">Nomor Referensi</p>
            <p className="text-2xl font-bold text-primary-700 font-mono">{nomorRef}</p>
          </div>
          <p className="text-xs text-gray-400 mb-6">Tim kami akan segera menindaklanjuti laporan Anda dalam 3 hari kerja.</p>
          <button onClick={reset} className="btn btn-primary w-full justify-center">
            <MessageSquarePlus className="w-4 h-4" /> Buat Laporan Baru
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <div className="text-white">
          <p className="text-xs opacity-70 uppercase tracking-widest font-medium">Kabupaten Aceh Barat</p>
          <h1 className="text-lg font-bold">Lapor Bupati</h1>
        </div>
        <Link href="/dashboard" className="text-xs text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg transition-all">
          Dashboard Admin →
        </Link>
      </header>

      {/* Hero text */}
      <div className="text-center text-white px-4 pt-6 pb-10">
        <h2 className="text-3xl font-bold mb-2">Suara Anda <span className="text-gold-400">Penting</span></h2>
        <p className="text-white/70 text-sm max-w-sm mx-auto">Sampaikan laporan atau aspirasi langsung kepada Bupati. Setiap laporan ditindaklanjuti dengan serius.</p>
      </div>

      {/* Form Card */}
      <div className="max-w-xl mx-auto px-4 pb-12">
        <div className="card p-6 md:p-8">
          {/* Step indicator */}
          <div className="flex items-center mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step >= s ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {s}
                </div>
                <span className={`ml-2 text-sm font-medium ${step === s ? "text-gray-800" : "text-gray-400"}`}>
                  {s === 1 ? "Data Diri" : "Isi Laporan"}
                </span>
                {s < 2 && <div className={`w-12 h-0.5 mx-3 ${step > s ? "bg-primary-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nama Lengkap <span className="text-gray-400 normal-case font-normal">(opsional)</span>
                </label>
                <input className="input" placeholder="Masukkan nama..." value={form.nama_pelapor}
                  onChange={e => set("nama_pelapor", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  No. HP / WhatsApp <span className="text-red-400">*</span>
                </label>
                <input className="input" placeholder="08xx-xxxx-xxxx" value={form.no_hp}
                  onChange={e => set("no_hp", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Kecamatan <span className="text-red-400">*</span>
                </label>
                <select className="input" value={form.kecamatan} onChange={e => set("kecamatan", e.target.value)}>
                  <option value="">-- Pilih Kecamatan --</option>
                  {KECAMATAN_LIST.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
              <button
                className="btn btn-primary w-full justify-center mt-2"
                disabled={!form.no_hp || !form.kecamatan}
                onClick={() => setStep(2)}>
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Kategori Laporan <span className="text-red-400">*</span>
                </label>
                <select className="input" value={form.kategori} onChange={e => set("kategori", e.target.value)}>
                  <option value="">-- Pilih Kategori --</option>
                  {KATEGORI_LIST.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  OPD / Instansi Terkait <span className="text-gray-400 normal-case font-normal">(opsional)</span>
                </label>
                <select className="input" value={form.opd_id} onChange={e => set("opd_id", e.target.value)}>
                  <option value="">-- Pilih OPD --</option>
                  {opdList.map(o => <option key={o.id} value={o.id}>{o.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Isi Laporan <span className="text-red-400">*</span>
                </label>
                <textarea className="input min-h-[100px]" placeholder="Ceritakan masalah atau aspirasi Anda..."
                  value={form.isi_laporan} onChange={e => set("isi_laporan", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Alamat / Lokasi Spesifik
                </label>
                <input className="input" placeholder="Contoh: Jl. Nasional, depan RSUD..." value={form.lokasi}
                  onChange={e => set("lokasi", e.target.value)} />
              </div>
              <div className="flex gap-3 pt-1">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  className="btn btn-primary flex-1 justify-center"
                  disabled={!form.kategori || !form.isi_laporan || loading}
                  onClick={handleSubmit}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Kirim Laporan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: "📋", title: "Tercatat", desc: "Setiap laporan mendapat nomor referensi" },
            { icon: "⚡", title: "Cepat", desc: "OPD terkait ditugaskan dalam 3 hari kerja" },
            { icon: "🔒", title: "Aman", desc: "Identitas pelapor dijaga kerahasiaannya" },
          ].map(item => (
            <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center text-white">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-bold">{item.title}</p>
              <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
