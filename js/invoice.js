import { db, collection, addDoc, getDocs } from "./firebase.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") location.href = "index.html";

const projectSelect = document.getElementById("projectSelect");

// LOAD PROJECT KE DROPDOWN
const projectSnap = await getDocs(collection(db, "projects"));
projectSnap.forEach(doc => {
  const p = doc.data();
  const opt = document.createElement("option");
  opt.value = doc.id;
  opt.textContent = p.namaProyek;
  projectSelect.appendChild(opt);
});

// SIMPAN INVOICE
document.getElementById("saveInvoice").addEventListener("click", async () => {
  const projectId = projectSelect.value;
  const client = document.getElementById("clientName").value.trim();
  const desc = document.getElementById("description").value.trim();
  const amount = parseInt(document.getElementById("amount").value);

  if (!projectId || !client || !desc || !amount) {
    alert("Lengkapi semua data invoice!");
    return;
  }

  await addDoc(collection(db, "invoices"), {
    projectId,
    clientName: client,
    description: desc,
    amount,
    status: "UNPAID",
    createdAt: new Date(),
    createdBy: user.username
  });

  alert("Invoice berhasil disimpan");
  location.href = "projects.html";
});
