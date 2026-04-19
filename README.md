<<<<<<< HEAD
# Lapor Bupati – Aceh Barat

Sistem pengaduan masyarakat berbasis web untuk Kabupaten Aceh Barat.

## Stack
- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + Realtime)
- **Tailwind CSS**
- **Recharts** (grafik)
- **xlsx** (import/export Excel)

---

## Langkah Setup

### 1. Setup Database Supabase

1. Buka https://supabase.com/dashboard
2. Pilih project `laporbupatimbo` (yang sudah ada)
3. Pergi ke **SQL Editor**
4. Copy-paste isi file `supabase-schema.sql` → klik **Run**
5. Cek di **Table Editor** — harus muncul tabel `opd` dan `laporan`

### 2. Ambil API Keys Supabase

1. Di Supabase Dashboard → **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Setup Project Lokal

```bash
# Clone atau copy folder ini
cd lapor-bupati

# Install dependencies
npm install

# Buat file env
cp .env.local.example .env.local

# Edit .env.local — isi dengan URL dan key dari Supabase
nano .env.local

# Jalankan dev server
npm run dev
```

Buka http://localhost:3000

---

## Deploy ke Vercel

### Cara 1: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Cara 2: Via GitHub
1. Push project ini ke GitHub
2. Buka https://vercel.com/new
3. Import repo
4. Tambahkan **Environment Variables** di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

---

## Fitur

### Form Publik (`/`)
- Warga bisa mengisi laporan 2 langkah
- Dapat nomor referensi otomatis setelah kirim
- OPD diambil dinamis dari database

### Dashboard Admin (`/dashboard`)
- Statistik ringkasan (total, pending, proses, selesai)
- Grafik laporan per bulan, per kategori, per status

### Manajemen Laporan (`/dashboard/laporan`)
- Filter by status, kecamatan, kategori, search
- **Edit** laporan (semua field + catatan admin)
- **Hapus** laporan dengan konfirmasi
- **Import** dari file Excel (format kolom: No. Ref, Nama Pelapor, No. HP, Kecamatan, Kategori, OPD, Lokasi, Isi Laporan, Status, Catatan Admin)
- **Export** ke Excel

### Kelola OPD (`/dashboard/opd`)
- **Tambah** OPD baru (nama + singkatan)
- **Edit** OPD yang ada
- **Hapus** OPD (otomatis set laporan terkait ke null)

---

## Format Import Excel

Kolom yang dikenali (nama kolom di baris pertama):

| Kolom | Keterangan |
|-------|-----------|
| No. Ref | Nomor referensi (opsional, akan digenerate jika kosong) |
| Nama Pelapor | Boleh kosong |
| No. HP | Wajib |
| Kecamatan | Wajib |
| Kategori | Wajib |
| OPD | Opsional (nama OPD, tidak otomatis link ke tabel opd) |
| Lokasi | Opsional |
| Isi Laporan | Wajib |
| Status | pending / proses / selesai / ditolak |
| Catatan Admin | Opsional |

---

## Struktur Folder

```
lapor-bupati/
├── app/
│   ├── page.tsx              # Form publik
│   ├── layout.tsx
│   ├── globals.css
│   └── dashboard/
│       ├── layout.tsx        # Nav admin
│       ├── page.tsx          # Statistik
│       ├── laporan/
│       │   └── page.tsx      # Manajemen laporan
│       └── opd/
│           └── page.tsx      # Manajemen OPD
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Helper functions
├── types/
│   └── index.ts              # TypeScript types
├── supabase-schema.sql       # Schema database
├── .env.local.example        # Template env
└── README.md
```
=======
# laporbupati
>>>>>>> d2c99d056b204a4b94e80ae25f1f124366f632e2
