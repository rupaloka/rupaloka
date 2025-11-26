const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

// Hanya admin yang bisa tambah proyek
if (user.role === "admin") {
  document.getElementById("formTambahProyek").style.display = "block";
}

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
}

function tambahProyek() {
  const nama = document.getElementById("namaProyek").value.trim();
  const pemberi = document.getElementById("pemberiKerja").value.trim();
  const nilai = parseInt(document.getElementById("nilaiProyek").value) || 0;

  if (!nama || !pemberi || nilai <= 0) {
    alert("Semua kolom harus diisi dengan benar!");
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
  }).catch(err => {
    console.error(err);
    alert("Gagal tambah proyek. Cek console (F12)");
  });
}

function loadProyek() {
  const list = document.getElementById("projectList");

  db.collection("projects")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p style='text-align:center; color:#999; padding:20px;'>Belum ada proyek. Admin bisa tambah di atas.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const p = doc.data();
        const item = document.createElement("div");
        item.style = "background:white; padding:20px; margin:15px 0; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-left:6px solid #0066cc; font-size:1.1em;";

        const teks = `<strong style="font-size:1.3em;">${p.namaProyek}</strong><br>
                      <small style="color:#555;">${p.pemberiKerja} • ${formatRupiah(p.nilaiProyek)}</small>`;

        if (user.role === "admin") {
          item.innerHTML = teks + `
            <div style="margin-top:15px;">
              <button onclick="window.location.href='transactions.html?project=${doc.id}'" style="padding:10px 20px; background:#0066cc; color:white; border:none; border-radius:6px;">Transaksi</button>
              <button onclick="if(confirm('Hapus proyek ini?')) hapusProyek('${doc.id}')" style="padding:10px 20px; background:#d32f2f; color:white; border:none; border-radius:6px; margin-left:10px;">Hapus</button>
            </div>`;
        } else {
          item.innerHTML = `<div onclick="window.location.href='transactions.html?project=${doc.id}'" style="cursor:pointer; padding:10px; border-radius:8px; background:#f0f8ff;" onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='#f0f8ff'">${teks}</div>`;
        }
        list.appendChild(item);
      });
    });
}

function hapusProyek(id) {
  db.collection("projects").doc(id).delete();
  db.collection("transactions").where("projectId", "==", id).get().then(snap => {
    snap.forEach(d => d.ref.delete());
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// JALANKAN SEKARANG — INI YANG PALING PENTING!
loadProyek();
