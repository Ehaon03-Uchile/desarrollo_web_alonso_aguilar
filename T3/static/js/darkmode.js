(function () {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = getCookie("theme");
    const body = document.body;
    const html = document.documentElement;
    const button = document.getElementById("darkModeToggle");

    applyTheme(savedTheme || (prefersDark ? "dark" : "light"), false);

    if (button) {
        button.addEventListener("click", async () => {
            const current = body.classList.contains("dark-mode") ? "dark" : "light";
            const newTheme = current === "dark" ? "light" : "dark";
            await transitionTheme(newTheme);
        });
    }

    // Transición asíncrona 
    async function transitionTheme(theme) {
        html.classList.add("theme-transition");
        body.classList.add("theme-transition");

        // Espera 1 frame (~16ms) antes de cambiar (permite aplicar la transición)
        await new Promise(r => requestAnimationFrame(r));

        applyTheme(theme, true);

        // Espera el fin de la animación (0.4s en CSS)
        await new Promise(r => setTimeout(r, 400));

        html.classList.remove("theme-transition");
        body.classList.remove("theme-transition");
    }

    function applyTheme(theme, notifyServer = true) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            html.classList.add("dark-mode");
            html.style.backgroundColor = "#121212";
            body.style.backgroundColor = "#121212";
            if (button) button.textContent = "🌚";
        } else {
            body.classList.remove("dark-mode");
            html.classList.remove("dark-mode");
            html.style.backgroundColor = "#f5f5f5";
            body.style.backgroundColor = "#f5f5f5";
            if (button) button.textContent = "🌞";
        }

        // Guardar cookie
        setCookie("theme", theme, 365);

        if (notifyServer) {
            fetch(`/set_theme/${theme}`).catch(err => console.warn("No se pudo guardar tema:", err));
        }
    }

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }
})();
