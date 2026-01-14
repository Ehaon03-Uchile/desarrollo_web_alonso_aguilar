(function () {
  function q(sel) { return document.querySelector(sel); }

  const section = q("#comments-section");
  if (!section) return;

  const studentId = section.getAttribute("data-student-id");
  if (!studentId) {
    console.warn("No student id");
    return;
  }

  const listEl = q("#observaciones-list");
  const loadingEl = q("#comments-loading");
  const form = q("#commentForm");
  const nameInput = q("#nombreComentario");
  const textInput = q("#textoComentario");
  const errorsBox = q("#comment-errors");

  q("#toggle-comments-btn").addEventListener("click", () => {
    const panel = q("#comments-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  q("#open-add-comment").addEventListener("click", () => {
    q("#add-comment-overlay").style.display = "flex";
  });

  [q("#close-add-overlay"), q("#cancel-add-comment")].forEach(btn => {
    btn?.addEventListener("click", () => {
      q("#add-comment-overlay").style.display = "none";
    });
  });

  function fetchJson(url, opts = {}, timeout = 10000) {
    const ac = new AbortController();
    const id = setTimeout(() => ac.abort(), timeout);
    opts.signal = ac.signal;
    opts.headers = Object.assign({}, opts.headers || {}, { "Accept": "application/json" });
    return fetch(url, opts)
      .then(r => {
        clearTimeout(id);
        if (!r.ok) return r.json().then(j => Promise.reject({status: r.status, body: j}));
        return r.json();
      });
  }

  function renderComment(comment) {
    const wrapper = document.createElement("div");
    wrapper.className = "observacion";
    wrapper.style.marginBottom = "10px";
    wrapper.style.padding = "10px";
    wrapper.style.borderRadius = "6px";
    wrapper.style.backgroundColor = document.body.classList.contains('dark-mode') ? "#222" : "#f8f8f8";
    
    const hdr = document.createElement("div");
    hdr.style.display = "flex";
    hdr.style.justifyContent = "space-between";
    hdr.style.alignItems = "center";

    const nameEl = document.createElement("strong");
    nameEl.textContent = comment.nombre;

    const dateEl = document.createElement("small");
    dateEl.style.color = "#666";
    dateEl.textContent = comment.created_at || "";

    hdr.appendChild(nameEl);
    hdr.appendChild(dateEl);

    const p = document.createElement("p");
    p.style.marginTop = "8px";
    p.style.whiteSpace = "pre-wrap";
    p.textContent = comment.texto || "";

    wrapper.appendChild(hdr);
    wrapper.appendChild(p);
    return wrapper;
  }

  function loadComments() {
    if (loadingEl) loadingEl.style.display = "";
    if (listEl) listEl.innerHTML = "";
    fetchJson(`/api/comments/${studentId}`)
      .then(j => {
        if (loadingEl) loadingEl.style.display = "none";
        const comments = j.comments || [];
        if (!comments.length) {
          listEl.innerHTML = "<p style='font-style:italic;color:#666;'>No hay observaciones todavía.</p>";
          return;
        }
        comments.forEach(c => {
          const el = renderComment(c);
          listEl.appendChild(el);
        });
      })
      .catch(err => {
        if (loadingEl) loadingEl.style.display = "none";
        console.error(err);
        listEl.innerHTML = `<div style="padding:12px;color:#900;">Error cargando comentarios.</div>`;
      });
  }

  function validateClientName(v) {
    if (typeof window.validateText === "function") {
      return window.validateText(v) && v.trim().length >= 3 && v.trim().length <= 80;
    }
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,80}$/.test(v.trim());
  }

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      errorsBox.style.display = "none";
      errorsBox.innerHTML = "";

      const nombre = nameInput.value.trim();
      const texto = textInput.value.trim();
      const clientErrors = [];

      if (!validateClientName(nombre)) clientErrors.push("Nombre inválido (3-80 caracteres, letras y espacios).");
      if (!texto || texto.length < 5) clientErrors.push("Comentario inválido (mínimo 5 caracteres).");

      if (clientErrors.length) {
        errorsBox.style.display = "";
        errorsBox.innerHTML = "<strong>Errores:</strong><ul>" + clientErrors.map(e => `<li>${e}</li>`).join("") + "</ul>";
        return;
      }

      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
      }

      fetchJson(`/api/comments/${studentId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nombre: nombre, texto: texto })
      }).then(j => {
        if (!j.ok) {
          const errs = j.errors || ["Error desconocido"];
          errorsBox.style.display = "";
          errorsBox.innerHTML = "<strong>Errores:</strong><ul>" + errs.map(e => `<li>${e}</li>`).join("") + "</ul>";
          return;
        }
        const newComment = j.comment;
        const el = renderComment(newComment);
        if (listEl.firstChild) listEl.insertBefore(el, listEl.firstChild);
        else listEl.appendChild(el);

        nameInput.value = "";
        textInput.value = "";
        errorsBox.style.display = "none";
        errorsBox.innerHTML = "";

        q("#add-comment-overlay").style.display = "none";
      }).catch(err => {
        console.error(err);
        errorsBox.style.display = "";
        errorsBox.innerHTML = `<strong>Error:</strong> No se pudo enviar el comentario.`;
      }).finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }
      });
    });
  }

  loadComments();
})();