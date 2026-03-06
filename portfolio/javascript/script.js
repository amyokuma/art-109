document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════ */
const hamburgerBtn  = document.getElementById('hamburger-btn');
const hamburgerIcon = document.getElementById('hamburger-icon');
const sidebar       = document.getElementById('sidebar');
const overlay       = document.getElementById('overlay');

let sidebarOpen = false;

function openSidebar() {
  sidebarOpen = true;
  sidebar.classList.add('open');
  sidebar.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
  hamburgerIcon.className = 'fa-solid fa-times';
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('overflow-hidden');
}

function closeSidebar() {
  sidebarOpen = false;
  sidebar.classList.remove('open');
  sidebar.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');
  hamburgerIcon.className = 'fa-solid fa-bars';
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');
}

hamburgerBtn.addEventListener('click', () => {
  sidebarOpen ? closeSidebar() : openSidebar();
});

overlay.addEventListener('click', closeSidebar);

/* ═══════════════════════════════════════════════════════════
   NAVBAR — hide on scroll, show hamburger
═══════════════════════════════════════════════════════════ */
const navbarTop    = document.getElementById('navbar-top');
const scrollUpBtn  = document.getElementById('scroll-up-btn');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 100;
  navbarTop.classList.toggle('hidden', scrolled);
  hamburgerBtn.classList.toggle('visible', scrolled);
});

/* ═══════════════════════════════════════════════════════════
   SCROLL TO TOP BUTTON
═══════════════════════════════════════════════════════════ */
scrollUpBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0 });
});