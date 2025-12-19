import {
  db,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "./firebase.js";


const tableBody = document.getElementById("invoiceTable");

async function loadInvoices() {
  tableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  const q = query(
    collection(db, "invoices"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>Belum ada invoice</td></tr>";
    return;
  }

  tableBody.innerHTML = "";

  snap.forEach(doc => {
    const d = doc.data();

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${d.invoiceNumber}</td>
      <td>${formatDate(d.invoiceDate)}</td>
      <td>${d.clientName}</td>
      <td>Rp ${formatRupiah(d.amount)}</td>
      <td>
  <button class="btn-print"
    onclick="window.location.href='invoice-print.html?id=${doc.id}'">
    Cetak
  </button>

  <button class="btn-edit"
    onclick="editInvoice('${doc.id}')">
    Edit
  </button>

  <button class="btn-delete"
    onclick="deleteInvoice('${doc.id}')">
    Hapus
  </button>
</td>

    `;

    tableBody.appendChild(tr);
  });
}

function formatDate(ts) {
  if (!ts) return "-";

  // Jika Firestore Timestamp
  if (typeof ts.toDate === "function") {
    return ts.toDate().toLocaleDateString("id-ID");
  }

  // Jika sudah Date biasa
  if (ts instanceof Date) {
    return ts.toLocaleDateString("id-ID");
  }

  // Fallback (string / number)
  return new Date(ts).toLocaleDateString("id-ID");
}

function formatRupiah(num) {
  return num.toLocaleString("id-ID");
}

loadInvoices();
window.editInvoice = (id) => {
  window.location.href = `invoice.html?id=${id}`;
};
window.deleteInvoice = async (id) => {
  if (!confirm("Yakin hapus invoice ini?")) return;

  await deleteDoc(doc(db, "invoices", id));
  alert("Invoice berhasil dihapus");

  loadInvoices(); // reload tabel
};


