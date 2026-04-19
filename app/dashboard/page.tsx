"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { STATUS_CONFIG, KATEGORI_LIST, type Laporan } from "@/types";
import { formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FileText, Clock, Loader2 as Spin, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const COLORS = ["#1D6A45","#2563eb","#d97706","#dc2626","#7c3aed","#0891b2","#65a30d","#9ca3af"];

export default function DashboardPage() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("laporan").select("*, opd(id,nama,singkatan)").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setLaporan(data as Laporan[]); setLoading(false); });
  }, []);

  const total = laporan.length;
  const pending = laporan.filter(l => l.status === "pending").length;
  const proses  = laporan.filter(l => l.status === "proses").length;
  const selesai = laporan.filter(l => l.status === "selesai").length;
  const ditolak = laporan.filter(l => l.status === "ditolak").length;

  // Chart: per kategori
  const kategoriData = KATEGORI_LIST.map(k => ({
    name: k.split(" ")[0],
    fullName: k,
    total: laporan.filter(l => l.kategori === k).length,
  })).filter(d => d.total > 0);

  // Chart: pie status
  const pieData = [
    { name: "Belum Diproses", value: pending,  color: "#d97706" },
    { name: "Sedang Diproses", value: proses,  color: "#2563eb" },
    { name: "Selesai",         value: selesai, color: "#1D6A45" },
    { name: "Ditolak",         value: ditolak, color: "#dc2626" },
  ].filter(d => d.value > 0);

  // Chart: per bulan (6 bulan terakhir)
  const bulanData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
      const count = laporan.filter(l => {
        const ld = new Date(l.created_at);
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
      }).length;
      return { name: label, total: count };
    });
  })();

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <Spin className="w-6 h-6 animate-spin mr-2" /> Memuat data...
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Ringkasan laporan masuk — Kabupaten Aceh Barat</p>
        </div>
        <Link href="/dashboard/laporan" className="btn btn-primary text-sm">
          Lihat Semua Laporan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Laporan",    value: total,   icon: FileText,     color: "text-primary-600", bg: "bg-primary-50" },
          { label: "Belum Diproses",   value: pending, icon: Clock,        color: "text-amber-600",   bg: "bg-amber-50" },
          { label: "Sedang Diproses",  value: proses,  icon: Spin,         color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Selesai",          value: selesai, icon: CheckCircle2, color: "text-green-600",   bg: "bg-green-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Laporan per Bulan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bulanData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#1D6A45" radius={[4,4,0,0]} name="Laporan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Status Laporan</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>}
        </div>
      </div>

      {/* Per kategori */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Laporan per Kategori</h3>
        {kategoriData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={kategoriData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 80 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v, _n, props) => [v, props?.payload?.fullName]} />
              <Bar dataKey="total" radius={[0,4,4,0]} name="Laporan">
                {kategoriData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>}
      </div>

      {/* Laporan terbaru */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700">Laporan Terbaru</h3>
          <Link href="/dashboard/laporan" className="text-xs text-primary-600 hover:underline">Lihat semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">No. Ref</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Tanggal</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Kecamatan</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Kategori</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {laporan.slice(0, 8).map(l => {
                const st = STATUS_CONFIG[l.status];
                return (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-600">{l.nomor_ref}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs">{formatDate(l.created_at)}</td>
                    <td className="py-2.5 px-3 text-gray-700">{l.kecamatan}</td>
                    <td className="py-2.5 px-3 text-gray-700">{l.kategori}</td>
                    <td className="py-2.5 px-3">
                      <span className="badge text-xs" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
              {laporan.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">Belum ada laporan masuk</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
