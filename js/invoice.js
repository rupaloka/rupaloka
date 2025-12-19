import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "./firebase.js";
// ===== LOAD & AUTOFILL CLIENTS (STEP 2 + 3) =====
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

  
const docRef = await addDoc(collection(db, "invoices"), {
  invoiceNumber,
  invoiceDate: new Date(invoiceDate),
  dueDate: new Date(dueDate),

  // === SNAPSHOT DATA KLIEN ===
  clientName,
  clientAddress,
  clientPic: clientPicVal,
  clientPhone: clientPhoneVal,

  // === DATA INVOICE ===
  description,
  amount,
  ppnPercent,
  createdAt: new Date()
});
alert("Invoice berhasil disimpan");
  window.location.href = `invoice-print.html?id=${docRef.id}`;
});
