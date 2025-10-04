document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("darkModeToggle");
    const body = document.body;

    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        body.classList.add("dark-mode");
        button.textContent = "🌚";
    } else {
        body.classList.remove("dark-mode");
        button.textContent = "🌞";
    }

    button.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            button.textContent = "🌚";
            localStorage.setItem("theme", "dark");
        } else {
            button.textContent = "🌞";
            localStorage.setItem("theme", "light");
        }
    });
});
