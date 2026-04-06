// ============================================================
// STORAGE HELPERS — pakai localStorage sebagai "database"
// ============================================================
const STORAGE_KEY = 'lapor_bupati_data';

function getAllLaporan() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveLaporan(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  const all = getAllLaporan();
  const next = all.length + 1;
  return 'LP-' + String(next).padStart(4, '0');
}

function formatTanggal(isoStr) {
  const d = new Date(isoStr);
  const bln = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return d.getDate() + ' ' + bln[d.getMonth()] + ' ' + d.getFullYear();
}

// ============================================================
// FORM LOGIC (index.html only)
// ============================================================
if (document.getElementById('laporan-form')) {

  function goStep2() {
    let ok = true;

    const nama = document.getElementById('nama').value.trim();
    const hp = document.getElementById('hp').value.trim();
    const kec = document.getElementById('kecamatan').value;

    document.getElementById('err-nama').textContent = '';
    document.getElementById('err-hp').textContent = '';
    document.getElementById('err-kec').textContent = '';

    if (!nama) {
      document.getElementById('err-nama').textContent = 'Nama wajib diisi';
      document.getElementById('nama').classList.add('error');
      ok = false;
    } else { document.getElementById('nama').classList.remove('error'); }

    if (!hp || !/^08\d{8,12}$/.test(hp.replace(/\s/g, ''))) {
      document.getElementById('err-hp').textContent = 'Format HP tidak valid (contoh: 08123456789)';
      document.getElementById('hp').classList.add('error');
      ok = false;
    } else { document.getElementById('hp').classList.remove('error'); }

    if (!kec) {
      document.getElementById('err-kec').textContent = 'Pilih kecamatan';
      document.getElementById('kecamatan').classList.add('error');
      ok = false;
    } else { document.getElementById('kecamatan').classList.remove('error'); }

    if (!ok) return;

    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('step1-tab').classList.remove('active');
    document.getElementById('step2-tab').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goStep1() {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step2-tab').classList.remove('active');
    document.getElementById('step1-tab').classList.add('active');
  }

  document.getElementById('laporan-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let ok = true;

    const kat = document.getElementById('kategori').value;
    const judul = document.getElementById('judul').value.trim();
    const isi = document.getElementById('isi').value.trim();

    document.getElementById('err-kat').textContent = '';
    document.getElementById('err-judul').textContent = '';
    document.getElementById('err-isi').textContent = '';

    if (!kat) {
      document.getElementById('err-kat').textContent = 'Pilih kategori laporan';
      ok = false;
    }
    if (!judul) {
      document.getElementById('err-judul').textContent = 'Judul laporan wajib diisi';
      ok = false;
    }
    if (isi.length < 20) {
      document.getElementById('err-isi').textContent = 'Isi laporan minimal 20 karakter';
      ok = false;
    }
    if (!ok) return;

    const btn = document.getElementById('btn-submit');
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';

    const id = generateId();
    const newLaporan = {
      id,
      tanggal: new Date().toISOString(),
      nama: document.getElementById('nama').value.trim(),
      hp: document.getElementById('hp').value.trim(),
      email: document.getElementById('email').value.trim(),
      kecamatan: document.getElementById('kecamatan').value,
      desa: document.getElementById('desa').value.trim(),
      kategori: kat,
      opd: document.getElementById('opd').value || '-',
      judul,
      isi,
      lokasi: document.getElementById('lokasi').value.trim(),
      status: 'Pending',
    };

    const all = getAllLaporan();
    all.unshift(newLaporan);
    saveLaporan(all);

    setTimeout(() => {
      document.getElementById('form-section').classList.add('hidden');
      document.getElementById('success-section').classList.remove('hidden');
      document.getElementById('ref-number').textContent = id;
      btn.disabled = false;
      btn.textContent = 'Kirim Laporan';
    }, 600);
  });

  function resetForm() {
    document.getElementById('laporan-form').reset();
    document.getElementById('success-section').classList.add('hidden');
    document.getElementById('form-section').classList.remove('hidden');
    goStep1();
  }

  window.goStep1 = goStep1;
  window.goStep2 = goStep2;
  window.resetForm = resetForm;
}
