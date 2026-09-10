/**
 * DATA.JS - Manajemen data & localStorage
 * Prinsip: Semua data di 1 tempat (State terpusat)
 */

// Data dummy untuk contoh awal
const DATA_DUMMY = [
  { id: 1, tanggal: '2024-01-10', tipe: 'pemasukan', kategori: 'Gaji', deskripsi: 'Gaji Bulan Januari', jumlah: 5000000 },
  { id: 2, tanggal: '2024-01-12', tipe: 'pengeluaran', kategori: 'Makanan', deskripsi: 'Nasi Goreng & Es Teh', jumlah: 50000 },
  { id: 3, tanggal: '2024-01-15', tipe: 'pengeluaran', kategori: 'Transport', deskripsi: 'Bensin Motor', jumlah: 100000 },
  { id: 4, tanggal: '2024-01-18', tipe: 'pemasukan', kategori: 'Freelance', deskripsi: 'Project Website', jumlah: 1500000 },
  { id: 5, tanggal: '2024-01-20', tipe: 'pengeluaran', kategori: 'Belanja', deskripsi: 'Beli Baju Baru', jumlah: 300000 },
  { id: 6, tanggal: '2024-01-22', tipe: 'pengeluaran', kategori: 'Makanan', deskripsi: 'Makan di Restoran', jumlah: 150000 },
  { id: 7, tanggal: '2024-01-25', tipe: 'pengeluaran', kategori: 'Tagihan', deskripsi: 'Listrik Bulanan', jumlah: 450000 },
  { id: 8, tanggal: '2024-01-28', tipe: 'pemasukan', kategori: 'Investasi', deskripsi: 'Dividen Saham', jumlah: 200000 },
  { id: 9, tanggal: '2024-02-02', tipe: 'pengeluaran', kategori: 'Hiburan', deskripsi: 'Nonton Bioskop', jumlah: 80000 },
  { id: 10, tanggal: '2024-02-05', tipe: 'pengeluaran', kategori: 'Transport', deskripsi: 'Gojek ke Kantor', jumlah: 25000 },
  { id: 11, tanggal: '2024-02-08', tipe: 'pemasukan', kategori: 'Gaji', deskripsi: 'Gaji Bulan Februari', jumlah: 5000000 },
  { id: 12, tanggal: '2024-02-10', tipe: 'pengeluaran', kategori: 'Makanan', deskripsi: 'Beli Sembako', jumlah: 200000 }
];

// Daftar kategori
const KATEGORI = [
  { nama: 'Makanan', icon: '🍕' },
  { nama: 'Transport', icon: '🚗' },
  { nama: 'Belanja', icon: '🛍️' },
  { nama: 'Tagihan', icon: '📄' },
  { nama: 'Hiburan', icon: '🎮' },
  { nama: 'Gaji', icon: '💼' },
  { nama: 'Freelance', icon: '💻' },
  { nama: 'Investasi', icon: '📈' },
  { nama: 'Kesehatan', icon: '🏥' },
  { nama: 'Pendidikan', icon: '📚' },
  { nama: 'Lainnya', icon: '📦' }
];

// State management - data di 1 tempat
const State = {
  transaksi: [],
  filter: 'semua',   // 'semua', 'pemasukan', 'pengeluaran'
  filterBulan: 'semua',
  filterKategori: 'semua',

  // Inisialisasi
  init() {
    this.transaksi = this.loadData();
    this.renderSemua();
  },

  // ===== CRUD =====

  tambah(item) {
    item.id = Date.now();
    this.transaksi.unshift(item);
    this.simpanData();
    this.renderSemua();
  },

  hapus(id) {
    this.transaksi = this.transaksi.filter(t => t.id !== id);
    this.simpanData();
    this.renderSemua();
  },

  // ===== STORAGE =====

  simpanData() {
    localStorage.setItem('keuanganApp', JSON.stringify(this.transaksi));
  },

  loadData() {
    const data = localStorage.getItem('keuanganApp');
    if (data) {
      try { return JSON.parse(data); }
      catch (e) { return [...DATA_DUMMY]; }
    }
    // Pertama kali: simpan dummy data
    localStorage.setItem('keuanganApp', JSON.stringify(DATA_DUMMY));
    return [...DATA_DUMMY];
  },

  // ===== FILTER =====

  setFilter(filter, btn) {
    this.filter = filter;
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderSemua();
  },

  applyFilter() {
    this.filterBulan = document.getElementById('filterBulan')?.value || 'semua';
    this.filterKategori = document.getElementById('filterKategori')?.value || 'semua';
    this.renderSemua();
  },

  getFilteredData() {
    let data = [...this.transaksi];

    // Filter tipe
    if (this.filter !== 'semua') {
      data = data.filter(t => t.tipe === this.filter);
    }

    // Filter bulan
    if (this.filterBulan && this.filterBulan !== 'semua') {
      data = data.filter(t => t.tanggal.startsWith(this.filterBulan));
    }

    // Filter kategori
    if (this.filterKategori && this.filterKategori !== 'semua') {
      data = data.filter(t => t.kategori === this.filterKategori);
    }

    return data;
  },

  // ===== STATISTIK =====

  getTotalPemasukan(data) {
    return data.filter(t => t.tipe === 'pemasukan').reduce((sum, t) => sum + t.jumlah, 0);
  },

  getTotalPengeluaran(data) {
    return data.filter(t => t.tipe === 'pengeluaran').reduce((sum, t) => sum + t.jumlah, 0);
  },

  getSaldo(data) {
    return this.getTotalPemasukan(data) - this.getTotalPengeluaran(data);
  },

  // ===== RENDER SEMUA =====

  renderSemua() {
    const data = this.getFilteredData();
    renderRingkasan(data);
    renderTabel(data);
    renderTransaksiTerbaru(data);
    renderGrafik(data);
    renderOpsiFilter();
  },

  // ===== EXPORT CSV =====

  exportCSV() {
    const data = this.transaksi;
    if (data.length === 0) {
      alert('Belum ada data untuk di-export!');
      return;
    }

    const headers = 'Tanggal,Tipe,Kategori,Deskripsi,Jumlah\n';
    const rows = data.map(t =>
      `"${t.tanggal}","${t.tipe}","${t.kategori}","${t.deskripsi}",${t.jumlah}`
    ).join('\n');

    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `keuangan_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    alert('✅ Data berhasil di-export!');
  }
};
