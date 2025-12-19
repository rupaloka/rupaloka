import { db, doc, getDoc } from "./firebase.js";

function formatDate(ts) {
  if (!ts) return "-";

  // Firestore Timestamp
  if (typeof ts.toDate === "function") {
    return ts.toDate().toLocaleDateString("id-ID");
  }

  // Date biasa
  if (ts instanceof Date) {
    return ts.toLocaleDateString("id-ID");
  }

  // fallback
  return new Date(ts).toLocaleDateString("id-ID");
}

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(n);

(async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const el = document.getElementById("invoiceContent");

  const snap = await getDoc(doc(db, "invoices", id));
  if (!snap.exists()) {
    el.innerHTML = "Invoice tidak ditemukan";
    return;
  }

  const i = snap.data();
  const ppn = Math.round(i.amount * (i.ppnPercent / 100));
  const total = i.amount + ppn;

  el.innerHTML = `
    <div class="header">
      <div class="company">
        <h1>Rupaloka Studio</h1>
        <div>Architecture - Design & Built</div>
        <div>Office & Workshop : Jl Swadaya, Kec Talang Kelapa, Kab Banyuasin</div>
        <div>Sumatera Selatan</div>
      </div>
      <div class="invoice-info">
  <div class="title">INVOICE</div>
  <table>
    <tr>
      <td>No</td>
      <td>: ${i.invoiceNumber}</td>
    </tr>
    <tr>
      <td>Tanggal</td>
      <td>: ${formatDate(i.invoiceDate)}</td>
    </tr>
    <tr>
      <td>Jatuh Tempo</td>
      <td>: ${formatDate(i.dueDate)}</td>
    </tr>
  </table>
</div>

    </div>

    <strong>Tagihan Kepada:</strong><br>
    ${i.clientName}<br>
    ${i.clientAddress || "-"}

    <table>
      <thead>
        <tr>
          <th>Deskripsi</th>
          <th class="right">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${i.description}</td>
          <td class="right">${rupiah(i.amount)}</td>
        </tr>
      </tbody>
    </table>
    
<div class="notes">
  <div class="box">
    <strong>Catatan :</strong>
    Rekening Pembayaran :<br>
    Bank Mandiri<br>
    1130-0010-88800<br>
    <strong>Y Tekat Heri Susanto ST / Fajrin Elfarisi</strong>
  </div>
</div>

    <div class="summary">
      <table>
        <tr><td>Subtotal</td><td class="right">${rupiah(i.amount)}</td></tr>
        <tr><td>PPN (${i.ppnPercent}%)</td><td class="right">${rupiah(ppn)}</td></tr>
        <tr class="total"><td>Total</td><td class="right">${rupiah(total)}</td></tr>
      </table>
    </div>

    <div style="clear:both"></div>

    <div class="footer">
      Hormat Kami,<br><br><br><br><br>
      <strong>Ar, Y Tekat Heri, S, ST, IAI</strong><br>
      Principle
    </div>
  `;
})();
