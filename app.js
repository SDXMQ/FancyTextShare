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
    id: 'starryNight',
    label: { ko: '밤하늘', en: 'Starry Night' },
    bgGradient: ['#070b1a', '#0f1b3d', '#162050'],
    previewGradient: 'linear-gradient(135deg, #070b1a, #0f1b3d, #162050)',
    particles: 'stars',
    defaultText: { ko: '밤하늘에 띄우는 나의 마음', en: 'My heart floating in the starry night' }
  },
  {
    id: 'dawn',
    label: { ko: '새벽', en: 'Dawn' },
    bgGradient: ['#1a0533', '#3d1259', '#c0392b', '#f39c12'],
    previewGradient: 'linear-gradient(to top, #f39c12, #c0392b, #3d1259, #1a0533)',
    particles: 'fireflies',
    defaultText: { ko: '새벽하늘을 수놓은 아련한 고백', en: 'A vague confession embroiderying the dawn sky' }
  },
  {
    id: 'morning',
    label: { ko: '아침', en: 'Morning' },
    bgGradient: ['#4facfe', '#00f2fe'],
    previewGradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    particles: 'floatingLight',
    defaultText: { ko: '싱그러운 아침 햇살 아래 첫인사', en: 'First greeting under the fresh morning sun' }
  },
  {
    id: 'sunset',
    label: { ko: '노을', en: 'Sunset' },
    bgGradient: ['#fa709a', '#fee140', '#f7797d'],
    previewGradient: 'linear-gradient(to top, #fee140, #fa709a, #f7797d)',
    particles: 'warmDust',
    defaultText: { ko: '붉게 물든 저녁 노을빛을 담아', en: 'Holding the red sunset glow of the evening' }
  },
  {
    id: 'aurora',
    label: { ko: '오로라', en: 'Aurora' },
    bgGradient: ['#0f0c29', '#302b63', '#24243e'],
    previewGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    particles: 'aurora',
    defaultText: { ko: '춤추는 오로라 아래 그린 기적', en: 'A miracle drawn under the dancing aurora' }
  },
  {
    id: 'deepSea',
    label: { ko: '심해', en: 'Deep Sea' },
    bgGradient: ['#000428', '#004e92'],
    previewGradient: 'linear-gradient(135deg, #000428, #004e92)',
    particles: 'bubbles',
    defaultText: { ko: '깊은 심해 속 고요히 흐르는 생각', en: 'Thoughts quietly flowing in the deep sea' }
  }
];

/* ============================================================
   i18n — Language Translation Settings
   ============================================================ */
const I18N_DICTS = {
  ko: {
    'subtitle': '텍스트에 감성을 입혀 링크 하나로 공유하세요.',
    'section-text': '텍스트 입력',
    'input-placeholder': '공유하고 싶은 문장을 입력하세요...',
    'section-theme': '배경 테마',
    'section-effect': '등장 효과',
    'effect-float': '떠오르기',
    'effect-glow': '빛나며',
    'effect-type': '타이핑',
    'section-style': '스타일',
    'label-font': '글꼴',
    'font-modern': 'Outfit (모던)',
    'font-serif': 'Playfair (감성)',
    'font-mono': 'Fira Code (테크)',
    'label-align': '정렬',
    'label-size': '글자 크기',
    'label-glow': '글자 발광 효과',
    'label-vignette': '배경 비네트 효과',
    'btn-share': '공유 링크 생성',
    'share-hint': '이 링크를 상대방에게 보내면 당신이 만든 그대로 보입니다!',
    'footer-tagline': '서버 없이 링크로 감성 공유',
    'cache-notice': '업데이트가 반영되지 않거나 작동하지 않으면 강력 새로고침 (Ctrl+F5 / Cmd+Shift+R)을 해주세요.',
    'btn-create-mine': '나도 만들기',
    'placeholder-text': '텍스트를 입력해주세요...'
  },
  en: {
    'subtitle': 'Add emotion to your text and share it with a single link.',
    'section-text': 'Text Input',
    'input-placeholder': 'Enter the sentence you want to share...',
    'section-theme': 'Background Theme',
    'section-effect': 'Entrance Effect',
    'effect-float': 'Float Up',
    'effect-glow': 'Fade Glow',
    'effect-type': 'Typewriter',
    'section-style': 'Style',
    'label-font': 'Font Family',
    'font-modern': 'Outfit (Modern)',
    'font-serif': 'Playfair (Serif)',
    'font-mono': 'Fira Code (Tech)',
    'label-align': 'Alignment',
    'label-size': 'Font Size',
    'label-glow': 'Text Glow Effect',
    'label-vignette': 'Vignette Effect',
    'btn-share': 'Generate Share Link',
    'share-hint': 'Send this link to someone and they will see exactly what you created!',
    'footer-tagline': 'Share emotions with a serverless link',
    'cache-notice': 'If it does not work or update, please do a hard refresh (Ctrl+F5 / Cmd+Shift+R).',
    'btn-create-mine': 'Create My Own',
    'placeholder-text': 'Please enter some text...'
  }
};

