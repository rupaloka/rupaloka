const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('project');
const user = JSON.parse(localStorage.getItem("user"));

if (!projectId || !user) window.location.href = "index.html";

let projectName = "";

db.collection("projects").doc(projectId).get().then(doc => {
  if (doc.exists) {
    projectName = doc.data().name;
    document.getElementById("projectName").textContent = projectName;
  }
});

// Tampilkan tombol cetak hanya untuk admin & fajrin
if (user.username === "admin" || user.username === "fajrin") {
  document.getElementById("printBtn").style.display = "block";
}

document.getElementById("date").valueAsDate = new Date();

function addTransaction() {
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const desc = document.getElementById("desc").value.trim();
  const amount = parseInt(document.getElementById("amount").value);

  if (!desc || !amount) return alert("Lengkapi data!");

  db.collection("transactions").add({
    projectId,
    type,
    date,
    description: desc,
    amount,
    createdBy: user.username,
    createdAt: new Date(),
    editedBy: null,
    editedAt: null
  }).then(() => {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
  });
}

function loadHistory() {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";

  db.collection("transactions")
    .where("projectId", "==", projectId)
    .orderBy("date", "desc")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      historyDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const t = doc.data();
        const div = document.createElement("div");
        div.className = "transaction-item";
        div.style.cursor = "pointer";
        div.style.padding = "10px";
        div.style.borderBottom = "1px solid #ddd";

        const dateStr = new Date(t.date).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'2-digit'});
        const createdStr = t.createdAt ? new Date(t.createdAt.toDate()).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'2-digit'}) : '';
        const editedStr = t.editedAt ? new Date(t.editedAt.toDate()).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'2-digit'}) : '';

        let text = `${t.type} ${dateStr} ${t.description}, Rp ${t.amount.toLocaleString('id-ID')},-`;
        text += ` (dibuat oleh ${t.createdBy} ${createdStr}`;
        if (t.editedBy) text += `, diedit oleh ${t.editedBy} ${editedStr}`;
        text += ")";

        div.innerHTML = text;
        div.onclick = () => editTransaction(doc.id, t);
        historyDiv.appendChild(div);
      });
    });
}

function editTransaction(id, data) {
  if (!confirm("Edit transaksi ini?")) return;

  const desc = prompt("Keterangan:", data.description);
  const amount = prompt("Jumlah:", data.amount);
  if (desc && amount) {
    db.collection("transactions").doc(id).update({
      description: desc,
      amount: parseInt(amount),
      editedBy: user.username,
      editedAt: new Date()
    });
  }
}

function printReport() {
  window.open(`report.html?project=${projectId}`, '_blank');
}

loadHistory();
