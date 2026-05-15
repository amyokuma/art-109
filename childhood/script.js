const bubbles = [...document.querySelectorAll('.memory-bubble')];
const floatingBubbles = [...document.querySelectorAll('.floating-bubble')];

const stage = document.getElementById('stage');
const bubbleField = document.getElementById('bubbleField');
const focusView = document.getElementById('focusView');
const focusContent = document.getElementById('focusContent');
const backBtn = document.getElementById('backBtn');
const titleImage = document.getElementById('titleImage');

let isFocused = false;
let bubbleStates = [];
let animationFrameId = null;
const titleFrames = ['assets/core_memories.png', 'assets/core_memories_2.png'];
let titleFrameIndex = 0;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function buildBubbleState(bubble, index) {
    const style = bubble.style;
    const size = Number.parseFloat(style.getPropertyValue('--size')) || bubble.offsetWidth || 240;
    const fieldWidth = bubbleField.clientWidth;
    const fieldHeight = bubbleField.clientHeight;
    const startXPercent = Number.parseFloat(style.getPropertyValue('--x')) || 0;
    const startYPercent = Number.parseFloat(style.getPropertyValue('--y')) || 0;
    const baseRotation = Number.parseFloat(style.getPropertyValue('--rotate')) || 0;
    const maxX = Math.max(fieldWidth - size, 0);
    const maxY = Math.max(fieldHeight - size, 0);
    const x = clamp((startXPercent / 100) * fieldWidth, 0, maxX);
    const y = clamp((startYPercent / 100) * fieldHeight, 0, maxY);

    return {
        bubble,
        size,
        x,
        y,
        vx: randomBetween(-0.055, 0.055) || 0.03,
        vy: randomBetween(-0.045, 0.02) || -0.02,
        driftOffset: randomBetween(0, Math.PI * 2),
        driftSpeed: randomBetween(0.00035, 0.00075),
        driftRadiusX: randomBetween(14, 28),
        driftRadiusY: randomBetween(24, 42),
        baseRotation,
        rotationAmplitude: randomBetween(3, 6),
        rotationSpeed: randomBetween(0.00035, 0.0008),
        lastWidth: fieldWidth,
        lastHeight: fieldHeight,
        index
    };
}

