/* ============================================================
   5. BackgroundShader
   ============================================================ */
class BackgroundShader {
  constructor(canvas) {
    this.canvas = canvas;
    this.isFallback = false;
    this.animId = null;
    this.themeIndex = 0;
    this.lastWidth = 0;
    this.lastHeight = 0;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      this.uniforms = {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2() },
        uTheme: { value: 0 },
        uVignette: { value: 0 }
      };
      
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader: this.getVertexShader(),
        fragmentShader: this.getFragmentShader(),
        uniforms: this.uniforms
      });
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to 2D Canvas gradient:", e);
      this.isFallback = true;
      this.ctx = this.canvas.getContext('2d');
    }
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    if (this.isFallback) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = width;
      this.h = height;
    } else {
      if (this.lastWidth !== width || this.lastHeight !== height) {
        this.lastWidth = width;
        this.lastHeight = height;
        this.renderer.setSize(width, height, false);
        this.uniforms.uResolution.value.set(this.canvas.width, this.canvas.height);
      }
    }
  }

  setTheme(themeIndex) {
    this.themeIndex = themeIndex;
    if (!this.isFallback) {
      this.uniforms.uTheme.value = themeIndex;
    }
  }

  setVignette(enabled) {
    if (!this.isFallback) {
      this.uniforms.uVignette.value = enabled ? 1 : 0;
    }
  }

  start() {
    this.resize();
    const loop = (time) => {
      if (this.isFallback) {
        this.renderFallback();
      } else {
        this.uniforms.uTime.value = (time * 0.001) % 1000.0;
        this.renderer.render(this.scene, this.camera);
      }
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  renderFallback() {
    const ctx = this.ctx;
    const theme = Config.THEMES[this.themeIndex];
    if (!theme) return;
    
    const grad = ctx.createLinearGradient(0, 0, 0, this.h);
    const colors = theme.bgGradient;
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  getVertexShader() {
    return `
      precision highp float;
      varying highp vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
  }

  getFragmentShader() {
    return `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform int uTheme;
      uniform int uVignette;
      varying highp vec2 vUv;
      
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 5; ++i) { v += a * noise(p); p = rot * p * 2.0 + shift; a *= 0.5; }
        return v;
      }
      float starfield(vec2 uv) {
        float n = hash(uv * 180.0);
        return step(0.997, n) * hash(uv * 99.0) * 0.75;
      }
      float drawSingleMeteor(vec2 uv, float t, float seedOffset) {
        float timeScale = (t + seedOffset) * 0.32; float cycle = floor(timeScale); float localT = fract(timeScale);
        float h1 = hash(vec2(cycle, 123.45 + seedOffset));
        if (h1 < 0.15) return 0.0;
        float size = 0.001 + h1 * 0.0022; float speed = 1.0 + (1.0 - h1) * 0.55; float brightness = 0.7 + h1 * 2.2; float len = 0.22 + h1 * 0.22;
        vec2 dir = normalize(vec2(1.2, -0.45));
        vec2 start = vec2(-0.55 + hash(vec2(cycle, 678.90 + seedOffset)) * 1.4, 0.25 + hash(vec2(cycle, 345.67 + seedOffset)) * 0.9);
        vec2 progress = start + dir * (localT * speed * 1.55);
        vec2 p = uv - progress; float proj = clamp(dot(p, dir), -len, 0.0);
        float d = length(uv - (progress + dir * proj));
        float tail = smoothstep(-len, 0.0, proj);
        return smoothstep(size, 0.0, d) * tail * smoothstep(0.0, 0.12, localT) * smoothstep(0.85, 0.7, localT) * brightness;
      }
      float shootingStar(vec2 uv, float t) { return drawSingleMeteor(uv, t, 0.0) + drawSingleMeteor(uv, t, 33.7); }

      vec3 starryNight(vec2 uv, float t) {
        vec3 bg = mix(vec3(0.0, 0.05, 0.15), vec3(0.0, 0.0, 0.02), uv.y);
        bg += vec3(0.1, 0.1, 0.2) * smoothstep(0.4, 0.7, fbm(uv * 3.0 + vec2(t * 0.01, 0.0))) * (1.0 - abs(uv.y - 0.5)*2.0);
        return bg + vec3(1.0) * starfield(uv) + vec3(1.0, 0.95, 0.9) * shootingStar(uv, t);
      }
      vec3 dawn(vec2 uv, float t) {
        vec3 bg = mix(vec3(0.9, 0.4, 0.3), vec3(0.2, 0.1, 0.4), uv.y + fbm(uv * 2.0 + vec2(t * 0.05, 0.0)) * 0.2);
        vec2 grid = uv * 28.0; float h = hash(floor(grid));
        vec2 flow = vec2(cos(h * 6.2831 + t * 0.75), sin(h * 6.2831 * 1.5 + t * 0.5)) * (0.08 + h * 0.14) * 2.0;
        float dots = step(0.982, h) * smoothstep(0.22, 0.0, length(fract(grid) - 0.5 - flow)) * (sin(t * 2.0 + h * 20.0) * 0.5 + 0.5);
        return bg + vec3(1.0, 0.85, 0.4) * dots * 1.5;
      }
      vec3 morning(vec2 uv, float t) {
        vec3 bg = mix(vec3(0.8, 0.95, 1.0), vec3(0.3, 0.6, 0.9), uv.y);
        return mix(bg, vec3(1.0), smoothstep(0.4, 0.8, fbm(uv * 3.0 - vec2(t * 0.05, 0.0))));
      }
      vec3 sunset(vec2 uv, float t) {
        vec3 bg = mix(vec3(1.0, 0.5, 0.1), vec3(0.4, 0.1, 0.3), uv.y + fbm(uv * 2.0 - vec2(t * 0.02, 0.0)) * 0.1);
        return mix(bg, vec3(1.0, 0.7, 0.4), smoothstep(0.5, 0.9, fbm(uv * 4.0 - vec2(t * 0.1, 0.0))));
      }
      vec3 aurora(vec2 uv, float t) {
        vec3 bg = mix(vec3(0.0, 0.05, 0.1), vec3(0.0, 0.0, 0.0), uv.y) + vec3(1.0) * starfield(uv);
        vec2 p = uv * vec2(3.0, 1.0); float n = fbm(p + vec2(t * 0.2, t * 0.1));
        float aur = n * fbm(p + vec2(-t * 0.15, t * 0.2) + vec2(n * 2.0)) * smoothstep(0.0, 0.8, 1.0 - abs(uv.y - 0.6 + n * 0.2)) * 1.5;
        return bg + mix(vec3(0.0, 1.0, 0.5), vec3(0.2, 0.4, 1.0), n) * aur;
      }
      vec3 deepSea(vec2 uv, float t) {
        vec3 bg = mix(vec3(0.0, 0.1, 0.3), vec3(0.0, 0.02, 0.1), uv.y);
        vec2 p = uv * 4.0; p.x += sin(p.y * 1.5 + t) * 0.4;
        bg += vec3(0.08, 0.25, 0.35) * fbm(p + vec2(0.0, t * 0.3)) * 0.6;
        vec2 buv = vec2(uv.x, uv.y - t * 0.18); vec2 grid = buv * 16.0; float h = hash(floor(grid));
        float wobble = t * 4.0 + h * 50.0; vec2 gv = fract(grid) - 0.5; gv.x += sin(wobble) * 0.15;
        float squish = 1.0 + cos(wobble * 2.0) * 0.1; float d = length(gv * vec2(1.0 / squish, squish));
        float r = 0.03 + h * 0.06;
        float bubble = (smoothstep(r, r - 0.012, d) * smoothstep(r - 0.04, r - 0.03, d) + smoothstep(r, 0.0, d) * 0.12 + 
                        smoothstep(r * 0.35, 0.0, length(gv * vec2(1.0/squish, squish) - vec2(-r * 0.35, r * 0.35))) * 0.8 + 
                        smoothstep(r - 0.03, r - 0.015, d) * smoothstep(r, r - 0.03, d) * 0.3) * step(0.965, h);
        return bg + vec3(0.65, 0.88, 1.0) * bubble * 0.35;
      }

      void main() {
        vec2 uv = vUv;
        vec3 color = vec3(0.0);
        if (uTheme == 0) color = starryNight(uv, uTime);
        else if (uTheme == 1) color = dawn(uv, uTime);
        else if (uTheme == 2) color = morning(uv, uTime);
        else if (uTheme == 3) color = sunset(uv, uTime);
        else if (uTheme == 4) color = aurora(uv, uTime);
        else if (uTheme == 5) color = deepSea(uv, uTime);
        if (uVignette == 1) {
          float aspect = uResolution.x / uResolution.y;
          vec2 aspectUv = vec2(uv.x * aspect, uv.y);
          vec2 center = vec2(0.5 * aspect, 0.5);
          color *= smoothstep(0.8, 0.2, distance(aspectUv, center));
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `;
  }
}
