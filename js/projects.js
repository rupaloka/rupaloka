// CEK USER & TAMPILKAN FORM UNTUK ADMIN
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

if (user.role === "admin") {
  document.getElementById("formTambahProyek").style.display = "block";
}

// FORMAT RUPIAH
function rupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
}

// TAMBAH PROYEK
function tambahProyek() {
  const nama = document.getElementById("namaProyek").value.trim();
  const pemberi = document.getElementById("pemberiKerja").value.trim();
  const nilai = parseInt(document.getElementById("nilaiProyek").value);

  if (!nama || !pemberi || !nilai || nilai <= 0) {
    alert("Isi semua kolom dengan benar!");
    return;
  }

  db.collection("projects").add({
    namaProyek: nama,
    pemberiKerja: pemberi,
    nilaiProyek: nilai,
    createdAt: new Date()
  }).then(() => {
    alert("Proyek berhasil ditambahkan!");
    document.getElementById("namaProyek").value = "";
    document.getElementById("pemberiKerja").value = "";
    document.getElementById("nilaiProyek").value = "";
  });
}

// LOAD SEMUA PROYEK
function loadProyek() {
  const list = document.getElementById("projectList");

  db.collection("projects")
    .orderBy("createdAt", "desc")
    .onSnapshot(snap => {
      list.innerHTML = "";
      if (snap.empty) {
        list.innerHTML = "<p style='text-align:center; color:#999; padding:40px;'>Belum ada proyek.</p>";
        return;
      }

      snap.forEach(doc => {
        const p = doc.data();
        const item = document.createElement("div");
        item.style = "background:white; padding:20px; margin:15px 0; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); border-left:6px solid #0066cc;";
        item.innerHTML = `
          <strong style="font-size:1.3em;">${p.namaProyek}</strong><br>
          <small style="color:#555;">${p.pemberiKerja} • ${rupiah(p.nilaiProyek)}</small>
          <div style="margin-top:15px;">
            <button onclick="location.href='transactions.html?project=${doc.id}'" style="padding:10px 20px; background:#0066cc; color:white; border:none; border-radius:6px;">
              ${user.role === "admin" ? "Transaksi" : "Lihat Transaksi"}
            </button>
            ${user.role === "admin" ? `<button onclick="if(confirm('Hapus proyek ini?')) db.collection('projects').doc('${doc.id}').delete()" style="margin-left:10px; padding:10px 20px; background:#d32f2f; color:white; border:none; border-radius:6px;">Hapus</button>` : ""}
          </div>
        `;
        list.appendChild(item);
      });
    });
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// JALANKAN SEKARANG
loadProyek();
