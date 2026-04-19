// ============================================================
// DASHBOARD LOGIC
// ============================================================

// Seed demo data jika localStorage kosong
function seedDemoData() {
  const existing = getAllLaporan();
  if (existing.length > 0) return;

  const demo = [
    { id:'LP-0001', tanggal:'2025-03-01T08:00:00', nama:'Budi Santoso', hp:'08123456701', email:'', kecamatan:'Johan Pahlawan', desa:'Ujong Baroh', kategori:'Infrastruktur & Jalan', opd:'Dinas PUPR', judul:'Jalan rusak depan SD Negeri 3', isi:'Jalan di depan SD Negeri 3 sudah rusak parah sejak 2 bulan lalu. Banyak lubang yang berbahaya bagi pengendara, terutama anak-anak yang berangkat sekolah.', lokasi:'Jl. Teuku Umar, Ujong Baroh', status:'Selesai' },
    { id:'LP-0002', tanggal:'2025-03-05T09:30:00', nama:'Siti Aminah', hp:'08123456702', email:'', kecamatan:'Meulaboh', desa:'Drien Rampak', kategori:'Pelayanan Publik', opd:'Dinas Kesehatan', judul:'Puskesmas sering tutup sebelum waktunya', isi:'Puskesmas Drien Rampak sering tutup pada pukul 11 siang padahal jam pelayanan sampai pukul 14.00. Banyak pasien yang pulang tanpa mendapat pelayanan.', lokasi:'Puskesmas Drien Rampak', status:'Proses' },
    { id:'LP-0003', tanggal:'2025-03-08T10:00:00', nama:'Rahmat Ali', hp:'08123456703', email:'', kecamatan:'Meureubo', desa:'Meureubo', kategori:'Infrastruktur & Jalan', opd:'Dinas PUPR', judul:'Lampu jalan mati lebih dari 2 minggu', isi:'Lampu penerangan jalan di Desa Meureubo sudah mati lebih dari 2 minggu. Malam hari sangat gelap dan rawan kecelakaan maupun tindak kriminal.', lokasi:'Jl. Nasional KM 5, Meureubo', status:'Proses' },
    { id:'LP-0004', tanggal:'2025-03-10T11:00:00', nama:'Dewi Lestari', hp:'08123456704', email:'', kecamatan:'Kaway XVI', desa:'Paya Baro', kategori:'Sosial & Ekonomi', opd:'Dinas Sosial', judul:'Bantuan PKH tidak merata', isi:'Terdapat beberapa keluarga miskin di Desa Paya Baro yang belum mendapatkan bantuan PKH meskipun sudah mendaftar. Sementara ada warga mampu yang justru masih menerima.', lokasi:'Desa Paya Baro, Kaway XVI', status:'Pending' },
    { id:'LP-0005', tanggal:'2025-03-12T08:30:00', nama:'Hendra Putra', hp:'08123456705', email:'', kecamatan:'Samatiga', desa:'Suak Ribee', kategori:'Pendidikan', opd:'Dinas Pendidikan', judul:'Guru honorer belum menerima gaji 3 bulan', isi:'Beberapa guru honorer di SDN 5 Samatiga belum menerima gaji selama 3 bulan. Mereka kesulitan memenuhi kebutuhan sehari-hari dan mengancam kualitas pendidikan.', lokasi:'SDN 5 Samatiga, Suak Ribee', status:'Selesai' },
    { id:'LP-0006', tanggal:'2025-03-15T14:00:00', nama:'Nurhayati Binti Salim', hp:'08123456706', email:'', kecamatan:'Johan Pahlawan', desa:'Kuta Padang', kategori:'Lingkungan Hidup', opd:'Dinas PUPR', judul:'Drainase tersumbat menyebabkan banjir', isi:'Saluran drainase di Gampong Kuta Padang tersumbat oleh sampah dan sedimentasi. Setiap hujan deras rumah warga terendam banjir hingga 30 cm.', lokasi:'Gampong Kuta Padang, Johan Pahlawan', status:'Proses' },
    { id:'LP-0007', tanggal:'2025-03-17T09:00:00', nama:'Firmansyah Harun', hp:'08123456707', email:'', kecamatan:'Meulaboh', desa:'Lapang', kategori:'Pelayanan Publik', opd:'Dinas Sosial', judul:'Pelayanan e-KTP sangat lambat', isi:'Proses pengurusan e-KTP di Dinas Kependudukan memakan waktu lebih dari 3 bulan. Warga tidak mendapat kepastian kapan selesai.', lokasi:'Disdukcapil Aceh Barat', status:'Selesai' },
    { id:'LP-0008', tanggal:'2025-03-20T10:30:00', nama:'Mariam Ulfa', hp:'08123456708', email:'', kecamatan:'Meureubo', desa:'Ranub dong', kategori:'Lingkungan Hidup', opd:'Dinas Lingkungan Hidup', judul:'Pohon tumbang belum dibersihkan seminggu', isi:'Sebuah pohon besar tumbang di tepi jalan desa seminggu yang lalu akibat angin kencang. Pohon tersebut mempersempit jalan dan belum ada petugas yang membersihkan.', lokasi:'Jl. Desa Ranub Dong, Meureubo', status:'Pending' },
    { id:'LP-0009', tanggal:'2025-03-22T11:00:00', nama:'Zulkifli Ahmad', hp:'08123456709', email:'', kecamatan:'Kaway XVI', desa:'Suak Pandan', kategori:'Pendidikan', opd:'Dinas Pendidikan', judul:'Kekurangan buku pelajaran kelas 5', isi:'Siswa kelas 5 SDN 2 Kaway XVI kekurangan buku pelajaran Matematika dan IPA. Satu buku digunakan oleh 3-4 siswa sekaligus sehingga mengganggu proses belajar.', lokasi:'SDN 2 Kaway XVI, Suak Pandan', status:'Selesai' },
    { id:'LP-0010', tanggal:'2025-03-25T08:00:00', nama:'Rina Sari Dewi', hp:'08123456710', email:'', kecamatan:'Johan Pahlawan', desa:'Suak Indra Puri', kategori:'Lingkungan Hidup', opd:'Dinas Kesehatan', judul:'Sampah menumpuk di pasar lama', isi:'Tumpukan sampah di Pasar Lama sudah sangat mengganggu. Bau busuk menyebar ke pemukiman sekitar dan berpotensi menjadi sumber penyakit. TPS sudah penuh tapi tidak segera diangkut.', lokasi:'Pasar Lama, Suak Indra Puri', status:'Proses' },
  ];

  saveLaporan(demo);
}

