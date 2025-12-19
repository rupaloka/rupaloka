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
// ===== LOAD & AUTOFILL CLIENTS (STEP 2 + 3) =====
const params = new URLSearchParams(window.location.search);
const invoiceId = params.get("id"); // null = create, ada = edit

const clientSelect = document.getElementById("clientSelect");
const clientAddress = document.getElementById("clientAddress");
const clientPic = document.getElementById("clientPic");
const clientPhone = document.getElementById("clientPhone");

const clientCache = {};

(async () => {
  if (!clientSelect) return;

  const snap = await getDocs(collection(db, "clients"));

  snap.forEach(doc => {
    const data = doc.data();
    clientCache[doc.id] = data;

    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = data.name;
    clientSelect.appendChild(opt);
  });
})();

clientSelect.addEventListener("change", () => {
  const c = clientCache[clientSelect.value];
  if (!c) return;

  clientAddress.value = c.address || "";
  if (clientPic) clientPic.value = c.pic || "";
  if (clientPhone) clientPhone.value = c.phone || "";
});
(async () => {
  if (!invoiceId) return;

  const snap = await getDoc(doc(db, "invoices", invoiceId));
  if (!snap.exists()) return;

  const d = snap.data();

  document.getElementById("invoiceDate").value =
    d.invoiceDate.toDate().toISOString().split("T")[0];

  document.getElementById("dueDate").value =
    d.dueDate.toDate().toISOString().split("T")[0];

  clientAddress.value = d.clientAddress || "";
  if (clientPic) clientPic.value = d.clientPic || "";
  if (clientPhone) clientPhone.value = d.clientPhone || "";

  document.getElementById("description").value = d.description || "";
  document.getElementById("amount").value = d.amount || "";
  document.getElementById("ppn").value = d.ppnPercent || 0;

  // label halaman
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
  invoiceNumber: invoiceId ? undefined : invoiceNumber,
  invoiceDate: new Date(invoiceDate),
  dueDate: new Date(dueDate),

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
