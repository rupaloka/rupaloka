import { db, doc, getDoc } from "./firebase.js";

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
        <div>Design & Built</div>
        <div>Office & Workshop : Jl Swadaya, Kec Talang Kelapa, Kab Banyuasin</div>
        <div>Sumatera Selatan</div>
      </div>
      <div>
        <strong>INVOICE</strong><br>
        No: ${i.invoiceNumber}<br>
        Tanggal: ${i.invoiceDate.toDate().toLocaleDateString("id-ID")}<br>
        Jatuh Tempo: ${i.dueDate.toDate().toLocaleDateString("id-ID")}
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

    <div class="summary">
      <table>
        <tr><td>Subtotal</td><td class="right">${rupiah(i.amount)}</td></tr>
        <tr><td>PPN (${i.ppnPercent}%)</td><td class="right">${rupiah(ppn)}</td></tr>
        <tr class="total"><td>Total</td><td class="right">${rupiah(total)}</td></tr>
      </table>
    </div>

    <div style="clear:both"></div>

    <div class="footer">
      Hormat Kami,<br><br><br>
      <strong>Ar, Y Tekat Heri, S, ST, IAI</strong><br>
      Principle
    </div>
  `;
})();
