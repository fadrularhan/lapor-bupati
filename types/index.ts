export type StatusLaporan = "pending" | "proses" | "selesai" | "ditolak";

export interface OPD {
  id: string;
  nama: string;
  singkatan: string;
  created_at: string;
}

export interface Laporan {
  id: string;
  nomor_ref: string;
  nama_pelapor: string | null;
  no_hp: string;
  kecamatan: string;
  kategori: string;
  opd_id: string | null;
  opd?: OPD | null;
  isi_laporan: string;
  lokasi: string | null;
  status: StatusLaporan;
  catatan_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface LaporanInsert {
  nama_pelapor?: string;
  no_hp: string;
  kecamatan: string;
  kategori: string;
  opd_id?: string;
  isi_laporan: string;
  lokasi?: string;
  status?: StatusLaporan;
  catatan_admin?: string;
}

export const KECAMATAN_LIST = [
  "Johan Pahlawan",
  "Kaway XVI",
  "Meulaboh",
  "Arongan Lambalek",
  "Bubon",
  "Meureubo",
  "Pante Ceureumen",
  "Panton Reu",
  "Pasie Raya",
  "Samatiga",
  "Sungai Mas",
  "Woyla",
  "Woyla Barat",
  "Woyla Timur",
] as const;

export const KATEGORI_LIST = [
  "Infrastruktur & Jalan",
  "Pelayanan Publik",
  "Kesehatan",
  "Pendidikan",
  "Keamanan & Ketertiban",
  "Lingkungan Hidup",
  "Sosial & Ekonomi",
  "Lainnya",
] as const;

export const STATUS_CONFIG: Record<StatusLaporan, { label: string; color: string; bg: string }> = {
  pending:  { label: "Belum Diproses", color: "#92400e", bg: "#fef3c7" },
  proses:   { label: "Sedang Diproses", color: "#1e40af", bg: "#dbeafe" },
  selesai:  { label: "Selesai",         color: "#065f46", bg: "#d1fae5" },
  ditolak:  { label: "Ditolak",         color: "#991b1b", bg: "#fee2e2" },
};
