const bubbles = [...document.querySelectorAll('.memory-bubble')];
const scenes = [...document.querySelectorAll('.memory-scene')];

const stage = document.getElementById('stage');
const focusView = document.getElementById('focusView');
const backBtn = document.getElementById('backBtn');
const progressFill = document.querySelector('.focus-progress span');

let sceneIndex = 0;
let frameIndex = 0;
const framesPerScene = 7;
let isFocused = false;

function openMemory(index) {
    sceneIndex = Number(index);
    frameIndex = 0;
    isFocused = true;

    scenes.forEach((scene, i) => {
        scene.classList.toggle('active', i === sceneIndex);
        scene.setAttribute('aria-hidden', i === sceneIndex ? 'false' : 'true');
    });

    stage.classList.add('is-focused');
    focusView.setAttribute('aria-hidden', 'false');

    drawFrame();
}

function closeMemory() {
    isFocused = false;
    frameIndex = 0;

    stage.classList.remove('is-focused');
    focusView.setAttribute('aria-hidden', 'true');

    scenes.forEach(scene => {
        scene.classList.remove('active');
        scene.setAttribute('aria-hidden', 'true');
    });

    progressFill.style.width = '0%';
}

function drawFrame() {
    progressFill.style.width = `${((frameIndex + 1) / framesPerScene) * 100}%`;
}

function nextFrame() {
    if (!isFocused) return;

    frameIndex += 1;

    if (frameIndex >= framesPerScene) {
        frameIndex = 0;
    }

    drawFrame();
}

bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        openMemory(bubble.dataset.scene);
    });
});

focusView.addEventListener('click', event => {
    if (event.target.closest('button')) return;
    nextFrame();
});

backBtn.addEventListener('click', event => {
    event.stopPropagation();
    closeMemory();
});

window.addEventListener('keydown', event => {
    if (event.code === 'Space' && isFocused) {
        event.preventDefault();
        nextFrame();
    }

    if (event.code === 'Escape' && isFocused) {
        closeMemory();
    }
});