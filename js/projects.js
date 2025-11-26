import { db, collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from './firebase.js';

const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

if (user.role === "admin") {
  document.getElementById("formTambahProyek").style.display = "block";
}

function rupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
}

// TOMBOL TAMBAH PROYEK — PAKAI EVENT LISTENER (INI YANG BIKIN KLIK JALAN!)
document.getElementById("btnTambahProyek")?.addEventListener("click", async () => {
  const nama = document.getElementById("namaProyek").value.trim();
  const pemberi = document.getElementById("pemberiKerja").value.trim();
  const nilai = parseInt(document.getElementById("nilaiProyek").value);

  if (!nama || !pemberi || !nilai || nilai <= 0) {
    alert("Isi semua kolom dengan benar!");
    return;
  }

  try {
    await addDoc(collection(db, "projects"), {
      namaProyek: nama,
      pemberiKerja: pemberi,
      nilaiProyek: nilai,
      createdAt: new Date()
    });
    alert("Proyek berhasil ditambahkan!");
    document.getElementById("namaProyek").value = "";
    document.getElementById("pemberiKerja").value = "";
    document.getElementById("nilaiProyek").value = "";
  } catch (err) {
    alert("Gagal: " + err.message);
  }
});

// LOAD PROYEK (stabil, tidak kedip)
const list = document.getElementById("projectList");
const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

onSnapshot(q, (snap) => {
  list.innerHTML = "";
  if (snap.empty) {
    list.innerHTML = "<p style='text-align:center; color:#999; padding:40px;'>Belum ada proyek.</p>";
    return;
  }
  snap.forEach((d) => {
    const p = d.data();
    const item = document.createElement("div");
    item.style = "background:white; padding:20px; margin:15px 0; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); border-left:6px solid #0066cc;";
    item.innerHTML = `
      <strong style="font-size:1.3em;">${p.namaProyek}</strong><br>
      <small style="color:#555;">${p.pemberiKerja} • ${rupiah(p.nilaiProyek)}</small>
      <div style="margin-top:15px;">
        <button onclick="location.href='transactions.html?project=${d.id}'" style="padding:10px 20px; background:#0066cc; color:white; border:none; border-radius:6px;">
          ${user.role === "admin" ? "Transaksi" : "Lihat Transaksi"}
        </button>
        ${user.role === "admin" ? `<button onclick="deleteDoc(doc(db, 'projects', '${d.id}')).then(()=>location.reload())" style="margin-left:10px; padding:10px 20px; background:#d32f2f; color:white; border:none; border-radius:6px;">Hapus</button>` : ""}
      </div>
    `;
    list.appendChild(item);
  });
});

window.logout = () => {
  localStorage.clear();
  location.href = "index.html";
};
