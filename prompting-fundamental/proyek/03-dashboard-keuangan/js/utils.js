/**
 * UTILS.JS - Fungsi bantu (helper functions)
 * Setiap function hanya 1 tugas
 */

// Format angka ke Rupiah
function formatRupiah(angka) {
  if (angka === undefined || angka === null) return 'Rp 0';
  return 'Rp ' + Math.round(angka).toLocaleString('id-ID');
}

// Format tanggal ISO ke format Indonesia
function formatTanggal(dateStr) {
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parseInt(parts[2])} ${bulan[parseInt(parts[1])-1]} ${parts[0]}`;
}

// Dapatkan icon untuk kategori
function getKategoriIcon(kategori) {
  const found = KATEGORI.find(k => k.nama === kategori);
  return found ? found.icon : '📦';
}

// Dapatkan warna untuk kategori (untuk grafik)
function getKategoriWarna(kategori) {
  const warnaMap = {
    'Makanan': '#E74C3C',
    'Transport': '#3498DB',
    'Belanja': '#9B59B6',
    'Tagihan': '#1ABC9C',
    'Hiburan': '#F39C12',
    'Gaji': '#2ECC71',
    'Freelance': '#1ABC9C',
    'Investasi': '#2ECC71',
    'Kesehatan': '#E91E63',
    'Pendidikan': '#00BCD4',
    'Lainnya': '#95A5A6'
  };
  return warnaMap[kategori] || '#95A5A6';
}

// Kelompokkan data berdasarkan kategori
function kelompokkanPerKategori(data, tipe) {
  const filtered = data.filter(t => t.tipe === tipe);
  const result = {};

  filtered.forEach(t => {
    if (!result[t.kategori]) result[t.kategori] = 0;
    result[t.kategori] += t.jumlah;
  });

  return Object.entries(result)
    .map(([kategori, jumlah]) => ({ kategori, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah);
}

// Dapatkan list bulan dari transaksi
function getDaftarBulan(data) {
  const bulanSet = new Set();
  data.forEach(t => {
    if (t.tanggal && t.tanggal.length >= 7) {
      bulanSet.add(t.tanggal.slice(0, 7));
    }
  });
  return Array.from(bulanSet).sort().reverse();
}

// Format bulan (YYYY-MM) ke nama bulan
function formatBulan(bulanStr) {
  const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const parts = bulanStr.split('-');
  if (parts.length !== 2) return bulanStr;
  return `${namaBulan[parseInt(parts[1])-1]} ${parts[0]}`;
}
