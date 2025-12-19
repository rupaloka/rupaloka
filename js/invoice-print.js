import { db, doc, getDoc } from "./firebase.js";

(async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const el = document.getElementById("invoiceContent");

  if (!id) {
    el.innerHTML = "Invoice tidak ditemukan";
    return;
  }

  const snap = await getDoc(doc(db, "invoices", id));
  if (!snap.exists()) {
    el.innerHTML = "Invoice tidak ditemukan";
    return;
  }

  const i = snap.data();

  const rupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(n || 0);

  const tanggal = i.createdAt?.seconds
    ? new Date(i.createdAt.seconds * 1000).toLocaleDateString("id-ID")
    : "-";

  const subtotal = i.amount || 0;
  const ppn = Math.round(subtotal * 0.1);
  const total = subtotal + ppn;

  el.innerHTML = `
    <div class="header">
      <div class="company">
        <h1>${i.companyName || "Nama Perusahaan Anda"}</h1>
        <div>${i.companyAddress || "-"}</div>
        <div>Telp: ${i.companyPhone || "-"}</div>
        <div>Email: ${i.companyEmail || "-"}</div>
      </div>

      <div class="invoice-meta">
        <h2>Invoice</h2>
        <div>No: ${i.invoiceNumber || "-"}</div>
        <div>Tanggal: ${tanggal}</div>
      </div>
    </div>

    <div class="section two-col">
      <div class="box">
        <h4>Tagihan Kepada</h4>
        <div>${i.clientName}</div>
        <div>${i.clientAddress || "-"}</div>
        <div>Telp: ${i.clientPhone || "-"}</div>
        <div>Email: ${i.clientEmail || "-"}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Produk</th>
          <th>Deskripsi</th>
          <th class="right">Qty</th>
          <th class="right">Harga</th>
          <th class="right">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${i.productName || "-"}</td>
          <td>${i.description || "-"}</td>
          <td class="right">1</td>
          <td class="right">${rupiah(subtotal)}</td>
          <td class="right">${rupiah(subtotal)}</td>
        </tr>
      </tbody>
    </table>

    <div class="summary">
      <table>
        <tr>
          <td>Subtotal</td>
          <td class="right">${rupiah(subtotal)}</td>
        </tr>
        <tr>
          <td>PPN 10%</td>
          <td class="right">${rupiah(ppn)}</td>
        </tr>
        <tr class="total">
          <td>Total</td>
          <td class="right">${rupiah(total)}</td>
        </tr>
      </table>
    </div>

    <div style="clear:both"></div>

    <div class="footer">
      <div>Hormat Kami,</div>
      <strong>${i.companyName || "Nama Perusahaan Anda"}</strong>
    </div>
  `;
})();
