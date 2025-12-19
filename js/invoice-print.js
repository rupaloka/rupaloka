import { db, doc, getDoc } from "./firebase.js";


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "Invoice tidak ditemukan";
  throw new Error("No invoice ID");
}

const ref = doc(db, "invoices", id);
const snap = await getDoc(ref);

if (!snap.exists()) {
  document.body.innerHTML = "Invoice tidak ditemukan";
  throw new Error("Invoice not found");
}

const i = snap.data();

document.getElementById("invoiceContent").innerHTML = `
  <h1>INVOICE</h1>
  <small>${new Date(i.createdAt.seconds * 1000).toLocaleDateString("id-ID")}</small>

  <hr>

  <table>
    <tr>
      <td><strong>Proyek</strong></td>
      <td>${i.projectName}</td>
    </tr>
    <tr>
      <td><strong>Klien</strong></td>
      <td>${i.clientName}</td>
    </tr>
    <tr>
      <td><strong>Deskripsi</strong></td>
      <td>${i.description}</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td class="right"><strong>Rp ${i.amount.toLocaleString("id-ID")}</strong></td>
    </tr>
  </table>
`;
