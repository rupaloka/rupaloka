import {
  db,
  collection,
  getDocs,
  query,
  orderBy
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
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function formatDate(ts) {
  if (!ts) return "-";
  const d = ts.toDate();
  return d.toLocaleDateString("id-ID");
}

function formatRupiah(num) {
  return num.toLocaleString("id-ID");
}

loadInvoices();
