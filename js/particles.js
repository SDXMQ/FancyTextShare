/* ============================================================
   6. WebGLParticles
   ============================================================ */
window.FTS = window.FTS || {};
class WebGLParticles {
  constructor(container) {
    this.container = container;
    this.mode = 'none';
    this.animId = null;
    this.lastTime = 0;
    this.nextRocket = 0;
    this.w = 0; this.h = 0;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'effect-canvas';
    container.appendChild(this.canvas);

    this.isFallback = false;
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false });
      this.MAX = 1200;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.autoClear = true;

      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);

      const posArr = new Float32Array(this.MAX * 3);
      const colArr = new Float32Array(this.MAX * 3);
      const sizeArr = new Float32Array(this.MAX);
      const alphaArr = new Float32Array(this.MAX);

      this.geo = new THREE.BufferGeometry();
      this.geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      this.geo.setAttribute('aColor', new THREE.BufferAttribute(colArr, 3));
      this.geo.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1));
      this.geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphaArr, 1));
      this.geo.setDrawRange(0, 0);

      this.mat = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
          varying float vAlpha; varying vec3 vColor;
          uniform float uPixelRatio;
          void main() { vAlpha = aAlpha; vColor = aColor; gl_PointSize = aSize * uPixelRatio; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          precision mediump float; varying float vAlpha; varying vec3 vColor; uniform int uMode;
          void main() {
            vec2 c = gl_PointCoord - 0.5; float d = length(c); float shape;
            if (uMode == 0) { shape = exp(-d * d * 10.0); }
            else { shape = max(exp(-d * d * 25.0), max(exp(-abs(c.y) * 35.0) * exp(-abs(c.x) * 8.0), exp(-abs(c.x) * 35.0) * exp(-abs(c.y) * 8.0)) * 0.5); }
            if (shape < 0.01) discard; gl_FragColor = vec4(vColor, shape * vAlpha);
          }
        `,
        uniforms: { 
          uMode: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) }
        },
        transparent: true, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false
      });

      this.points = new THREE.Points(this.geo, this.mat);
      this.scene.add(this.points);
    } catch (e) {
      console.warn('WebGL particles fallback to 2D:', e);
      this.isFallback = true;
      this.MAX = 300;
      this.ctx = this.canvas.getContext('2d');
    }

    this.pool = Array(this.MAX).fill(null).map(() => ({ active: false }));
  }

  setMode(mode) {
    this.mode = mode;
    this.pool.forEach(p => p.active = false);
    this.nextRocket = 0;
    if (!this.isFallback) this.mat.uniforms.uMode.value = mode === 'sparkle' ? 1 : 0;
    if (mode === 'none') {
      if (this.isFallback && this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      } else if (this.renderer) {
        this.renderer.clear();
      }
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.w = rect.width; this.h = rect.height;
    if (this.isFallback) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    } else {
      this.renderer.setSize(this.w, this.h, false);
      this.camera.right = this.w; this.camera.top = this.h; this.camera.updateProjectionMatrix();
    }
  }

  spawn(props) {
    for (let i = 0; i < this.MAX; i++) {
      if (!this.pool[i].active) { Object.assign(this.pool[i], props, { active: true }); return this.pool[i]; }
    }
    return null;
  }

  start() {
    this.resize();
    this.lastTime = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;
      if (this.mode !== 'none') { this.update(dt, now / 1000); this.render(); }
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() { if (this.animId) cancelAnimationFrame(this.animId); }
  reset() { this.pool.forEach(p => p.active = false); this.nextRocket = 0; }

  update(dt, time) {
    if (this.mode === 'fireworks') this.updateFireworks(dt, time);
    else if (this.mode === 'sparkle') this.updateSparkle(dt);
    else if (this.mode === 'rain') this.updateRain(dt);
    else if (this.mode === 'snow') this.updateSnow(dt);
  }

  updateFireworks(dt, time) {
    const gravity = this.h * 0.4; const drag = 0.984;
    if (time > this.nextRocket) {
      this.nextRocket = time + 1.2 + Math.random() * 1.6;
      this.spawn({ type: 'rocket', x: this.w * (0.15 + Math.random() * 0.7), y: 0, vx: (Math.random() - 0.5) * this.w * 0.04, vy: this.h * (0.5 + Math.random() * 0.2), life: 2, maxLife: 2, r: 1, g: 0.9, b: 0.6, size: 4, trailT: 0, targetY: this.h * (0.3 + Math.random() * 0.45) });
    }
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i]; if (!p.active) continue;
      p.life -= dt; if (p.life <= 0) { p.active = false; continue; }
      if (p.type === 'rocket') {
        p.vy -= gravity * 0.5 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.trailT -= dt;
        if (p.trailT <= 0) { p.trailT = 0.025; this.spawn({ type: 'trail', x: p.x + (Math.random() - 0.5) * 2, y: p.y, vx: 0, vy: -this.h * 0.02, life: 0.35, maxLife: 0.35, r: 1, g: 0.8, b: 0.4, size: 3 }); }
        if (p.y >= p.targetY) { this.explode(p.x, p.y); p.active = false; }
      } else {
        if (p.type === 'burst') { p.vy -= gravity * dt; p.vx *= drag; p.vy *= drag; }
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
    }
  }

  explode(x, y) {
    const count = 40 + Math.floor(Math.random() * 25);
    const palette = [[1,0.85,0.3],[1,0.4,0.65],[0.3,0.9,1],[0.5,1,0.4],[0.75,0.5,1],[1,0.6,0.2]];
    const ci = Math.floor(Math.random() * palette.length);
    const ci2 = (ci + 1 + Math.floor(Math.random() * (palette.length - 1))) % palette.length;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2; const speed = this.h * (0.12 + Math.random() * 0.28);
      const col = Math.random() > 0.3 ? palette[ci] : palette[ci2];
      this.spawn({ type: 'burst', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 + Math.random() * 0.8, maxLife: 1.8, r: col[0], g: col[1], b: col[2], size: 5 + Math.random() * 7 });
    }
  }

  updateSparkle(dt) {
    const active = this.pool.filter(p => p.active).length;
    if (active < 80 && Math.random() < 0.25) {
      const palette = [[1,1,0.95],[0.95,0.88,1],[1,0.92,0.8],[0.85,0.95,1],[1,0.85,0.92]];
      const col = palette[Math.floor(Math.random() * palette.length)];
      this.spawn({ type: 'sparkle', x: Math.random() * this.w, y: Math.random() * this.h, vx: 0, vy: 0, life: 1.5 + Math.random() * 2, maxLife: 3.5, r: col[0], g: col[1], b: col[2], size: 10 + Math.random() * 18 });
    }
    for (let i = 0; i < this.MAX; i++) { const p = this.pool[i]; if (p.active) { p.life -= dt; if (p.life <= 0) p.active = false; } }
  }

  updateRain(dt) {
    const active = this.pool.filter(p => p.active).length;
    const target = 120;
    if (active < target) {
      const count = Math.min(3, target - active);
      for (let j = 0; j < count; j++) {
        this.spawn({ type: 'rain', x: Math.random() * this.w, y: this.h + Math.random() * 40, vx: -this.w * 0.02, vy: -(this.h * (0.8 + Math.random() * 0.5)), life: 3, maxLife: 3, r: 0.6, g: 0.75, b: 1.0, size: 2 + Math.random() * 2 });
      }
    }
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i]; if (!p.active) continue;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y < -10) { p.active = false; continue; }
      p.life -= dt; if (p.life <= 0) p.active = false;
    }
  }

  updateSnow(dt) {
    const active = this.pool.filter(p => p.active).length;
    const target = 80;
    if (active < target && Math.random() < 0.3) {
      this.spawn({ type: 'snow', x: Math.random() * this.w, y: this.h + 10, vx: 0, vy: -(this.h * (0.06 + Math.random() * 0.06)), life: 12, maxLife: 12, r: 1, g: 1, b: 1, size: 3 + Math.random() * 5, phase: Math.random() * Math.PI * 2 });
    }
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i]; if (!p.active) continue;
      p.x += Math.sin(performance.now() * 0.001 + (p.phase || 0)) * 0.3;
      p.y += p.vy * dt;
      if (p.y < -10) { p.active = false; continue; }
      p.life -= dt; if (p.life <= 0) p.active = false;
    }
  }

  render() {
    if (this.isFallback) { this.renderFallback(); return; }
    const posA = this.geo.getAttribute('position'); const colA = this.geo.getAttribute('aColor');
    const sizeA = this.geo.getAttribute('aSize'); const alphaA = this.geo.getAttribute('aAlpha');
    let n = 0;
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i]; if (!p.active) continue;
      const lr = Math.max(0, p.life / p.maxLife); let alpha;
      if (this.mode === 'sparkle') { const t = 1 - lr; alpha = t < 0.2 ? t / 0.2 : (t > 0.7 ? (1 - t) / 0.3 : 1); }
      else { alpha = p.type === 'trail' ? lr * 0.6 : lr; }
      posA.array[n * 3] = p.x; posA.array[n * 3 + 1] = p.y; posA.array[n * 3 + 2] = 0;
      colA.array[n * 3] = p.r; colA.array[n * 3 + 1] = p.g; colA.array[n * 3 + 2] = p.b;
      sizeA.array[n] = p.size * (this.mode === 'fireworks' ? (0.4 + lr * 0.6) : 1); alphaA.array[n] = alpha * 0.9;
      n++;
    }
    this.geo.setDrawRange(0, n);
    posA.needsUpdate = true; colA.needsUpdate = true; sizeA.needsUpdate = true; alphaA.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  renderFallback() {
    const ctx = this.ctx; ctx.clearRect(0, 0, this.w, this.h); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i]; if (!p.active) continue;
      const lr = Math.max(0, p.life / p.maxLife); let alpha;
      if (this.mode === 'sparkle') { const t = 1 - lr; alpha = t < 0.2 ? t / 0.2 : (t > 0.7 ? (1 - t) / 0.3 : 1); }
      else { alpha = p.type === 'trail' ? lr * 0.6 : lr; }
      const drawY = this.h - p.y; ctx.globalAlpha = alpha * 0.8;
      const rgb = `rgb(${Math.floor(p.r*255)},${Math.floor(p.g*255)},${Math.floor(p.b*255)})`;
      ctx.fillStyle = rgb;
      ctx.beginPath(); ctx.arc(p.x, drawY, Math.max(1, p.size / 2), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
}
FTS.WebGLParticles = WebGLParticles;
