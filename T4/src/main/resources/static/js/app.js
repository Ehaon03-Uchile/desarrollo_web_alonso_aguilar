let avisosGlobal = [];
let avisoSeleccionado = null;

const tbody = document.querySelector('#tabla-avisos tbody');
const modal = document.getElementById('modal-eval');
const selectNota = document.getElementById('select-nota');
const sendBtn = document.getElementById('send-btn');
const cancelBtn = document.getElementById('cancel-btn');
const modalSub = document.getElementById('modal-sub');

if (!tbody) console.error('No se encontró #tabla-avisos tbody. Verifica index.html');
if (!modal) console.error('No se encontró #modal-eval. Verifica index.html');

async function fetchAvisos() {
  try {
    const res = await fetch('/api/avisos');
    if (!res.ok) throw new Error('Respuesta no OK: ' + res.status);
    const data = await res.json();
    avisosGlobal = Array.isArray(data) ? data : [];
    renderTabla(avisosGlobal);
  } catch (err) {
    console.error('fetchAvisos error:', err);
    alert('No se pudieron cargar los avisos. Revisa la consola.');
  }
}

function renderTabla(avisos) {
  if (!tbody) return;
  tbody.innerHTML = '';
  avisos.forEach(a => {
    const tr = document.createElement('tr');
    const fecha = a.fechaPublicacion ? new Date(a.fechaPublicacion).toLocaleString() : '';
    const promedio = (a.promedioNota == null) ? '-' : Number(a.promedioNota).toFixed(2);
    const contador = a.contadorNotas || 0;

    const sector = a.sector ? escapeHtml(a.sector) : '';
    const tipo = a.tipo ? escapeHtml(a.tipo) : '';
    const comuna = a.comuna ? escapeHtml(a.comuna) : '';
    const unidad = a.unidadMedida === 'a' ? 'años' : (a.unidadMedida === 'm' ? 'meses' : '');

    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${fecha}</td>
      <td>${sector}</td>
      <td class="center">${a.cantidad ?? ''}</td>
      <td>${tipo}</td>
      <td>${a.edad ?? ''} ${unidad}</td>
      <td>${comuna}</td>
      <td id="nota-${a.id}">${promedio} / ${contador}</td>
      <td><button class="eval" data-id="${a.id}">Evaluar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

if (tbody) {
  tbody.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button.eval');
    if (!btn) return;
    const rawId = btn.getAttribute('data-id');
    if (rawId === null || rawId === undefined || rawId === '') {
      console.warn('Botón eval sin data-id:', btn, 'evento:', ev);
      alert('Error interno: aviso sin identificador.');
      return;
    }
    const parsedId = Number(rawId);
    if (Number.isNaN(parsedId)) {
      console.warn('data-id no es numérico:', rawId);
      abrirModalEval(rawId);
    } else {
      abrirModalEval(parsedId);
    }
  });
}

/** Abre modal para evaluar */
function abrirModalEval(avisoId) {
  avisoSeleccionado = avisoId;
  // limpia selección previa
  if (selectNota) selectNota.value = '';
  const aviso = avisosGlobal.find(x => String(x.id) === String(avisoId));
  // Seguridad: si no encontramos el aviso, mostramos el id recibido (si existe)
  if (aviso) {
    modalSub.textContent = `Aviso ID ${aviso.id} — ${aviso.tipo || ''} (${aviso.comuna || ''})`;
  } else {
    modalSub.textContent = `Aviso ID ${avisoId !== undefined ? avisoId : '??'}`;
    console.warn('abrirModalEval: aviso no encontrado en avisosGlobal para id=', avisoId);
  }
  // mostrar modal
  if (modal) modal.style.display = 'flex';
  // focus
  if (selectNota) selectNota.focus();
}

/** Cerrar modal */
function cerrarModal() {
  avisoSeleccionado = null;
  if (modal) modal.style.display = 'none';
}

/** Cancel */
if (cancelBtn) cancelBtn.addEventListener('click', () => cerrarModal());
window.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});

/** Enviar nota */
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    if (!avisoSeleccionado) {
      alert('No hay aviso seleccionado. Intenta de nuevo.');
      return;
    }
    const notaVal = selectNota ? selectNota.value : null;
    if (!/^[1-7]$/.test(String(notaVal))) {
      alert('Selecciona una nota válida (1–7).');
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Enviando...';

    try {
      const url = `/api/avisos/${avisoSeleccionado}/nota`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota: Number(notaVal) })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Error al POST:', res.status, text);
        alert('Error al enviar la nota: ' + (text || res.status));
        return;
      }

      const result = await res.json();
      const td = document.getElementById(`nota-${avisoSeleccionado}`);
      if (td) {
        const prom = result.promedio != null ? Number(result.promedio).toFixed(2) : '-';
        const cnt = result.contador || 0;
        td.textContent = `${prom} / ${cnt}`;
      }

      const idx = avisosGlobal.findIndex(x => String(x.id) === String(avisoSeleccionado));
      if (idx >= 0) {
        avisosGlobal[idx].promedioNota = result.promedio;
        avisosGlobal[idx].contadorNotas = result.contador;
      }

      cerrarModal();
    } catch (err) {
      console.error('sendBtn handler error:', err);
      alert('Error de red al enviar la nota. Revisa la consola.');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Enviar';
    }
  });
}

fetchAvisos();