let currentLang = 'ko';

function updateLanguage(lang) {
  currentLang = lang;
  const langText = document.getElementById('lang-text');
  if (langText) langText.textContent = lang.toUpperCase();
  
  // Translate simple elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N_DICTS[lang][key]) {
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = '';
        el.appendChild(icon);
        el.appendChild(document.createTextNode(' ' + I18N_DICTS[lang][key]));
      } else {
        el.textContent = I18N_DICTS[lang][key];
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (I18N_DICTS[lang][key]) {
      el.setAttribute('placeholder', I18N_DICTS[lang][key]);
    }
  });

  // Update theme buttons if selector is present (Editor mode)
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) {
    const activeThemeIndex = parseInt(themeSelector.dataset.activeTheme || 0);
    themeSelector.innerHTML = '';
    THEMES.forEach((theme, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `theme-btn ${i === activeThemeIndex ? 'active' : ''}`;
      btn.style.background = theme.previewGradient;
      btn.dataset.label = theme.label[lang];
      btn.addEventListener('click', () => {
        themeSelector.querySelector('.active')?.classList.remove('active');
        btn.classList.add('active');
        themeSelector.dataset.activeTheme = i;
        if (window.appSetTheme) window.appSetTheme(i);
      });
      themeSelector.appendChild(btn);
    });
  }
}

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
      
      // Create payload: 3 bytes header + text bytes
      const payload = new Uint8Array(3 + textBytes.length);
      
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
      
      // Byte 3: vignette(1 bit, 0-1) | lang(1 bit, 0-1: 0=ko, 1=en) | remaining 6 bits reserved
      const vignetteVal = stateObj.vignette ? 1 : 0;
      const langVal = stateObj.lang === 'en' ? 1 : 0;
      payload[2] = (vignetteVal & 0x01) | ((langVal & 0x01) << 1);
      
      // Set text bytes
      payload.set(textBytes, 3);
      
      const xored = xorBytes(payload, KEY);
      return toBase64Url(xored);
    },
    decrypt(hash) {
      try {
        const bytes = fromBase64Url(hash);
        const xored = xorBytes(bytes, KEY);
        if (xored.length < 3) return null;
        
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
        
        // Parse Byte 3
        const b3 = xored[2];
        const vignette = (b3 & 0x01) === 1;
        const lang = ((b3 >> 1) & 0x01) === 1 ? 'en' : 'ko';
        
        // Parse Text
        const textBytes = xored.subarray(3);
        const text = new TextDecoder().decode(textBytes);
        
        return { text, theme, effect, font, size, align, glow, vignette, lang };
      } catch (e) {
        console.error('Decryption failed:', e);
        return null;
      }
    }
  };
})();

/* ============================================================
   BackgroundShader — Three.js WebGL GLSL Shader System with 2D Canvas Fallback
   ============================================================ */
