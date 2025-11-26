// Cek login
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

// Tampilkan form hanya untuk admin
if (user.role === "admin") {
  document.getElementById("adminForm").style.display = "block";
}

// Format rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
}

// Tambah proyek
function tambahProyek() {
  const nama = document.getElementById("namaProyek").value.trim();
  const pemberi = document.getElementById("pemberiKerja").value.trim();
  const nilai = parseInt(document.getElementById("nilaiProyek").value);

  if (!nama || !pemberi || !nilai) {
    alert("Semua kolom harus diisi!");
    return;
  }

  db.collection("projects").add({
    namaProyek: nama,
    pemberiKerja: pemberi,
    nilaiProyek: nilai,
    createdAt: new Date()
  }).then(() => {
    alert("Proyek berhasil ditambah!");
    document.getElementById("namaProyek").value = "";
    document.getElementById("pemberiKerja").value = "";
    document.getElementById("nilaiProyek").value = "";
  });
}

// Load daftar proyek
function loadProyek() {
  const list = document.getElementById("projectList");

  db.collection("projects")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p style='text-align:center; color:#999; font-size:1.1em;'>Belum ada proyek.<br>Admin bisa menambahkan proyek baru di atas.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const p = doc.data();
        const item = document.createElement("div");
        item.style = "background:white; padding:20px; margin:15px 0; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-left:6px solid #0066cc; font-size:1.1em;";

        const teks = `<strong>${p.namaProyek}</strong><br>${p.pemberiKerja} • ${formatRupiah(p.nilaiProyek)}`;

        if (user.role === "admin") {
          item.innerHTML = `
            ${teks}
            <div style="margin-top:15px;">
              <button onclick="location.href='transactions.html?project=${doc.id}'" style="padding:8px 16px; background:#0066cc; color:white; border:none; border-radius:6px; margin-right:8px;">Transaksi</button>
              <button onclick="hapusProyek('${doc.id}')" style="padding:8px 16px; background:#d32f2f; color:white; border:none; border-radius:6px;">Hapus</button>
            </div>
          `;
        } else {
          item.innerHTML = `<div onclick="location.href='transactions.html?project=${doc.id}'" style="cursor:pointer; color:#0066cc;">${teks}</div>`;
        }

        list.appendChild(item);
      });
    });
}

// Hapus proyek
function hapusProyek(id) {
  if (confirm("Yakin hapus proyek ini? Semua data transaksi juga akan hilang!")) {
    db.collection("projects").doc(id).delete();
    db.collection("transactions").where("projectId", "==", id).get().then(snap => {
      snap.forEach(d => d.ref.delete());
    });
  }
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// MULAI LOAD PROYEK SEKARANG!
loadProyek();
