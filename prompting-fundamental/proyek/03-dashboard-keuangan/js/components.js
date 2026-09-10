/**
 * COMPONENTS.JS - Render komponen UI
 * Setiap function hanya merender 1 bagian UI
 */

// Render 4 kartu ringkasan
function renderRingkasan(data) {
  const totalPemasukan = State.getTotalPemasukan(data);
  const totalPengeluaran = State.getTotalPengeluaran(data);
  const saldo = State.getSaldo(data);

  document.getElementById('totalSaldo').textContent = formatRupiah(saldo);
  document.getElementById('totalPemasukan').textContent = formatRupiah(totalPemasukan);
  document.getElementById('totalPengeluaran').textContent = formatRupiah(totalPengeluaran);
  document.getElementById('totalTransaksi').textContent = data.length;
}

// Render tabel transaksi
function renderTabel(data) {
  const tbody = document.getElementById('tabelBody');
  const emptyState = document.getElementById('emptyState');

  if (data.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  tbody.innerHTML = data.map(t => {
    const jumlahClass = t.tipe === 'pemasukan' ? 'jumlah-pemasukan' : 'jumlah-pengeluaran';
    const prefix = t.tipe === 'pemasukan' ? '+' : '-';
    return `<tr>
      <td>${formatTanggal(t.tanggal)}</td>
      <td>${getKategoriIcon(t.kategori)} ${t.kategori}</td>
      <td>${escapeHtml(t.deskripsi)}</td>
      <td class="${jumlahClass}">${prefix}${formatRupiah(t.jumlah)}</td>
      <td><button class="btn-hapus" onclick="State.hapus(${t.id})">🗑️</button></td>
    </tr>`;
  }).join('');
}

// Render transaksi terbaru (max 5)
function renderTransaksiTerbaru(data) {
  const container = document.getElementById('transaksiTerbaru');
  const terbaru = data.slice(0, 5);

  if (terbaru.length === 0) {
    container.innerHTML = '<p class="text-muted">Belum ada transaksi.</p>';
    return;
  }

  container.innerHTML = terbaru.map(t => {
    const jumlahClass = t.tipe === 'pemasukan' ? 'jumlah-pemasukan' : 'jumlah-pengeluaran';
    const prefix = t.tipe === 'pemasukan' ? '+' : '-';
    return `<div class="item-terbaru">
      <div class="item-info">
        <div class="item-deskripsi">${getKategoriIcon(t.kategori)} ${escapeHtml(t.deskripsi)}</div>
        <div class="item-tanggal">${formatTanggal(t.tanggal)} - ${t.kategori}</div>
      </div>
      <div class="item-jumlah ${jumlahClass}">${prefix}${formatRupiah(t.jumlah)}</div>
    </div>`;
  }).join('');
}

// Render grafik lingkaran (Canvas)
function renderGrafik(data) {
  const canvas = document.getElementById('grafikChart');
  const ctx = canvas.getContext('2d');
  const legenda = document.getElementById('grafikLegenda');

  // Kelompokkan pengeluaran per kategori
  const kelompok = kelompokkanPerKategori(data, 'pengeluaran');

  if (kelompok.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada data', canvas.width/2, canvas.height/2);
    legenda.innerHTML = '';
    return;
  }

  const total = kelompok.reduce((sum, k) => sum + k.jumlah, 0);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 100;

  let startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar donut chart
  kelompok.forEach(k => {
    const sliceAngle = (k.jumlah / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = getKategoriWarna(k.kategori);
    ctx.fill();

    startAngle = endAngle;
  });

  // Lubang tengah (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Teks "Total" di tengah
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatRupiah(total), cx, cy - 8);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Pengeluaran', cx, cy + 14);

  // Render legenda
  legenda.innerHTML = kelompok.map(k => {
    const pct = ((k.jumlah / total) * 100).toFixed(1);
    return `<div class="legenda-item">
      <span class="legenda-warna" style="background:${getKategoriWarna(k.kategori)}"></span>
      ${getKategoriIcon(k.kategori)} ${k.kategori}: ${pct}%
    </div>`;
  }).join('');
}

// Render opsi filter (dropdown)
function renderOpsiFilter() {
  // Filter bulan
  const selectBulan = document.getElementById('filterBulan');
  if (selectBulan) {
    const bulanAktif = selectBulan.value;
    const daftarBulan = getDaftarBulan(State.transaksi);
    selectBulan.innerHTML = '<option value="semua">📅 Semua Bulan</option>' +
      daftarBulan.map(b => `<option value="${b}" ${b === bulanAktif ? 'selected' : ''}>${formatBulan(b)}</option>`).join('');
  }

  // Filter kategori
  const selectKat = document.getElementById('filterKategori');
  if (selectKat) {
    const katAktif = selectKat.value;
    selectKat.innerHTML = '<option value="semua">📋 Semua Kategori</option>' +
      KATEGORI.map(k => `<option value="${k.nama}" ${k.nama === katAktif ? 'selected' : ''}>${k.icon} ${k.nama}</option>`).join('');
  }
}

// Escape HTML untuk keamanan
function escapeHtml(teks) {
  const div = document.createElement('div');
  div.textContent = teks;
  return div.innerHTML;
}
