const avatar = document.querySelector('.avatar');
const modal = document.getElementById('avatar-modal');
const modalImg = document.getElementById('avatar-large');
const closeBtn = document.getElementById('close-modal');

avatar.addEventListener('click', () => {
  modal.style.display = 'flex';      
  modalImg.src = avatar.src;          
});
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});