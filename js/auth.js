const users = {
  "admin": "ramenuno20",
  "fajrin": "arsi89",
  "david": "sipil38"
};

function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (users[username] && users[username] === password) {
    localStorage.setItem("user", JSON.stringify({
      username: username,
      role: username === "admin" ? "admin" : "user"
    }));
    window.location.href = "projects.html";
  } else {
    document.getElementById("error").textContent = "Username atau password salah!";
  }
}

// Enter key login
document.addEventListener("keypress", e => {
  if (e.key === "Enter") login();
});
