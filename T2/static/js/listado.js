document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#tabla2 tbody tr").forEach(row => {
    row.addEventListener("click", () => {
      const studentId = row.dataset.studentId;
      window.location.href = `/estudiante/${studentId}`;
    });
  });
});
