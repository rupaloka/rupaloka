const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

if (user.role === "admin") {
  document.getElementById("admin-form").style.display = "block";
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

function formatTanggal(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' });
}

function tambahProyek() {
  const nama = document.getElementById("namaProyek").value.trim();
  const pemberi = document.getElementById("pemberiKerja").value.trim();
  const nilai = parseInt(document.getElementById("nilaiProyek").value);
  const mulai = document.getElementById("mulaiProyek").value;
  const selesai = document.getElementById("selesaiProyek").value;

  if (!nama || !pemberi || !nilai || !mulai || !selesai) {
    return alert("Semua field wajib diisi!");
  }

  db.collection("projects").add({
    namaProyek: nama,
    pemberiKerja: pemberi,
    nilaiProyek: nilai,
    mulaiProyek: mulai,
    selesaiProyek: selesai,
    createdAt: new Date()
  }).then(() => {
    alert("Proyek berhasil ditambah!");
    document.querySelectorAll("#admin-form input").forEach(i => i.value = "");
  });
}

function loadProyek() {
  const list = document.getElementById("projectList");
  list.innerHTML = "<p>Loading proyek...</p>";

  db.collection("projects")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";
      if (snapshot.empty) {
        list.innerHTML = "<p>Belum ada proyek.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const p = doc.data();
        const tanggal = `${formatTanggal(p.mulaiProyek)} s/d ${formatTanggal(p.selesaiProyek)}`;
        const teks = `${p.namaProyek} | ${p.pemberiKerja} | ${formatRupiah(p.nilaiProyek)} | ${tanggal}`;

        const div = document.createElement("div");
        div.style = "background:#f8f9fa; padding:15px; margin:10px 0; border-radius:8px; border-left:5px solid #0066cc;";

        if (user.role === "admin") {
 aneh → ini admin
        if (user.role === "admin") {
          div.innerHTML = `
            <strong>${teks}</strong><br><br>
            <button onclick="window.location.href='transactions.html?project=${doc.id}'">Transaksi</button>
            <button onclick="editProyek('${doc.id}', ${JSON.stringify(p).split('"').join("&quot;")})">Edit</button>
            <button onclick="hapusProyek('${doc.id}')" style="background:red;">Hapus</button>
          `;
        } else {
          div.innerHTML = `<strong style="font-size:1.1em; cursor:pointer; color:#0066cc;" 
                           onclick="window.location.href='transactions.html?project=${doc.id}'">
                           ${teks}
                           </strong>`;
        }
        list.appendChild(div);
      });
    });
}

function editProyek(id, data) {
  const nama = prompt("Nama Proyek:", data.namaProyek);
  const pemberi = prompt("Pemberi Kerja:", data.pemberiKerja);
  const nilai = prompt("Nilai Proyek:", data.nilaiProyek);
  const mulai = prompt("Mulai (YYYY-MM-DD):", data.mulaiProyek);
  const selesai = prompt("Selesai (YYYY-MM-DD):", data.selesaiProyek);

  if (nama && pemberi && nilai && mulai && selesai) {
    db.collection("projects").doc(id).update({
      namaProyek: nama,
      pemberiKerja: pemberi,
      nilaiProyek: parseInt(nilai),
      mulaiProyek: mulai,
      selesaiProyek: selesai
    });
  }
}

function hapusProyek(id) {
  if (confirm("Hapus proyek ini dan semua transaksi terkait?")) {
    db.collection("projects").doc(id).delete();
    db.collection("transactions").where("projectId", "==", id).get().then(snap => {
      snap.forEach(d => d.ref.delete());
    });
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

loadProyek();
