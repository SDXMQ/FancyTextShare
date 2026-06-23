/* ============================================================
   FancyTextShare — App Logic
   Modules: CryptoEngine, ParticleSystem, ThemeManager, App
   ============================================================ */

// ---- Font map (index → CSS value) ----
const FONT_MAP = [
  "'Outfit', 'Noto Sans KR', sans-serif",
  "'Playfair Display', serif",
  "'Fira Code', monospace"
];

// ---- Theme Definitions ----
const THEMES = [
  {
    id: 'starryNight', label: '밤하늘',
    bgGradient: ['#070b1a', '#0f1b3d', '#162050'],
    previewGradient: 'linear-gradient(135deg, #070b1a, #0f1b3d, #162050)',
    particles: 'stars',
    defaultText: '밤하늘에 띄우는 나의 마음'
  },
  {
    id: 'dawn', label: '새벽',
    bgGradient: ['#1a0533', '#3d1259', '#c0392b', '#f39c12'],
    previewGradient: 'linear-gradient(to top, #f39c12, #c0392b, #3d1259, #1a0533)',
    particles: 'fireflies',
    defaultText: '새벽하늘을 수놓은 아련한 고백'
  },
  {
    id: 'morning', label: '아침',
    bgGradient: ['#4facfe', '#00f2fe'],
    previewGradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    particles: 'floatingLight',
    defaultText: '싱그러운 아침 햇살 아래 첫인사'
  },
  {
    id: 'sunset', label: '노을',
    bgGradient: ['#fa709a', '#fee140', '#f7797d'],
    previewGradient: 'linear-gradient(to top, #fee140, #fa709a, #f7797d)',
    particles: 'warmDust',
    defaultText: '붉게 물든 저녁 노을빛을 담아'
  },
  {
    id: 'aurora', label: '오로라',
    bgGradient: ['#0f0c29', '#302b63', '#24243e'],
    previewGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    particles: 'aurora',
    defaultText: '춤추는 오로라 아래 그린 기적'
  },
  {
    id: 'deepSea', label: '심해',
    bgGradient: ['#000428', '#004e92'],
    previewGradient: 'linear-gradient(135deg, #000428, #004e92)',
    particles: 'bubbles',
    defaultText: '깊은 심해 속 고요히 흐르는 생각'
  }
];

/* ============================================================
   CryptoEngine — XOR + Base64URL (lightweight, no library)
   ============================================================ */