function applyBubblePosition(state, time) {
    const driftX = Math.sin(time * state.driftSpeed + state.driftOffset) * state.driftRadiusX;
    const driftY = Math.cos(time * state.driftSpeed * 0.9 + state.driftOffset) * state.driftRadiusY;
    const rotation = state.baseRotation + Math.sin(time * state.rotationSpeed + state.driftOffset) * state.rotationAmplitude;

    state.bubble.style.left = `${state.x}px`;
    state.bubble.style.top = `${state.y}px`;
    state.bubble.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${rotation}deg)`;
}

function updateBubbleBounds(state) {
    const fieldWidth = bubbleField.clientWidth;
    const fieldHeight = bubbleField.clientHeight;
    const widthScale = state.lastWidth ? fieldWidth / state.lastWidth : 1;
    const heightScale = state.lastHeight ? fieldHeight / state.lastHeight : 1;

    state.x *= widthScale;
    state.y *= heightScale;
    state.x = clamp(state.x, 0, Math.max(fieldWidth - state.size, 0));
    state.y = clamp(state.y, 0, Math.max(fieldHeight - state.size, 0));
    state.lastWidth = fieldWidth;
    state.lastHeight = fieldHeight;
}

function separateBubbles() {
    for (let i = 0; i < bubbleStates.length; i += 1) {
        for (let j = i + 1; j < bubbleStates.length; j += 1) {
            const a = bubbleStates[i];
            const b = bubbleStates[j];
            const ax = a.x + a.size / 2;
            const ay = a.y + a.size / 2;
            const bx = b.x + b.size / 2;
            const by = b.y + b.size / 2;
            const dx = bx - ax;
            const dy = by - ay;
            const distance = Math.hypot(dx, dy) || 1;
            const minDistance = (a.size + b.size) * 0.38;

            if (distance < minDistance) {
                const overlap = (minDistance - distance) / 2;
                const pushX = (dx / distance) * overlap;
                const pushY = (dy / distance) * overlap;

                a.x -= pushX;
                a.y -= pushY;
                b.x += pushX;
                b.y += pushY;

                a.vx -= pushX * 0.003;
                a.vy -= pushY * 0.003;
                b.vx += pushX * 0.003;
                b.vy += pushY * 0.003;
            }
        }
    }
}

function animateBubbles(time) {
    if (!isFocused) {
        const fieldWidth = bubbleField.clientWidth;
        const fieldHeight = bubbleField.clientHeight;

        bubbleStates.forEach(state => {
            const maxX = Math.max(fieldWidth - state.size, 0);
            const maxY = Math.max(fieldHeight - state.size, 0);
            const buoyancy = Math.sin(time * state.driftSpeed + state.driftOffset) * 0.006;

            state.vx += Math.sin(time * state.driftSpeed * 0.45 + state.driftOffset) * 0.0015;
            state.vy += buoyancy - 0.0008;
            state.vx *= 0.992;
            state.vy *= 0.99;
            state.vx = clamp(state.vx, -0.12, 0.12);
            state.vy = clamp(state.vy, -0.1, 0.07);
            state.x += state.vx;
            state.y += state.vy;
        });

        separateBubbles();

        bubbleStates.forEach(state => {
            const maxX = Math.max(fieldWidth - state.size, 0);
            const maxY = Math.max(fieldHeight - state.size, 0);

            if (state.x <= 0 || state.x >= maxX) {
                state.vx *= -0.92;
                state.x = clamp(state.x, 0, maxX);
            }

            if (state.y <= 0 || state.y >= maxY) {
                state.vy *= -0.88;
                state.y = clamp(state.y, 0, maxY);
            }

            applyBubblePosition(state, time);
        });
    }

    animationFrameId = window.requestAnimationFrame(animateBubbles);
}

function setupBubbles() {
    bubbleStates = floatingBubbles.map(buildBubbleState);
    bubbleStates.forEach(state => applyBubblePosition(state, 0));

    if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = window.requestAnimationFrame(animateBubbles);
}

function animateTitle() {
    if (!titleImage) return;

    window.setInterval(() => {
        titleFrameIndex = (titleFrameIndex + 1) % titleFrames.length;
        titleImage.src = titleFrames[titleFrameIndex];
    }, 300);
}

function renderFocusContent(index) {
    focusContent.innerHTML = '';

    const gifMap = {
        '0': 'assets/grocery.gif',
        '1': 'assets/car.gif',
        '2': 'assets/parachute.gif',
        '3': 'assets/toothfairy.gif'
    };

    if (gifMap[index]) {
        const gif = document.createElement('img');
        gif.src = gifMap[index];
        gif.alt = 'Memory animation';
        gif.className = 'focus-gif';
        focusContent.appendChild(gif);
    }
}

function openMemory(index) {
    isFocused = true;

    renderFocusContent(index);
    stage.classList.add('is-focused');
    stage.parentElement.classList.add('is-focused');
    focusView.setAttribute('aria-hidden', 'false');
}

function closeMemory() {
    isFocused = false;

    focusContent.innerHTML = '';
    stage.classList.remove('is-focused');
    stage.parentElement.classList.remove('is-focused');
    focusView.setAttribute('aria-hidden', 'true');
}

bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        openMemory(bubble.dataset.scene);
    });
});

backBtn.addEventListener('click', event => {
    event.stopPropagation();
    closeMemory();
});

window.addEventListener('keydown', event => {
    if (event.code === 'Escape' && isFocused) {
        closeMemory();
    }
});

window.addEventListener('resize', () => {
    bubbleStates.forEach(updateBubbleBounds);
});

setupBubbles();
animateTitle();
