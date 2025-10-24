document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.querySelector('.avatar');
  const modal = document.getElementById('avatar-modal');
  const modalImg = document.getElementById('avatar-large');
  const closeBtn = document.getElementById('close-modal');

  if (avatar && modal && modalImg && closeBtn) {
    avatar.addEventListener('click', (ev) => {
      ev.preventDefault();
      modalImg.src = avatar.src;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });

    closeBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });

    // cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

});
