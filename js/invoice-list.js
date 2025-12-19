import { db, collection, query, orderBy, onSnapshot } from "./firebase.js";

const tbody = document.getElementById("invoiceTable");

const rupiah = n =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(n);

const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));

onSnapshot(q, (snap) => {
  tbody.innerHTML = "";
  snap.forEach(doc => {
    const i = doc.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i.projectName || "-"}</td>
      <td>${i.clientName}</td>
      <td>${i.description}</td>
      <td>${rupiah(i.amount)}</td>
      <td>
       <button class="print" onclick="printInvoice('${doc.id}')">Cetak</button>

      </td>
    `;

    tbody.appendChild(tr);
  });
});
// HARUS DI LUAR onSnapshot
window.printInvoice = (id) => {
  window.open(`invoice-print.html?id=${id}`, "_blank");
};
