/*
  A Small Digital Garden
  ----------------------
  JavaScript is used for only a few clear jobs:
  1. Create a plant when the user clicks
  2. Randomly choose leaf or flower
  3. Add a little variation so each plant feels unique
  4. Let nearby plants gently react to the mouse
*/

const garden = document.getElementById("garden");
const plants = [];
const maxPlants = 55; // Prevent the scene from becoming too crowded

// Soft color palettes for flower petals and centers
const petalPalettes = [
  ["#f8bfd3", "#f3d8e3"],
  ["#f6df8f", "#f9edb9"],
  ["#d9c2f0", "#eddff8"],
  ["#f7c7b4", "#fde1d5"]
];

const centerColors = ["#f2b94b", "#ffd86b", "#e7a95d", "#f3c96d"];

// Utility: random number in a range
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Utility: choose a random item from an array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Create a single leaf element with custom position and angle
function buildLeaf(x, y, angle, scale = 1) {
  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.style.left = `${x}px`;
  leaf.style.top = `${y}px`;
  leaf.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
  return leaf;
}

// Make a leaf cluster using 3 simple leaf shapes
function createLeafPlant() {
  const plant = document.createElement("div");
  plant.className = "plant leaf-plant";

  const baseRotation = randomBetween(-16, 16);
  plant.dataset.baseRotation = String(baseRotation);
  plant.style.setProperty("--base-rotation", `${baseRotation}deg`);

  const leaves = [
    buildLeaf(31, 38, randomBetween(-42, -18), randomBetween(0.95, 1.12)),
    buildLeaf(20, 24, randomBetween(-14, 14), randomBetween(0.9, 1.05)),
    buildLeaf(42, 24, randomBetween(18, 42), randomBetween(0.95, 1.12))
  ];

  leaves.forEach((leaf) => plant.appendChild(leaf));
  return plant;
}

// Make a flower from petals arranged in a ring around a center
function createFlowerPlant() {
  const plant = document.createElement("div");
  plant.className = "plant flower-plant";

  const petalCount = Math.floor(randomBetween(4, 7)); // 4 to 6 petals
  const radius = randomBetween(12, 16);
  const [petalStart, petalEnd] = randomItem(petalPalettes);

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("div");
    const angle = (Math.PI * 2 * i) / petalCount;
    const x = 32 + Math.cos(angle) * radius;
    const y = 32 + Math.sin(angle) * radius;

    petal.className = "flower-petal";
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    petal.style.background = `linear-gradient(180deg, ${petalStart} 0%, ${petalEnd} 100%)`;
    petal.style.transform = `translate(-50%, -50%) scale(${randomBetween(0.9, 1.08)})`;

    plant.appendChild(petal);
  }

  const center = document.createElement("div");
  center.className = "flower-center";
  center.style.background = randomItem(centerColors);
  plant.appendChild(center);

  const baseRotation = randomBetween(-18, 18);
  plant.dataset.baseRotation = String(baseRotation);

  return plant;
}

// Create either a leaf or flower plant and place it at the click position
function addPlant(x, y) {
  const type = Math.random() < 0.5 ? "leaf" : "flower";
  const plant = type === "leaf" ? createLeafPlant() : createFlowerPlant();

  plant.style.left = `${x}px`;
  plant.style.top = `${y}px`;

  // Slight size variation keeps the artwork feeling organic
  const scale = randomBetween(0.85, 1.15);
  const rotation = Number(plant.dataset.baseRotation || 0);
  plant.dataset.baseScale = String(scale);
  plant.dataset.rotation = String(rotation);
  plant.dataset.x = String(x);
  plant.dataset.y = String(y);
  plant.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;

  garden.appendChild(plant);
  plants.push(plant);

  // Remove the oldest plant if the screen gets too full
  if (plants.length > maxPlants) {
    const oldest = plants.shift();
    oldest.remove();
  }
}

// Create plants when the user clicks, but do not place them directly on the title area
garden.addEventListener("click", (event) => {
  const titleZone = window.innerHeight * 0.24;
  if (event.clientY < titleZone) return;
  addPlant(event.clientX, event.clientY);
});

// Plants react gently when the mouse moves nearby
window.addEventListener("mousemove", (event) => {
  plants.forEach((plant) => {
    const plantX = Number(plant.dataset.x);
    const plantY = Number(plant.dataset.y);
    const baseScale = Number(plant.dataset.baseScale || 1);
    const rotation = Number(plant.dataset.rotation || 0);

    const dx = event.clientX - plantX;
    const dy = event.clientY - plantY;
    const distance = Math.hypot(dx, dy);

    if (distance < 110) {
      const strength = (110 - distance) / 110;
      const lift = strength * 4;
      const grow = baseScale + strength * 0.12;
      const tilt = rotation + dx * 0.04;

      plant.classList.add("near");
      plant.style.transform = `translate(-50%, calc(-50% - ${lift}px)) rotate(${tilt}deg) scale(${grow})`;
    } else {
      plant.classList.remove("near");
      plant.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${baseScale})`;
    }
  });
});
