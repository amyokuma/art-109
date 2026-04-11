const items = [
  "video you never finished",
  "article you saved",
  "song you skipped",
  "book you paused",
  "thread you ignored",
  "playlist you forgot",
  "course you started",
  "document you never returned to"
];

const desk = document.getElementById("tab-desk");
const template = document.getElementById("tab-template");
const viewer = document.getElementById("viewer");
const viewerText = document.getElementById("viewer-text");
const popup = document.getElementById("popup");
const trail = document.getElementById("cursor-trail");

let z = 1;
let dragging = null;
let offsetX = 0;
let offsetY = 0;

function createTab(text) {
  const node = template.content.cloneNode(true);
  const tab = node.querySelector(".tab");

  tab.querySelector(".title").textContent = text;
  tab.querySelector(".progress").textContent = Math.floor(Math.random()*100)+"%";

  tab.style.left = Math.random()*window.innerWidth + "px";
  tab.style.top = Math.random()*window.innerHeight + "px";
  tab.style.transform = `rotate(${Math.random()*20-10}deg)`;

  tab.addEventListener("pointerdown", e => {
    dragging = tab;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    tab.style.zIndex = ++z;
  });

  tab.addEventListener("click", () => {
    viewer.classList.remove("hidden");
  });

  desk.appendChild(tab);
}

items.forEach(i => createTab(i));

window.addEventListener("pointermove", e => {
  if (dragging) {
    dragging.style.left = e.clientX - offsetX + "px";
    dragging.style.top = e.clientY - offsetY + "px";
  }

  const dot = document.createElement("div");
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";
  trail.appendChild(dot);

  setTimeout(() => dot.remove(), 500);
});

window.addEventListener("pointerup", () => dragging = null);

setInterval(() => {
  document.querySelectorAll(".tab").forEach(tab => {
    if (Math.random() < 0.5) {
      tab.style.left = Math.random()*window.innerWidth + "px";
      tab.style.top = Math.random()*window.innerHeight + "px";
    }
  });

  if (Math.random() < 0.7) {
    createTab(items[Math.floor(Math.random()*items.length)]);
  }
}, 1500);

setInterval(() => {
  if (Math.random() < 0.4) {
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("hidden"), 800);
  }
}, 2000);

setInterval(() => {
  viewerText.textContent = Math.random() > 0.5
    ? "almost finished…"
    : "you never came back";
}, 600);

setInterval(() => {
  document.body.style.transform = `translate(${Math.random()*6-3}px, ${Math.random()*6-3}px)`;
}, 300);