class BackgroundShader {
  constructor(canvas) {
    this.canvas = canvas;
    this.isFallback = false;
    this.animId = null;
    this.themeIndex = 0;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      this.uniforms = {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2() },
        uTheme: { value: 0 },
        uVignette: { value: 1 }
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
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.renderer.setSize(width, height, false);
        this.uniforms.uResolution.value.set(width, height);
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
        this.uniforms.uTime.value = time * 0.001;
        this.renderer.render(this.scene, this.camera);
      }
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  renderFallback() {
    const ctx = this.ctx;
    const theme = THEMES[this.themeIndex];
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
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
  }

  getFragmentShader() {
    return `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform int uTheme;
      uniform int uVignette;
      varying vec2 vUv;
      
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }
      
      float starfield(vec2 uv) {
        float n = hash(uv * 180.0);
        float star = step(0.997, n) * hash(uv * 99.0) * 0.75;
        return star;
      }

      float drawSingleMeteor(vec2 uv, float t, float seedOffset) {
        float timeScale = (t + seedOffset) * 0.32; 
        float cycle = floor(timeScale);
        float localT = fract(timeScale);
        
        float h1 = hash(vec2(cycle, 123.45 + seedOffset));
        float h2 = hash(vec2(cycle, 678.90 + seedOffset));
        float h3 = hash(vec2(cycle, 345.67 + seedOffset));
        
        if (h1 < 0.15) return 0.0;
        
        float size = 0.001 + h1 * 0.0022;
        float speed = 1.0 + (1.0 - h1) * 0.55; 
        float brightness = 0.7 + h1 * 2.2;
        float len = 0.22 + h1 * 0.22;
        
        // Parallel constant direction (gentle down-right sweep)
        vec2 dir = normalize(vec2(1.2, -0.45));
        
        // Spawn points spread widely across both X and Y boundaries (low to high altitudes)
        vec2 start = vec2(-0.55 + h2 * 1.4, 0.25 + h3 * 0.9);
        
        vec2 progress = start + dir * (localT * speed * 1.55);
        
        vec2 p = uv - progress;
        float proj = dot(p, dir);
        proj = clamp(proj, -len, 0.0);
        vec2 nearest = progress + dir * proj;
        float d = length(uv - nearest);
        
        float tail = smoothstep(-len, 0.0, proj);
        float ray = smoothstep(size, 0.0, d) * tail;
        
        float timeMask = smoothstep(0.0, 0.12, localT) * smoothstep(0.85, 0.7, localT);
        
        return ray * timeMask * brightness;
      }

      float shootingStar(vec2 uv, float t) {
        float m1 = drawSingleMeteor(uv, t, 0.0);
        float m2 = drawSingleMeteor(uv, t, 33.7);
        return m1 + m2;
      }

      vec3 starryNight(vec2 uv, float t) {
        vec3 c1 = vec3(0.0, 0.05, 0.15);
        vec3 c2 = vec3(0.0, 0.0, 0.02);
        vec3 bg = mix(c1, c2, uv.y);
        float milkyWay = fbm(uv * 3.0 + vec2(t * 0.01, 0.0));
        bg += vec3(0.1, 0.1, 0.2) * smoothstep(0.4, 0.7, milkyWay) * (1.0 - abs(uv.y - 0.5)*2.0);
        
        float stars = starfield(uv);
        float meteor = shootingStar(uv, t);
        return bg + vec3(1.0) * stars + vec3(1.0, 0.95, 0.9) * meteor;
      }

      vec3 dawn(vec2 uv, float t) {
        vec3 c1 = vec3(0.9, 0.4, 0.3);
        vec3 c2 = vec3(0.2, 0.1, 0.4);
        vec3 bg = mix(c1, c2, uv.y + fbm(uv * 2.0 + vec2(t * 0.05, 0.0)) * 0.2);
        
        vec2 grid = uv * 28.0;
        vec2 gv = fract(grid) - 0.5;
        vec2 ip = floor(grid);
        float h = hash(ip);
        
        // Random wandering vector for each individual firefly
        float angle = h * 6.2831;
        float speed = 0.08 + h * 0.14;
        vec2 flow = vec2(cos(angle + t * 0.75), sin(angle * 1.5 + t * 0.5)) * speed * 2.0;
        vec2 deformedGv = gv - flow;
        
        float d = length(deformedGv);
        float glow = smoothstep(0.22, 0.0, d);
        float dots = step(0.982, h) * glow * (sin(t * 2.0 + h * 20.0) * 0.5 + 0.5);
        return bg + vec3(1.0, 0.85, 0.4) * dots * 1.5;
      }

      vec3 morning(vec2 uv, float t) {
        vec3 c1 = vec3(0.8, 0.95, 1.0);
        vec3 c2 = vec3(0.3, 0.6, 0.9);
        vec3 bg = mix(c1, c2, uv.y);
        float clouds = fbm(uv * 3.0 - vec2(t * 0.05, 0.0));
        return mix(bg, vec3(1.0), smoothstep(0.4, 0.8, clouds));
      }

      vec3 sunset(vec2 uv, float t) {
        vec3 c1 = vec3(1.0, 0.5, 0.1);
        vec3 c2 = vec3(0.4, 0.1, 0.3);
        vec3 bg = mix(c1, c2, uv.y + fbm(uv * 2.0 - vec2(t * 0.02, 0.0)) * 0.1);
        float clouds = fbm(uv * 4.0 - vec2(t * 0.1, 0.0));
        return mix(bg, vec3(1.0, 0.7, 0.4), smoothstep(0.5, 0.9, clouds));
      }

      vec3 aurora(vec2 uv, float t) {
        vec3 bg = mix(vec3(0.0, 0.05, 0.1), vec3(0.0, 0.0, 0.0), uv.y);
        bg += vec3(1.0) * starfield(uv);
        
        vec2 p = uv * vec2(3.0, 1.0);
        float n = fbm(p + vec2(t * 0.2, t * 0.1));
        float n2 = fbm(p + vec2(-t * 0.15, t * 0.2) + vec2(n * 2.0));
        
        vec3 col1 = vec3(0.0, 1.0, 0.5);
        vec3 col2 = vec3(0.2, 0.4, 1.0);
        
        float mask = smoothstep(0.0, 0.8, 1.0 - abs(uv.y - 0.6 + n * 0.2));
        vec3 aur = mix(col1, col2, n) * n2 * mask * 1.5;
        
        return bg + aur;
      }

      vec3 deepSea(vec2 uv, float t) {
        vec3 c1 = vec3(0.0, 0.1, 0.3);
        vec3 c2 = vec3(0.0, 0.02, 0.1);
        vec3 bg = mix(c1, c2, uv.y);
        
        vec2 p = uv * 4.0;
        p.x += sin(p.y * 1.5 + t) * 0.4;
        float water = fbm(p + vec2(0.0, t * 0.3));
        bg += vec3(0.08, 0.25, 0.35) * water * 0.6;
        
        vec2 buv = uv;
        buv.y -= t * 0.18;
        
        vec2 grid = buv * 16.0;
        vec2 gv = fract(grid) - 0.5;
        vec2 id = floor(grid);
        float h = hash(id);
        
        float wobbleTime = t * 4.0 + h * 50.0;
        gv.x += sin(wobbleTime) * 0.15;
        
        float r = 0.03 + h * 0.06;
        
        float squish = 1.0 + cos(wobbleTime * 2.0) * 0.1;
        vec2 deformedGv = gv * vec2(1.0 / squish, squish);
        float d = length(deformedGv);
        
        float ring = smoothstep(r, r - 0.012, d) * smoothstep(r - 0.04, r - 0.03, d);
        float interior = smoothstep(r, 0.0, d) * 0.12;
        
        vec2 highlightPos = vec2(-r * 0.35, r * 0.35);
        float highlight = smoothstep(r * 0.35, 0.0, length(deformedGv - highlightPos)) * 0.8;
        
        float innerGlow = smoothstep(r - 0.03, r - 0.015, d) * smoothstep(r, r - 0.03, d) * 0.3;
        
        float bubble = (ring + interior + highlight + innerGlow) * step(0.965, h);
        
        return bg + vec3(0.65, 0.88, 1.0) * bubble * 0.35;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec3 color = vec3(0.0);
        
        if (uTheme == 0) color = starryNight(uv, uTime);
        else if (uTheme == 1) color = dawn(uv, uTime);
        else if (uTheme == 2) color = morning(uv, uTime);
        else if (uTheme == 3) color = sunset(uv, uTime);
        else if (uTheme == 4) color = aurora(uv, uTime);
        else if (uTheme == 5) color = deepSea(uv, uTime);
        
        if (uVignette == 1) {
          float dist = distance(uv, vec2(0.5));
          color *= smoothstep(0.8, 0.2, dist);
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
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

  // Apply language if shared, default to ko
  const sharedLang = state.lang || 'ko';
  updateLanguage(sharedLang);
  
  // Hide language toggle button in fullscreen viewer
  document.querySelector('.lang-selector')?.classList.add('hidden');

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

  // Start background shader
  const ps = new BackgroundShader(canvas);
  ps.setTheme(state.theme || 0);
  ps.setVignette(state.vignette !== undefined ? state.vignette : true);
  ps.start();
  window.addEventListener('resize', () => { ps.resize(); });
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
  const vignetteToggle = document.getElementById('bg-vignette');
  const previewText = document.getElementById('preview-text');
  const shareBtn = document.getElementById('share-btn');
  const shareResult = document.getElementById('share-result');
  const shareUrlInput = document.getElementById('share-url');
  const copyBtn = document.getElementById('copy-btn');

  const previewCanvas = document.getElementById('preview-canvas');
  const ps = new BackgroundShader(previewCanvas);

  // State
  let activeTheme = 0;
  let activeEffect = 'floatUp';
  let activeAlign = 'center';
  let isUserModified = false;

  // Expose theme changing behavior to i18n renderer
  window.appSetTheme = (i) => {
    themeSelector.dataset.activeTheme = i;
    themeSelector.querySelector('.active')?.classList.remove('active');
    themeSelector.querySelectorAll('.theme-btn')[i]?.classList.add('active');
    activeTheme = i;
    ps.setTheme(i);
 
    if (!isUserModified) {
      textInput.value = THEMES[i].defaultText[currentLang];
      syncPreview();
      replayEntrance(previewText, activeEffect, textInput.value);
    }
  };

  // ---- Language Selector Button ----
  const langBtn = document.getElementById('lang-btn');
  langBtn.addEventListener('click', () => {
    const nextLang = currentLang === 'ko' ? 'en' : 'ko';
    updateLanguage(nextLang);
    
    // Update default text if not modified
    if (!isUserModified) {
      textInput.value = THEMES[activeTheme].defaultText[nextLang];
      syncPreview();
      replayEntrance(previewText, activeEffect, textInput.value);
    } else if (textInput.value === '') {
      syncPreview();
    }
  });

  // Init default language to Korean
  updateLanguage('ko');
 
  // Init preview canvas
  ps.setTheme(0);
  ps.start();
  window.addEventListener('resize', () => { ps.resize(); });
 
  // ---- Text input live sync ----
  charCount.textContent = textInput.value.length;
  function syncPreview() {
    previewText.textContent = textInput.value || I18N_DICTS[currentLang]['placeholder-text'];
    charCount.textContent = textInput.value.length;
  }
  textInput.addEventListener('input', () => {
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
      replayEntrance(previewText, activeEffect, textInput.value);
    });
  });
 
  // ---- Glow toggle ----
  glowToggle.addEventListener('change', () => {
    previewText.classList.toggle('glow', glowToggle.checked);
  });
  previewText.classList.toggle('glow', glowToggle.checked);
 
  // ---- Vignette toggle ----
  vignetteToggle.addEventListener('change', () => {
    ps.setVignette(vignetteToggle.checked);
  });
  ps.setVignette(vignetteToggle.checked);
 
  // ---- Share link generation ----
  shareBtn.addEventListener('click', () => {
    const state = {
      text: textInput.value,
      theme: activeTheme,
      effect: activeEffect,
      font: parseInt(fontSelect.value),
      size: parseInt(fontSizeInput.value),
      align: activeAlign,
      glow: glowToggle.checked,
      vignette: vignetteToggle.checked
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
