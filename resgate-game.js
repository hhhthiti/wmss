const arena = document.getElementById('arena');
const heroEl = document.getElementById('hero');
const phaseTitle = document.getElementById('phaseTitle');
const livesEl = document.getElementById('lives');
const goalEl = document.getElementById('goal');
const messageEl = document.getElementById('message');

const PHASES = [
  { target: 'Princesa', enemies: 2 },
  { target: 'Rei', enemies: 3 },
  { target: 'Camponesa + Criança', enemies: 4 },
  { target: 'Rainha', enemies: 5 },
  { target: 'Vilarejo', enemies: 6 }
];

const state = {
  phase: 0,
  lives: 3,
  hero: { x: 16, y: 16 },
  npc: null,
  enemies: [],
  enemyEls: []
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function place(el, x, y) {
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
}

function makeEnemy() {
  const el = document.createElement('div');
  el.className = 'enemy';
  arena.appendChild(el);
  return {
    el,
    x: Math.random() * 280 + 20,
    y: Math.random() * 280 + 20,
    vx: Math.random() > 0.5 ? 2 : -2,
    vy: Math.random() > 0.5 ? 2 : -2
  };
}

function resetPhase() {
  state.enemyEls.forEach((el) => el.remove());
  state.enemyEls = [];
  state.enemies = [];

  const phase = PHASES[state.phase];
  phaseTitle.textContent = String(state.phase + 1);
  goalEl.textContent = phase.target;
  livesEl.textContent = String(state.lives);
  state.hero = { x: 16, y: 16 };

  document.querySelector('.npc')?.remove();
  const npcEl = document.createElement('div');
  npcEl.className = 'npc';
  arena.appendChild(npcEl);
  state.npc = {
    el: npcEl,
    x: Math.random() * 260 + 40,
    y: Math.random() * 260 + 40
  };

  for (let i = 0; i < phase.enemies; i += 1) {
    const enemy = makeEnemy();
    state.enemies.push(enemy);
    state.enemyEls.push(enemy.el);
  }

  messageEl.textContent = `Resgate: ${phase.target}`;
  render();
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function moveHero(dx, dy) {
  const max = arena.clientWidth - 24;
  state.hero.x = clamp(state.hero.x + dx, 0, max);
  state.hero.y = clamp(state.hero.y + dy, 0, max);
  render();
  checkCollisions();
}

function checkCollisions() {
  if (distance(state.hero, state.npc) < 20) {
    messageEl.textContent = `Você salvou ${PHASES[state.phase].target}!`;
    return;
  }

  const hit = state.enemies.some((enemy) => distance(state.hero, enemy) < 18);
  if (hit) {
    state.lives -= 1;
    livesEl.textContent = String(state.lives);
    if (state.lives <= 0) {
      messageEl.textContent = 'Game over! Reinicie para tentar novamente.';
      state.lives = 0;
      return;
    }
    state.hero = { x: 16, y: 16 };
    messageEl.textContent = 'Você foi atingido! Volte ao início da fase.';
    render();
  }
}

function animateEnemies() {
  const max = arena.clientWidth - 24;
  state.enemies.forEach((enemy) => {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    if (enemy.x <= 0 || enemy.x >= max) enemy.vx *= -1;
    if (enemy.y <= 0 || enemy.y >= max) enemy.vy *= -1;
  });
  render();
  checkCollisions();
  requestAnimationFrame(animateEnemies);
}

function render() {
  place(heroEl, state.hero.x, state.hero.y);
  place(state.npc.el, state.npc.x, state.npc.y);
  state.enemies.forEach((enemy) => place(enemy.el, enemy.x, enemy.y));
}

function nextPhase() {
  if (state.phase === PHASES.length - 1) {
    messageEl.textContent = 'Parabéns! Você concluiu todas as fases desta demo.';
    return;
  }
  state.phase += 1;
  resetPhase();
}

document.querySelectorAll('[data-dir]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (state.lives <= 0) return;
    const dir = btn.dataset.dir;
    if (dir === 'left') moveHero(-18, 0);
    if (dir === 'right') moveHero(18, 0);
    if (dir === 'up') moveHero(0, -18);
    if (dir === 'down') moveHero(0, 18);
  });
});

document.getElementById('nextPhaseBtn').addEventListener('click', nextPhase);
document.getElementById('restartBtn').addEventListener('click', () => {
  state.phase = 0;
  state.lives = 3;
  resetPhase();
});

window.addEventListener('keydown', (event) => {
  if (state.lives <= 0) return;
  if (event.key === 'ArrowLeft') moveHero(-16, 0);
  if (event.key === 'ArrowRight') moveHero(16, 0);
  if (event.key === 'ArrowUp') moveHero(0, -16);
  if (event.key === 'ArrowDown') moveHero(0, 16);
});

resetPhase();
requestAnimationFrame(animateEnemies);
