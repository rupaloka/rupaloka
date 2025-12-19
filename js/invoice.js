import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,      // ⬅️ TAMBAH
  updateDoc,   // ⬅️ TAMBAH
  doc,         // ⬅️ TAMBAH
  query,
  where,
  orderBy
} from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const invoiceId = params.get("id");

console.log("INVOICE ID:", invoiceId); // sementara untuk cek
const clientCache = {};
// ===== LOAD & AUTOFILL CLIENTS (STEP 2 + 3) =====
(async () => {
  if (!clientSelect) return;
 
  // 1. LOAD CLIENTS
  const clientSnap = await getDocs(collection(db, "clients"));
  clientSnap.forEach(docSnap => {
    const data = docSnap.data();
    clientCache[docSnap.id] = data;

    const opt = document.createElement("option");
    opt.value = docSnap.id;
    opt.textContent = data.name;
    clientSelect.appendChild(opt);
  });
// AUTOFILL DATA KLIEN SAAT DIPILIH
clientSelect.addEventListener("change", () => {
  const c = clientCache[clientSelect.value];
  if (!c) return;

  clientAddress.value = c.address || "";
  if (clientPic) clientPic.value = c.pic || "";
  if (clientPhone) clientPhone.value = c.phone || "";
});

  // 2. JIKA MODE EDIT → LOAD INVOICE SETELAH CLIENT SIAP
  if (!invoiceId) return;

  const invoiceSnap = await getDoc(doc(db, "invoices", invoiceId));
  if (!invoiceSnap.exists()) return;

  const d = invoiceSnap.data();
  
// === LOAD DATA KLIEN INVOICE LAMA (TANPA MAKSA SELECT) ===
clientAddress.value = d.clientAddress || "";
if (clientPic) clientPic.value = d.clientPic || "";
if (clientPhone) clientPhone.value = d.clientPhone || "";

// tampilkan nama klien lama sebagai option readonly
clientSelect.innerHTML = `<option value="" selected>${d.clientName}</option>` + clientSelect.innerHTML;


  document.getElementById("invoiceDate").value =
    d.invoiceDate.toDate().toISOString().split("T")[0];

  document.getElementById("dueDate").value =
    d.dueDate.toDate().toISOString().split("T")[0];

  document.getElementById("description").value = d.description || "";
  document.getElementById("amount").value = d.amount || "";
  document.getElementById("ppn").value = d.ppnPercent || 0;

  // snapshot data klien (AMAN, TANPA clientId)
  clientAddress.value = d.clientAddress || "";
  if (clientPic) clientPic.value = d.clientPic || "";
  if (clientPhone) clientPhone.value = d.clientPhone || "";

  document.querySelector("h1").textContent = "Edit Invoice";
})();


const pad = (n) => n.toString().padStart(2, "0");

async function generateInvoiceNumber(dateStr) {
  const d = new Date(dateStr);
  const yy = d.getFullYear().toString().slice(-2);
  const mm = pad(d.getMonth() + 1);

  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

  const q = query(
    collection(db, "invoices"),
    where("invoiceDate", ">=", start),
    where("invoiceDate", "<=", end),
    orderBy("invoiceDate", "asc")
  );

  const snap = await getDocs(q);
  const seq = pad(snap.size + 1);

  return `${yy}${mm}${seq}`;
}

document.getElementById("saveInvoice").addEventListener("click", async () => {
  const invoiceDate = document.getElementById("invoiceDate").value;
  const dueDate = document.getElementById("dueDate").value;
  const clientName =
  clientSelect.options[clientSelect.selectedIndex]?.text || "";
const clientId = clientSelect.value;

const clientPicVal = clientPic ? clientPic.value.trim() : "";
const clientPhoneVal = clientPhone ? clientPhone.value.trim() : "";

 const clientAddressVal = clientAddress.value.trim();

  const description = document.getElementById("description").value.trim();
  const amount = parseInt(document.getElementById("amount").value);
  const ppnPercent = parseInt(document.getElementById("ppn").value) || 0;

  if (!invoiceDate || !dueDate || !clientName || !amount) {
    alert("Lengkapi data invoice");
    return;
  }

  const invoiceNumber = await generateInvoiceNumber(invoiceDate);

  
const data = {
  invoiceDate: new Date(invoiceDate),
  dueDate: new Date(dueDate),

  clientId: clientSelect.value || d?.clientId || null,
  clientName,
  clientAddress: clientAddressVal,
  clientPic: clientPicVal,
  clientPhone: clientPhoneVal,

  description,
  amount,
  ppnPercent,
  updatedAt: new Date()
};

if (invoiceId) {
  await updateDoc(doc(db, "invoices", invoiceId), data);
  alert("Invoice berhasil diperbarui");
} else {
  data.createdAt = new Date();
  data.invoiceNumber = await generateInvoiceNumber(invoiceDate);

  await addDoc(collection(db, "invoices"), data);
  alert("Invoice berhasil disimpan");
}

window.location.href = "invoice-list.html";
});
