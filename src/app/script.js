const sliderTrack = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const slideWidth = slides[0].offsetWidth;
let isMoving = false;

function moveLeft() {
  if (isMoving) return;
  isMoving = true;

  const lastSlide = sliderTrack.lastElementChild;
  sliderTrack.style.transition = 'none';
  sliderTrack.insertBefore(lastSlide, sliderTrack.firstElementChild);

  sliderTrack.style.transform = `translateX(-${slideWidth}px)`;
  setTimeout(() => {
    sliderTrack.style.transition = 'transform 0.5s ease';
    sliderTrack.style.transform = `translateX(0)`;
    setTimeout(() => (isMoving = false), 500);
  }, 50);
}

function moveRight() {
  if (isMoving) return;
  isMoving = true;

  const firstSlide = sliderTrack.firstElementChild;
  sliderTrack.style.transition = 'transform 0.5s ease';
  sliderTrack.style.transform = `translateX(-${slideWidth}px)`;

  setTimeout(() => {
    sliderTrack.style.transition = 'none';
    sliderTrack.appendChild(firstSlide);
    sliderTrack.style.transform = `translateX(0)`;
    isMoving = false;
  }, 500);
}

let autoplayInterval = setInterval(moveRight, 3000);

const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', () => {
  clearInterval(autoplayInterval);
});

sliderContainer.addEventListener('mouseleave', () => {
  autoplayInterval = setInterval(moveRight, 3000);
});

function login(){
  window.location.href = "../../pages/login.html"
}