const CryptoEngine = (() => {
  const KEY = 'FncyTxtShr2026!';

  function xorBytes(data, key) {
    const keyBytes = new TextEncoder().encode(key);
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
  }

  function toBase64Url(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fromBase64Url(str) {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  return {
    encrypt(stateObj) {
      const textEncoder = new TextEncoder();
      const textBytes = textEncoder.encode(stateObj.text || '');
      
      // Create payload: 2 bytes header + text bytes
      const payload = new Uint8Array(2 + textBytes.length);
      
      // Byte 1: theme(3 bits, 0-7) | effect(2 bits, 0-3) | font(2 bits, 0-3) | glow(1 bit, 0-1)
      const effectMap = { 'floatUp': 0, 'fadeGlow': 1, 'typewriter': 2 };
      const effectVal = effectMap[stateObj.effect] !== undefined ? effectMap[stateObj.effect] : 0;
      const glowVal = stateObj.glow ? 1 : 0;
      payload[0] = ((stateObj.theme & 0x07) << 5) | ((effectVal & 0x03) << 3) | ((stateObj.font & 0x03) << 1) | glowVal;
      
      // Byte 2: sizeOffset(6 bits, 0-63, representing size 16-56) | align(2 bits, 0-3)
      const alignMap = { 'left': 0, 'center': 1, 'right': 2 };
      const alignVal = alignMap[stateObj.align] !== undefined ? alignMap[stateObj.align] : 1;
      const sizeOffset = Math.max(0, Math.min(63, (stateObj.size || 28) - 16));
      payload[1] = (sizeOffset << 2) | alignVal;
      
      // Set text bytes
      payload.set(textBytes, 2);
      
      const xored = xorBytes(payload, KEY);
      return toBase64Url(xored);
    },
    decrypt(hash) {
      try {
        const bytes = fromBase64Url(hash);
        const xored = xorBytes(bytes, KEY);
        if (xored.length < 2) return null;
        
        // Parse Byte 1
        const b1 = xored[0];
        const theme = (b1 >> 5) & 0x07;
        const effectCode = (b1 >> 3) & 0x03;
        const font = (b1 >> 1) & 0x03;
        const glow = (b1 & 0x01) === 1;
        
        const effectMap = ['floatUp', 'fadeGlow', 'typewriter'];
        const effect = effectMap[effectCode] || 'floatUp';
        
        // Parse Byte 2
        const b2 = xored[1];
        const sizeOffset = (b2 >> 2) & 0x3F;
        const size = sizeOffset + 16;
        const alignCode = b2 & 0x03;
        
        const alignMap = ['left', 'center', 'right'];
        const align = alignMap[alignCode] || 'center';
        
        // Parse Text
        const textBytes = xored.subarray(2);
        const text = new TextDecoder().decode(textBytes);
        
        return { text, theme, effect, font, size, align, glow };
      } catch (e) {
        console.error('Decryption failed:', e);
        return null;
      }
    }
  };
})();

/* ============================================================
   ParticleSystem — Canvas-based ambient effects
   ============================================================ */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.themeId = null;
    this.bgColors = [];
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = rect.width;
    this.h = rect.height;
  }

  setTheme(themeIndex) {
    const theme = THEMES[themeIndex];
    this.themeId = theme.particles;
    this.bgColors = theme.bgGradient;
    this.particles = [];
    this._generateParticles();
  }

  _generateParticles() {
    const count = this.themeId === 'stars' ? 120 :
                  this.themeId === 'bubbles' ? 35 :
                  this.themeId === 'aurora' ? 60 : 50;

    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle());
    }
  }

  _createParticle() {
    const base = {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2
    };

    switch (this.themeId) {
      case 'stars':
        base.twinkleSpeed = Math.random() * 0.02 + 0.005;
        base.baseAlpha = base.alpha;
        break;
      case 'fireflies':
        base.size = Math.random() * 3 + 1;
        base.speed = Math.random() * 0.4 + 0.15;
        base.wanderAngle = Math.random() * Math.PI * 2;
        base.color = `hsl(${40 + Math.random() * 30}, 100%, ${65 + Math.random() * 20}%)`;
        break;
      case 'floatingLight':
        base.size = Math.random() * 4 + 1;
        base.speed = Math.random() * 0.5 + 0.2;
        base.alpha = Math.random() * 0.4 + 0.1;
        break;
      case 'warmDust':
        base.size = Math.random() * 2.5 + 0.5;
        base.speed = Math.random() * 0.3 + 0.1;
        base.color = `hsla(${20 + Math.random() * 30}, 80%, 75%, ${base.alpha})`;
        break;
      case 'aurora':
        base.size = Math.random() * 3 + 1;
        base.x = Math.random() * this.w;
        base.waveAmp = Math.random() * 40 + 20;
        base.waveFreq = Math.random() * 0.01 + 0.005;
        base.hue = Math.random() * 60 + 100; // green-cyan range
        break;
      case 'bubbles':
        base.size = Math.random() * 6 + 2;
        base.speed = Math.random() * 0.4 + 0.2;
        base.alpha = Math.random() * 0.25 + 0.05;
        base.wobble = Math.random() * 2;
        break;
    }
    return base;
  }

  _drawBackground() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.h);
    const colors = this.bgColors;
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  _updateAndDraw(time) {
    const ctx = this.ctx;
    const t = time * 0.001;

    this.particles.forEach(p => {
      switch (this.themeId) {
        case 'stars':
          p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(t * p.twinkleSpeed * 60 + p.phase));
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'fireflies':
          p.wanderAngle += (Math.random() - 0.5) * 0.15;
          p.x += Math.cos(p.wanderAngle) * p.speed;
          p.y += Math.sin(p.wanderAngle) * p.speed;
          if (p.x < -10) p.x = this.w + 10;
          if (p.x > this.w + 10) p.x = -10;
          if (p.y < -10) p.y = this.h + 10;
          if (p.y > this.h + 10) p.y = -10;
          const glowAlpha = 0.4 + 0.6 * Math.sin(t * 2 + p.phase);
          ctx.save();
          ctx.globalAlpha = glowAlpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 15;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;

        case 'floatingLight':
          p.y -= p.speed;
          p.x += Math.sin(t + p.phase) * 0.3;
          if (p.y < -10) { p.y = this.h + 10; p.x = Math.random() * this.w; }
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'warmDust':
          p.y -= p.speed * 0.5;
          p.x += Math.sin(t * 0.5 + p.phase) * 0.4;
          if (p.y < -10) { p.y = this.h + 10; p.x = Math.random() * this.w; }
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'aurora':
          const wave = Math.sin(p.y * p.waveFreq + t * 0.5) * p.waveAmp;
          const drawX = p.x + wave;
          p.y -= p.speed * 0.3;
          if (p.y < -20) { p.y = this.h + 20; p.x = Math.random() * this.w; }
          const auroraHue = p.hue + Math.sin(t * 0.3 + p.phase) * 30;
          ctx.save();
          ctx.globalAlpha = 0.15 + 0.15 * Math.sin(t + p.phase);
          ctx.shadowColor = `hsl(${auroraHue}, 80%, 60%)`;
          ctx.shadowBlur = 20;
          ctx.fillStyle = `hsl(${auroraHue}, 70%, 55%)`;
          ctx.beginPath();
          ctx.arc(drawX, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;

        case 'bubbles':
          p.y -= p.speed;
          p.x += Math.sin(t * p.wobble + p.phase) * 0.5;
          if (p.y < -p.size * 2) { p.y = this.h + p.size * 2; p.x = Math.random() * this.w; }
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.strokeStyle = 'rgba(150, 200, 255, 0.4)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
          // Highlight
          ctx.fillStyle = 'rgba(200, 230, 255, 0.15)';
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;
      }
    });

    // Occasional shooting star for night sky
    if (this.themeId === 'stars' && Math.random() < 0.002) {
      this._drawShootingStar();
    }
  }

  _drawShootingStar() {
    const ctx = this.ctx;
    const sx = Math.random() * this.w * 0.8;
    const sy = Math.random() * this.h * 0.4;
    const angle = Math.PI / 6 + Math.random() * Math.PI / 6;
    const len = 60 + Math.random() * 40;

    ctx.save();
    const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    grad.addColorStop(0, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    ctx.stroke();
    ctx.restore();
  }

  start() {
    this.resize();
    const loop = (time) => {
      this._drawBackground();
      this._updateAndDraw(time);
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

/* ============================================================
   App — Main Controller
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ---- Detect viewer mode (hash with data) ----
  const hashData = window.location.hash.slice(1);
  if (hashData) {
    const state = CryptoEngine.decrypt(hashData);
    if (state) {
      initViewerMode(state);
      return; // Don't init editor
    }
  }

  initEditorMode();
});

/* ---------- Viewer Mode ---------- */
function initViewerMode(state) {
  document.getElementById('editor-view').classList.add('hidden');
  const viewerView = document.getElementById('viewer-view');
  viewerView.classList.remove('hidden');

  const canvas = document.getElementById('viewer-canvas');
  const textEl = document.getElementById('viewer-text');

  // Apply text
  textEl.textContent = state.text || '';
  textEl.style.fontFamily = FONT_MAP[state.font || 0];
  textEl.style.fontSize = (state.size || 28) + 'px';
  textEl.style.textAlign = state.align || 'center';
  if (state.glow) textEl.classList.add('glow');

  // Apply entrance
  applyEntrance(textEl, state.effect || 'floatUp', state.text || '');

  // Start particles
  const ps = new ParticleSystem(canvas);
  ps.setTheme(state.theme || 0);
  ps.start();
  window.addEventListener('resize', () => { ps.resize(); ps.particles = []; ps._generateParticles(); });
}

/* ---------- Editor Mode ---------- */
function initEditorMode() {
  // DOM
  const textInput = document.getElementById('text-input');
  const charCount = document.getElementById('current-char-count');
  const themeSelector = document.getElementById('theme-selector');
  const fontSelect = document.getElementById('font-family');
  const fontSizeInput = document.getElementById('font-size');
  const fontSizeVal = document.getElementById('font-size-val');
  const alignBtns = document.querySelectorAll('.align-btn');
  const effectBtns = document.querySelectorAll('.effect-btn');
  const glowToggle = document.getElementById('text-glow');
  const previewText = document.getElementById('preview-text');
  const shareBtn = document.getElementById('share-btn');
  const shareResult = document.getElementById('share-result');
  const shareUrlInput = document.getElementById('share-url');
  const copyBtn = document.getElementById('copy-btn');

  const previewCanvas = document.getElementById('preview-canvas');
  const ps = new ParticleSystem(previewCanvas);

  // State
  let activeTheme = 0;
  let activeEffect = 'floatUp';
  let activeAlign = 'center';
  let isUserModified = false;

  // ---- Theme buttons ----
  THEMES.forEach((theme, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `theme-btn ${i === 0 ? 'active' : ''}`;
    btn.style.background = theme.previewGradient;
    btn.dataset.label = theme.label;
    btn.addEventListener('click', () => {
      themeSelector.querySelector('.active')?.classList.remove('active');
      btn.classList.add('active');
      activeTheme = i;
      ps.setTheme(i);

      // If user hasn't edited the text, apply the new theme's default text
      if (!isUserModified) {
        textInput.value = theme.defaultText;
        syncPreview();
        replayEntrance(previewText, activeEffect, textInput.value);
      }
    });
    themeSelector.appendChild(btn);
  });

  // Init preview canvas
  ps.setTheme(0);
  ps.start();
  window.addEventListener('resize', () => { ps.resize(); ps.particles = []; ps._generateParticles(); });

  // ---- Text input live sync ----
  charCount.textContent = textInput.value.length;
  function syncPreview() {
    previewText.textContent = textInput.value || '텍스트를 입력해주세요...';
    charCount.textContent = textInput.value.length;
  }
  textInput.addEventListener('input', () => {
    // If text is cleared, reset modification flag to allow default theme texts again
    if (textInput.value.trim() === '') {
      isUserModified = false;
    } else {
      isUserModified = true;
    }
    syncPreview();
  });

  // ---- Font family ----
  fontSelect.addEventListener('change', () => {
    previewText.style.fontFamily = FONT_MAP[fontSelect.value];
  });

  // ---- Font size ----
  fontSizeInput.addEventListener('input', () => {
    fontSizeVal.textContent = fontSizeInput.value + 'px';
    previewText.style.fontSize = fontSizeInput.value + 'px';
  });

  // ---- Alignment ----
  alignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alignBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAlign = btn.dataset.align;
      previewText.style.textAlign = activeAlign;
    });
  });

  // ---- Effect ----
  effectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      effectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeEffect = btn.dataset.effect;
      // Replay entrance on preview
      replayEntrance(previewText, activeEffect, textInput.value);
    });
  });

  // ---- Glow toggle ----
  glowToggle.addEventListener('change', () => {
    previewText.classList.toggle('glow', glowToggle.checked);
  });
  // init glow
  previewText.classList.toggle('glow', glowToggle.checked);

  // ---- Share link generation ----
  shareBtn.addEventListener('click', () => {
    const state = {
      text: textInput.value,
      theme: activeTheme,
      effect: activeEffect,
      font: parseInt(fontSelect.value),
      size: parseInt(fontSizeInput.value),
      align: activeAlign,
      glow: glowToggle.checked
    };

    const encrypted = CryptoEngine.encrypt(state);
    const base = window.location.origin + window.location.pathname;
    const url = base + '#' + encrypted;

    shareUrlInput.value = url;
    shareResult.classList.remove('hidden');
  });

  // ---- Copy to clipboard ----
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
      const icon = copyBtn.querySelector('i');
      icon.className = 'fa-solid fa-check';
      copyBtn.style.color = '#10b981';
      setTimeout(() => { icon.className = 'fa-solid fa-copy'; copyBtn.style.color = ''; }, 1500);
    });
  });
}

/* ---------- Entrance Effects ---------- */
function applyEntrance(el, effect, text) {
  el.className = 'floating-text viewer-floating-text';
  if (el.classList.contains('glow') === false && el.dataset.glow === 'true') el.classList.add('glow');

  if (effect === 'typewriter') {
    el.textContent = '';
    el.classList.add('entrance-typewriter');
    typewriterAnimate(el, text);
  } else if (effect === 'fadeGlow') {
    el.classList.add('entrance-fadeGlow');
  } else {
    el.classList.add('entrance-floatUp');
  }
}

function replayEntrance(el, effect, text) {
  // Remove all entrance classes and re-apply
  el.classList.remove('entrance-floatUp', 'entrance-fadeGlow', 'entrance-typewriter');
  el.style.animation = 'none';
  el.offsetHeight; // force reflow
  el.style.animation = '';

  if (effect === 'typewriter') {
    el.textContent = '';
    el.classList.add('entrance-typewriter');
    typewriterAnimate(el, text);
  } else if (effect === 'fadeGlow') {
    el.classList.add('entrance-fadeGlow');
  } else {
    el.classList.add('entrance-floatUp');
  }
}

function typewriterAnimate(el, text) {
  let i = 0;
  const interval = setInterval(() => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 60);
}
