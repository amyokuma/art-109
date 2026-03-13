// ~~~~~~~~~~~~~~ SIDEBAR ~~~~~~~~~~~~~~
document.querySelectorAll('#sidebar-links a').forEach(link => {
  link.addEventListener('click', closeSidebar);
});
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

// ~~~~~~~~~~~~~~ NAVBAR ~~~~~~~~~~~~~~
const navbarTop    = document.getElementById('navbar-top');
const scrollUpBtn  = document.getElementById('scroll-up-btn');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 100;
  navbarTop.classList.toggle('hidden', scrolled);
  hamburgerBtn.classList.toggle('visible', scrolled);
});

// ~~~~~~~~~~~~~~ SCROLL TO TOP BUTON ~~~~~~~~~~~~~~
scrollUpBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0 });
});
// ~~~~~~~~~~~~~~ PROJECT MODAL ~~~~~~~~~~~~~~
const projectData = {
  hopscotch: {
    video: 'assets/hopscotch.mp4',
    subject: 'Self Development',
    title: 'Hopscotch',
    description: 'Hopscotch is a self-development web app designed to help users document and celebrate their personal journey. It features an interactive timeline builder, AI-powered goal suggestions, and a community layer for connecting with like-minded people. Designed and developed end-to-end as a solo project, with a focus on intuitive UX and accessible design.'
  },
  spirit: {
    video: 'assets/spirit.mp4',
    subject: 'Entertainment & Games',
    title: 'Spirit of Phuji',
    description: 'Spirit of Phuji is a website for an indie game set in a pixel-art world inspired by Japanese mythology. The site features a retro-styled UI, animated backgrounds, and serves as the central hub for patch notes, team info, and player sign-ups — designed to mirror the aesthetic of the game itself.'
  },
  sjhacks: {
    video: 'assets/sjhacks.mp4',
    subject: 'Hackathon & Events',
    title: 'SJHacks',
    description: 'SJHacks is the official website for a San Jose hackathon event. The site gives participants everything they need — registration, schedules, sponsor information, and FAQs — wrapped in an energetic, modern design that reflects the spirit of innovation and collaboration at the event.'
  }
};

const projectModal = document.getElementById('project-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const modalVideo   = document.getElementById('modal-video');
const modalSubject = document.getElementById('modal-subject');
const modalTitle   = document.getElementById('modal-title');
const modalDesc    = document.getElementById('modal-description');

function openModal(projectKey) {
  const data = projectData[projectKey];
  if (!data) return;
  modalVideo.src           = data.video;
  modalSubject.textContent = data.subject;
  modalTitle.textContent   = data.title;
  modalDesc.textContent    = data.description;
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('overflow-hidden');
}

function closeModal() {
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  modalVideo.src = '';
  document.body.classList.remove('overflow-hidden');
}

document.querySelectorAll('.project-media').forEach(media => {
  media.addEventListener('click', () => {
    const row = media.closest('.project-row');
    openModal(row.dataset.project);
  });
  media.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const row = media.closest('.project-row');
      openModal(row.dataset.project);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});