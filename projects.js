const db = firebase.firestore();

function addProject() {
  const name = document.getElementById("newProject").value.trim();
  if (!name) return alert("Nama proyek kosong!");
  db.collection("projects").add({ name })
    .then(() => {
      document.getElementById("newProject").value = "";
      loadProjects();
    });
}

function loadProjects() {
  const list = document.getElementById("projectList");
  list.innerHTML = "<h3>Pilih Proyek:</h3>";
  db.collection("projects").orderBy("name").onSnapshot(snapshot => {
    list.innerHTML = "<h3>Daftar Proyek:</h3>";
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="transactions.html?project=${doc.id}">${doc.data().name}</a>`;
      if (user.role === "admin") {
        li.innerHTML += ` <button onclick="editProject('${doc.id}', '${doc.data().name}')">Edit</button>
                          <button onclick="deleteProject('${doc.id}')">Hapus</button>`;
      }
      list.appendChild(li);
    });
  });
}

function editProject(id, currentName) {
  const newName = prompt("Edit nama proyek:", currentName);
  if (newName && newName !== currentName) {
    db.collection("projects").doc(id).update({ name: newName });
  }
}

function deleteProject(id) {
  if (confirm("Hapus proyek ini?")) {
    db.collection("projects").doc(id).delete();
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

loadProjects();