(function () {
  const chartButtons = document.querySelectorAll(".chart-btn");
  const daysInput = document.getElementById("optDays");
  const yearInput = document.getElementById("optYear");
  const optDaysLabel = document.getElementById("optDaysLabel");
  const optYearLabel = document.getElementById("optYearLabel");
  const reloadBtn = document.getElementById("reloadBtn");
  const container = document.getElementById("chartContainer");

  // Estado actual
  let currentType = "daily";

  function showControlsFor(kind) {
    if (kind === "daily") {
      optDaysLabel.style.display = "flex";
      optYearLabel.style.display = "none";
    } else if (kind === "monthly") {
      optDaysLabel.style.display = "none";
      optYearLabel.style.display = "flex";
    } else {
      optDaysLabel.style.display = "none";
      optYearLabel.style.display = "none";
    }
  }

  function fetchJson(url, opts = {}) {
    const ac = new AbortController();
    const id = setTimeout(() => ac.abort(), 10000);
    opts.signal = ac.signal;
    opts.headers = Object.assign({}, opts.headers || {}, { Accept: "application/json" });
    return fetch(url, opts)
      .then(r => {
        clearTimeout(id);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
  }

  // Renders 
  function renderDaily(obj, days) {
    const entries = Object.entries(obj); 
    const categories = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);
    Highcharts.chart(container, {
      chart: { type: "line" },
      title: { text: `Inscripciones diarias (últimos ${days} días)` },
      xAxis: { categories },
      yAxis: { title: { text: "Cantidad" } },
      series: [{ name: "Estudiantes", data: values, color: "#8a0303" }],
      credits: { enabled: false }
    });
  }

  function renderByType(obj) {
    const data = [
      { name: "Cinturones color", y: obj.color || 0, color: "#8a0303" },
      { name: "Cinturones negros", y: obj.negro || 0, color: "#000000" },
      { name: "Tigers", y: obj.tiger || 0, color: "#575757" }
    ];
    Highcharts.chart(container, {
      chart: { type: "pie" },
      title: { text: "Distribución por tipo de cinturón" },
      series: [{ name: "Total", data }],
      credits: { enabled: false }
    });
  }

  function renderMonthly(obj, year) {
    const months = Object.keys(obj);
    const colorSeries = months.map(m => obj[m].color || 0);
    const blackSeries = months.map(m => obj[m].negro || 0);
    const tigerSeries = months.map(m => obj[m].tiger || 0);

    Highcharts.chart(container, {
      chart: { type: "column" },
      title: { text: `Comparación mensual ${year}` },
      xAxis: { categories: months },
      yAxis: { title: { text: "Cantidad" } },
      series: [
        { name: "Color", data: colorSeries, color: "#8a0303" },
        { name: "Negro", data: blackSeries, color: "#000000" },
        { name: "Tiger", data: tigerSeries, color: "#575757" }
      ],
      credits: { enabled: false }
    });
  }

  // Datos
  function loadAndRender() {
    const kind = currentType;

    if (kind === "daily") {
      const days = Number(daysInput.value) || 30;
      fetchJson(`/api/estadisticas/daily?days=${days}`)
        .then(j => renderDaily(j.data, days))
        .catch(err => {
          container.innerHTML = `<div style="padding:20px;color:#900;">Error cargando datos: ${err.message}</div>`;
        });

    } else if (kind === "by_type") {
      fetchJson(`/api/estadisticas/by_type`)
        .then(j => renderByType(j.data))
        .catch(err => {
          container.innerHTML = `<div style="padding:20px;color:#900;">Error cargando datos: ${err.message}</div>`;
        });

    } else if (kind === "monthly") {
      const year = Number(yearInput.value) || (new Date()).getFullYear();
      fetchJson(`/api/estadisticas/monthly?year=${year}`)
        .then(j => renderMonthly(j.data, year))
        .catch(err => {
          container.innerHTML = `<div style="padding:20px;color:#900;">Error cargando datos: ${err.message}</div>`;
        });
    }
  }

  // Botones
  chartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;

      chartButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentType = btn.dataset.chart;
      showControlsFor(currentType);
      loadAndRender();
    });
  });

  // Botón recarga
  reloadBtn.addEventListener("click", () => loadAndRender());

  document.addEventListener("DOMContentLoaded", () => {
    showControlsFor(currentType);
    loadAndRender();
  });

  window.updateChartType = function (type) {
    currentType = type;
    showControlsFor(type);
    loadAndRender();
  };
})();
