let particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "-2");
  canvas.style("pointer-events", "none");

  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  fill(10, 15, 30, 30);
  rect(0, 0, width, height);

  for (let p of particles) {
    fill(p.r, p.g, p.b, p.life);
    ellipse(p.x, p.y, p.size);

    p.x += p.vx;
    p.y += p.vy;
    p.life -= 3;
  }

  particles = particles.filter(p => p.life > 0);
}

function mouseMoved() {
  particles.push({
    x: mouseX,
    y: mouseY,
    vx: random(-1, 1),
    vy: random(-1, 1),
    size: random(8, 14),
    life: 255,
    r: random(200, 255),
    g: random(200, 255),
    b: random(200, 255)
  });
}