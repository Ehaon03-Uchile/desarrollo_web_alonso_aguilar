// Función para presevar los cambios con el render_template, requerí ayuda de chatgpt e internet para desarrollarla ;)
(async function restoreForm() {
  const state = window.__FORM_STATE;
  if (!state) return;

  function qs(selector) { return document.querySelector(selector); }
  function qsa(selector) { return Array.from(document.querySelectorAll(selector)); }
  function dispatchChange(el) { if (!el) return; el.dispatchEvent(new Event('change', { bubbles: true })); }

  function waitForOptions(selectElem, minOptions = 2, timeout = 2000) {
    return new Promise(resolve => {
      if (!selectElem) return resolve(false);
      if (selectElem.options.length >= minOptions) return resolve(true);
      const start = Date.now();
      const iv = setInterval(() => {
        if (selectElem.options.length >= minOptions) { clearInterval(iv); resolve(true); }
        else if (Date.now() - start > timeout) { clearInterval(iv); resolve(false); }
      }, 50);
    });
  }

  try {
    const rolValue = state.nameA ? "si" : "no";
    const rolRadio = qs(`input[name="rol"][value="${rolValue}"]`);
    if (rolRadio) { rolRadio.checked = true; dispatchChange(rolRadio); }
  } catch (e) {}

  try {
    if (state.claseCinturon) {
      const claseRadio = qs(`input[name="claseCinturon"][value="${state.claseCinturon}"]`);
      if (claseRadio) { 
        claseRadio.checked = true; 
        dispatchChange(claseRadio);
      }
    }
  } catch (e) {}

  try {
    const pr = qs('#programaRegular');
    if (pr && state.programaRegular) pr.value = state.programaRegular;

    const pe = qs('#programaEspecial');
    if (pe && state.programaEspecial) pe.value = state.programaEspecial;
  } catch (e) {}

  try {
    const cint = qs('#cinturon');
    if (cint && state.cinturon) {
      const ok = await waitForOptions(cint, 2, 2500);
      if (ok) {
        const exists = Array.from(cint.options).some(o => o.value === state.cinturon);
        if (exists) cint.value = state.cinturon;
      }
    }
  } catch (e) {}

  try {
    const mid = qs('#midterm');
    if (mid && state.midterm) {
      const ok = await waitForOptions(mid, 2, 2500);
      if (ok) {
        const exists = Array.from(mid.options).some(o => o.value === state.midterm);
        if (exists) mid.value = state.midterm;
      }
    }
  } catch (e) {}

})();
