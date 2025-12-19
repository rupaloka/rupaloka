import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "./firebase.js";

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
  const clientName = document.getElementById("clientName").value.trim();
  const clientAddress = document.getElementById("clientAddress").value.trim();
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
    clientName,
    clientAddress,
    description,
    amount,
    ppnPercent,
    createdAt: new Date()
  });

  window.location.href = `invoice-print.html?id=${docRef.id}`;
});
