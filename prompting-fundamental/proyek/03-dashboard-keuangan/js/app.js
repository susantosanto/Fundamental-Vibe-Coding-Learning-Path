/**
 * APP.JS - Logika utama aplikasi
 * Inisialisasi, event handlers, integrasi
 */

// Toggle form tambah transaksi
function toggleForm() {
  const form = document.getElementById('formSection');
  const isHidden = form.style.display === 'none';
  form.style.display = isHidden ? 'block' : 'none';

  // Set tanggal default ke hari ini
  if (isHidden) {
    document.getElementById('inputTanggal').value = new Date().toISOString().slice(0, 10);
  }
}

// Tambah transaksi dari form
function tambahTransaksi(event) {
  event.preventDefault();

  const tanggal = document.getElementById('inputTanggal').value;
  const tipe = document.getElementById('inputTipe').value;
  const kategori = document.getElementById('inputKategori').value;
  const jumlah = parseInt(document.getElementById('inputJumlah').value);
  const deskripsi = document.getElementById('inputDeskripsi').value.trim();

  // Validasi
  if (!tanggal || !jumlah || jumlah <= 0 || !deskripsi) {
    alert('Mohon isi semua field dengan benar!');
    return false;
  }

  // Tambah ke state
  State.tambah({ tanggal, tipe, kategori, jumlah, deskripsi });

  // Reset form
  document.getElementById('formTransaksi').reset();
  toggleForm();

  return false;
}

// Inisialisasi form kategori
function initFormKategori() {
  const select = document.getElementById('inputKategori');
  select.innerHTML = KATEGORI.map(k =>
    `<option value="${k.nama}">${k.icon} ${k.nama}</option>`
  ).join('');
}

// Inisialisasi app
function initApp() {
  initFormKategori();
  State.init();
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', initApp);
