// Tunggu halaman load dulu biar Firebase siap
window.addEventListener('load', function() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) window.location.href = "index.html";

  // Tampilkan form untuk admin
  if (user.role === "admin") {
    document.getElementById("formTambahProyek").style.display = "block";
  }

  loadProyek();
});

// Format rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
}

// Tambah proyek (sekarang pasti jalan setelah Firebase init)
function tambahProyek() {
  const nama = document.getElementById("namaProyek").value.trim();
  const pemberi = document.getElementById("pemberiKerja").value.trim();
  const nilai = parseInt(document.getElementById("nilaiProyek").value) || 0;

  if (!nama || !pemberi || nilai <= 0) {
    alert("Isi semua kolom dengan benar! Nilai harus angka positif.");
    return;
  }

  // Cek apakah db sudah siap
  if (typeof db === 'undefined') {
    alert("Firebase belum siap. Refresh halaman dan coba lagi.");
    return;
  }

  db.collection("projects").add({
    namaProyek: nama,
    pemberiKerja: pemberi,
    nilaiProyek: nilai,
    createdAt: new Date()
  }).then(() => {
    alert("Proyek berhasil ditambahkan! Muncul di bawah.");
    document.getElementById("namaProyek").value = "";
    document.getElementById("pemberiKerja").value = "";
    document.getElementById("nilaiProyek").value = "";
  }).catch(err => {
    console.error("Error:", err);
    alert("Gagal tambah: " + err.message + ". Cek console (F12) untuk detail.");
  });
}

// Load proyek
function loadProyek() {
  const list = document.getElementById("projectList");
  if (typeof db === 'undefined') {
    list.innerHTML = "<p style='text-align:center; color:red;'>Error: Firebase belum siap. Refresh halaman.</p>";
    return;
  }

  db.collection("projects")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p style='text-align:center; color:#999; padding:20px;'>Belum ada proyek. Tambah yang pertama di atas!</p>";
        return;
      }

      snapshot.forEach(doc => {
        const p = doc.data();
        const item = document.createElement("div");
        item.style = "background:white; padding:20px; margin:15px 0; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-left:6px solid #0066cc;";

        const teks = `<strong>${p.namaProyek}</strong><br><small style="color:#555;">${p.pemberiKerja} • ${formatRupiah(p.nilaiProyek)}</small>`;

        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role === "admin") {
          item.innerHTML = teks + `
            <div style="margin-top:15px;">
              <button onclick="window.location.href='transactions.html?project=${doc.id}'" style="padding:10px 20px; background:#0066cc; color:white; border:none; border-radius:6px; margin-right:10px;">Transaksi</button>
              <button onclick="hapusProyek('${doc.id}')" style="padding:10px 20px; background:#d32f2f; color:white; border:none; border-radius:6px;">Hapus</button>
            </div>`;
        } else {
          item.innerHTML = `<div onclick="window.location.href='transactions.html?project=${doc.id}'" style="cursor:pointer; padding:10px; border-radius:8px; background:#f0f8ff;" onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='#f0f8ff'">${teks}</div>`;
        }
        list.appendChild(item);
      });
    }, err => {
      console.error("Error load:", err);
      list.innerHTML = "<p style='text-align:center; color:red;'>Error load proyek: " + err.message + "</p>";
    });
}

function hapusProyek(id) {
  if (confirm("Yakin hapus? Semua transaksi ikut hilang!")) {
    db.collection("projects").doc(id).delete().then(() => {
      alert("Dihapus!");
    });
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