// ============================================================
// RENDER TABLE
// ============================================================
let currentData = [];
let activeId = null;

function applyFilter() {
  const fs = document.getElementById('fil-status').value;
  const fk = document.getElementById('fil-kec').value;
  const fkat = document.getElementById('fil-kat').value;

  const all = getAllLaporan();
  currentData = all.filter(r =>
    (!fs || r.status === fs) &&
    (!fk || r.kecamatan === fk) &&
    (!fkat || r.kategori === fkat)
  );

  renderTable(currentData);
}

function pillClass(status) {
  if (status === 'Pending') return 'pill pill-pending';
  if (status === 'Proses') return 'pill pill-proses';
  return 'pill pill-selesai';
}

function renderTable(rows) {
  const tbody = document.getElementById('tbody');
  const info = document.getElementById('table-info');

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;color:#aaa;">Tidak ada data</td></tr>';
    info.textContent = '0 laporan ditampilkan';
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td style="font-weight:600;color:#1a4a6b">${r.id}</td>
      <td style="color:#888;white-space:nowrap">${formatTanggal(r.tanggal)}</td>
      <td>${r.nama || 'Anonim'}</td>
      <td>${r.kecamatan}</td>
      <td>${r.kategori}</td>
      <td>${r.opd || '-'}</td>
      <td><span class="${pillClass(r.status)}">${r.status}</span></td>
      <td><button class="btn-detail" onclick="openModal('${r.id}')">Detail</button></td>
    </tr>
  `).join('');

  info.textContent = `Menampilkan ${rows.length} dari ${getAllLaporan().length} laporan`;
}

// ============================================================
// MODAL
// ============================================================
function openModal(id) {
  const all = getAllLaporan();
  const r = all.find(x => x.id === id);
  if (!r) return;
  activeId = id;

  document.getElementById('m-ref').textContent = r.id;
  document.getElementById('m-nama').textContent = r.nama || 'Anonim';
  document.getElementById('m-hp').textContent = r.hp;
  document.getElementById('m-kec').textContent = r.kecamatan;
  document.getElementById('m-kat').textContent = r.kategori;
  document.getElementById('m-opd').textContent = r.opd || '-';
  document.getElementById('m-lokasi').textContent = r.lokasi || '-';
  document.getElementById('m-isi').textContent = r.isi;
  document.getElementById('m-status-sel').value = r.status;

  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  activeId = null;
}

function updateStatus() {
  if (!activeId) return;
  const newStatus = document.getElementById('m-status-sel').value;
  const all = getAllLaporan();
  const idx = all.findIndex(x => x.id === activeId);
  if (idx === -1) return;
  all[idx].status = newStatus;
  saveLaporan(all);
  closeModal();
  refreshDashboard();
  alert('Status berhasil diubah ke: ' + newStatus);
}

// ============================================================
// STATS
// ============================================================
function updateStats(all) {
  document.getElementById('s-total').textContent = all.length;
  document.getElementById('s-pending').textContent = all.filter(r => r.status === 'Pending').length;
  document.getElementById('s-proses').textContent = all.filter(r => r.status === 'Proses').length;
  document.getElementById('s-selesai').textContent = all.filter(r => r.status === 'Selesai').length;
}

// ============================================================
// CHARTS
// ============================================================
let chartBulan, chartKat, chartStatus, chartKec;

function countBy(arr, key) {
  return arr.reduce((acc, r) => {
    acc[r[key]] = (acc[r[key]] || 0) + 1;
    return acc;
  }, {});
}

function renderCharts(all) {
  // --- Chart per Bulan (6 bulan terakhir) ---
  const bulanNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const now = new Date();
  const bulanLabels = [], bulanVals = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    bulanLabels.push(bulanNames[d.getMonth()] + " '" + d.getFullYear().toString().slice(2));
    bulanVals.push(all.filter(r => {
      const rd = new Date(r.tanggal);
      return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
    }).length);
  }
  if (chartBulan) chartBulan.destroy();
  chartBulan = new Chart(document.getElementById('c-bulan'), {
    type: 'bar',
    data: {
      labels: bulanLabels,
      datasets: [{
        label: 'Total Laporan',
        data: bulanVals,
        backgroundColor: '#1a4a6b',
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.y + ' laporan' } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: '#f0ece5' }, ticks: { font: { size: 11 }, stepSize: 1, precision: 0 }, beginAtZero: true }
      }
    }
  });

  const katCount = countBy(all, 'kategori');
  const katLabels = Object.keys(katCount);
  const katVals = Object.values(katCount);

  const statusCount = countBy(all, 'status');
  const kecCount = countBy(all, 'kecamatan');
  const kecLabels = Object.keys(kecCount).sort((a,b) => kecCount[b] - kecCount[a]).slice(0, 6);
  const kecVals = kecLabels.map(k => kecCount[k]);

  const BLUE = '#1a4a6b';
  const colors = ['#1a4a6b','#2980b9','#5dade2','#a9cce3','#d6eaf8','#ebf5fb','#154360','#1a5276'];

  if (chartKat) chartKat.destroy();
  chartKat = new Chart(document.getElementById('c-kat'), {
    type: 'doughnut',
    data: {
      labels: katLabels,
      datasets: [{ data: katVals, backgroundColor: colors.slice(0, katLabels.length), borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '60%',
      plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10, padding: 8 } } }
    }
  });

  if (chartStatus) chartStatus.destroy();
  const statusLabels = ['Pending', 'Proses', 'Selesai'];
  chartStatus = new Chart(document.getElementById('c-status'), {
    type: 'doughnut',
    data: {
      labels: statusLabels,
      datasets: [{
        data: statusLabels.map(s => statusCount[s] || 0),
        backgroundColor: ['#e74c3c','#f39c12','#27ae60'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '60%',
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10, padding: 8 } } }
    }
  });

  if (chartKec) chartKec.destroy();
  chartKec = new Chart(document.getElementById('c-kec'), {
    type: 'bar',
    data: {
      labels: kecLabels.map(k => k.length > 12 ? k.slice(0,12)+'…' : k),
      datasets: [{ data: kecVals, backgroundColor: BLUE, borderRadius: 4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: '#f0ece5' }, ticks: { font: { size: 10 }, stepSize: 1 } }
      }
    }
  });
}

// ============================================================
// EXPORT CSV
// ============================================================
function exportCSV() {
  const all = getAllLaporan();
  const header = ['No. Ref','Tanggal','Nama','HP','Kecamatan','Desa','Kategori','OPD','Judul','Lokasi','Status'];
  const rows = all.map(r => [
    r.id,
    formatTanggal(r.tanggal),
    r.nama,
    r.hp,
    r.kecamatan,
    r.desa || '',
    r.kategori,
    r.opd || '',
    '"' + (r.judul || '').replace(/"/g,'""') + '"',
    r.lokasi || '',
    r.status
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'laporan-bupati.csv';
  a.click(); URL.revokeObjectURL(url);
}

// ============================================================
// INIT
// ============================================================
function refreshDashboard() {
  const all = getAllLaporan();
  updateStats(all);
  renderCharts(all);
  applyFilter();
}

document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();

  const d = new Date();
  document.getElementById('dash-date').textContent =
    d.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  refreshDashboard();

  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
});

window.applyFilter = applyFilter;
window.openModal = openModal;
window.closeModal = closeModal;
window.updateStatus = updateStatus;
window.exportCSV = exportCSV;
