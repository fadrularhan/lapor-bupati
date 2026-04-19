-- ============================================================
-- LAPOR BUPATI ACEH BARAT — Supabase Schema
-- Jalankan ini di: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabel OPD
create table if not exists opd (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  singkatan   text not null,
  created_at  timestamptz default now()
);

-- 2. Tabel Laporan
create table if not exists laporan (
  id             uuid primary key default gen_random_uuid(),
  nomor_ref      text unique not null,
  nama_pelapor   text,
  no_hp          text not null,
  kecamatan      text not null,
  kategori       text not null,
  opd_id         uuid references opd(id) on delete set null,
  isi_laporan    text not null,
  lokasi         text,
  status         text not null default 'pending'
                   check (status in ('pending','proses','selesai','ditolak')),
  catatan_admin  text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 3. Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger laporan_updated_at
  before update on laporan
  for each row execute function update_updated_at();

-- 4. RLS — aktifkan tapi allow all untuk sekarang (tanpa login)
alter table opd     enable row level security;
alter table laporan enable row level security;

-- Allow semua operasi dari anon key (karena belum pakai auth)
create policy "allow_all_opd"     on opd     for all using (true) with check (true);
create policy "allow_all_laporan" on laporan for all using (true) with check (true);

-- 5. Seed data OPD awal
insert into opd (nama, singkatan) values
  ('Dinas Kesehatan',              'Dinkes'),
  ('Dinas Pendidikan',             'Disdik'),
  ('Dinas Pekerjaan Umum & PR',    'PUPR'),
  ('Dinas Sosial',                 'Dinsos'),
  ('Dinas Perhubungan',            'Dishub'),
  ('Dinas Lingkungan Hidup',       'DLH'),
  ('Badan Perencanaan (Bappeda)',  'Bappeda'),
  ('Satuan Polisi Pamong Praja',   'Satpol PP'),
  ('Dinas Kependudukan & Capil',   'Disdukcapil'),
  ('Dinas Komunikasi & Informatika','Diskominfo')
on conflict do nothing;

-- ============================================================
-- SELESAI — Cek tabel di Table Editor Supabase
-- ============================================================
