if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const dob = document.getElementById("dob").value;
    const error = document.getElementById("error");

    if (!name || !dob) {
      error.textContent = "Please enter your name and date of birth.";
      return;
    }

    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    if (age <= 10) {
      error.textContent = "You must be older than 10.";
      return;
    }

    const user = { name, dob };
    localStorage.setItem("taskflow-user", JSON.stringify(user));

    // ✅ Redirect to app page
    window.location.href = "app.html";
  });
}
