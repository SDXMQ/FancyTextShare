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
    'btn-update-check': '업데이트 확인',
    'btn-create-mine': '나도 만들기',
    'placeholder-text': '텍스트를 입력해주세요...',
    'section-persist': '지속 효과',
    'persist-none': '없음',
    'persist-fireworks': '폭죽',
    'persist-sparkle': '반짝이'
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
    'btn-update-check': 'Check for Updates',
    'btn-create-mine': 'Create My Own',
    'placeholder-text': 'Please enter some text...',
    'section-persist': 'Persistent Effect',
    'persist-none': 'None',
    'persist-fireworks': 'Fireworks',
    'persist-sparkle': 'Sparkle'
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
      
      // Byte 3: vignette(1 bit) | lang(1 bit) | persistEffect(2 bits) | remaining 4 bits reserved
      const vignetteVal = stateObj.vignette ? 1 : 0;
      const langVal = stateObj.lang === 'en' ? 1 : 0;
      const persistMap = { 'none': 0, 'fireworks': 1, 'sparkle': 2 };
      const persistVal = persistMap[stateObj.persistEffect] || 0;
      payload[2] = (vignetteVal & 0x01) | ((langVal & 0x01) << 1) | ((persistVal & 0x03) << 2);
      
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
        const persistCode = (b3 >> 2) & 0x03;
        const persistEffect = ['none', 'fireworks', 'sparkle'][persistCode] || 'none';
        
        // Parse Text
        const textBytes = xored.subarray(3);
        const text = new TextDecoder().decode(textBytes);
        
        return { text, theme, effect, font, size, align, glow, vignette, lang, persistEffect };
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
   WebGLParticles — Three.js Additive Particle Effects
   Modes: fireworks (physics burst), sparkle (cross-flare twinkle)
   ============================================================ */
class WebGLParticles {
  constructor(container) {
    this.container = container;
    this.mode = 'none';
    this.MAX = 500;
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
          attribute float aSize;
          attribute float aAlpha;
          attribute vec3 aColor;
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            vAlpha = aAlpha;
            vColor = aColor;
            gl_PointSize = aSize;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision mediump float;
          varying float vAlpha;
          varying vec3 vColor;
          uniform int uMode;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float shape;
            if (uMode == 0) {
              shape = exp(-d * d * 10.0);
            } else {
              float core = exp(-d * d * 25.0);
              float fx = exp(-abs(c.y) * 35.0) * exp(-abs(c.x) * 8.0);
              float fy = exp(-abs(c.x) * 35.0) * exp(-abs(c.y) * 8.0);
              shape = max(core, max(fx, fy) * 0.5);
            }
            if (shape < 0.01) discard;
            gl_FragColor = vec4(vColor, shape * vAlpha);
          }
        `,
        uniforms: { uMode: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false
      });

      this.points = new THREE.Points(this.geo, this.mat);
      this.scene.add(this.points);
    } catch (e) {
      console.warn('WebGL particles fallback to 2D:', e);
      this.isFallback = true;
      this.ctx = this.canvas.getContext('2d');
    }

    this.pool = [];
    for (let i = 0; i < this.MAX; i++) this.pool.push({ active: false });
  }

  setMode(mode) {
    this.mode = mode;
    this.pool.forEach(p => p.active = false);
    this.nextRocket = 0;
    if (!this.isFallback) this.mat.uniforms.uMode.value = mode === 'sparkle' ? 1 : 0;
    if (mode === 'none' && this.isFallback && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.w = rect.width; this.h = rect.height;
    if (this.isFallback) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.canvas.width = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    } else {
      this.renderer.setSize(this.w, this.h, false);
      this.camera.right = this.w;
      this.camera.top = this.h;
      this.camera.updateProjectionMatrix();
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

  reset() {
    this.pool.forEach(p => p.active = false);
    this.nextRocket = 0;
  }

  update(dt, time) {
    if (this.mode === 'fireworks') this.updateFireworks(dt, time);
    else if (this.mode === 'sparkle') this.updateSparkle(dt, time);
  }

  updateFireworks(dt, time) {
    const gravity = this.h * 0.4;
    const drag = 0.984;

    if (time > this.nextRocket) {
      this.nextRocket = time + 1.2 + Math.random() * 1.6;
      const x = this.w * (0.15 + Math.random() * 0.7);
      const targetY = this.h * (0.3 + Math.random() * 0.45);
      this.spawn({ type: 'rocket', x, y: 0, vx: (Math.random() - 0.5) * this.w * 0.04, vy: this.h * (0.5 + Math.random() * 0.2), life: 2, maxLife: 2, r: 1, g: 0.9, b: 0.6, size: 4, trailT: 0, targetY });
    }

    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; continue; }

      if (p.type === 'rocket') {
        p.vy -= gravity * 0.5 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.trailT -= dt;
        if (p.trailT <= 0) {
          p.trailT = 0.025;
          this.spawn({ type: 'trail', x: p.x + (Math.random() - 0.5) * 2, y: p.y, vx: 0, vy: -this.h * 0.02, life: 0.35, maxLife: 0.35, r: 1, g: 0.8, b: 0.4, size: 3 });
        }
        if (p.y >= p.targetY) { this.explode(p.x, p.y); p.active = false; }
      } else {
        if (p.type === 'burst') { p.vy -= gravity * dt; p.vx *= drag; p.vy *= drag; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }
  }

  explode(x, y) {
    const count = 40 + Math.floor(Math.random() * 25);
    const palette = [[1,0.85,0.3],[1,0.4,0.65],[0.3,0.9,1],[0.5,1,0.4],[0.75,0.5,1],[1,0.6,0.2]];
    const ci = Math.floor(Math.random() * palette.length);
    const ci2 = (ci + 1 + Math.floor(Math.random() * (palette.length - 1))) % palette.length;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.h * (0.12 + Math.random() * 0.28);
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
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i];
      if (p.active) { p.life -= dt; if (p.life <= 0) p.active = false; }
    }
  }

  render() {
    if (this.isFallback) { this.renderFallback(); return; }
    const posA = this.geo.getAttribute('position');
    const colA = this.geo.getAttribute('aColor');
    const sizeA = this.geo.getAttribute('aSize');
    const alphaA = this.geo.getAttribute('aAlpha');
    let n = 0;
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      const lr = Math.max(0, p.life / p.maxLife);
      let alpha;
      if (this.mode === 'sparkle') {
        const t = 1 - lr;
        alpha = t < 0.2 ? t / 0.2 : (t > 0.7 ? (1 - t) / 0.3 : 1);
      } else {
        alpha = p.type === 'trail' ? lr * 0.6 : lr;
      }
      posA.array[n * 3] = p.x;
      posA.array[n * 3 + 1] = p.y;
      posA.array[n * 3 + 2] = 0;
      colA.array[n * 3] = p.r;
      colA.array[n * 3 + 1] = p.g;
      colA.array[n * 3 + 2] = p.b;
      sizeA.array[n] = p.size * (this.mode === 'fireworks' ? (0.4 + lr * 0.6) : 1);
      alphaA.array[n] = alpha * 0.9;
      n++;
    }
    this.geo.setDrawRange(0, n);
    posA.needsUpdate = true; colA.needsUpdate = true;
    sizeA.needsUpdate = true; alphaA.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  renderFallback() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.MAX; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      const lr = Math.max(0, p.life / p.maxLife);
      let alpha;
      if (this.mode === 'sparkle') { const t = 1 - lr; alpha = t < 0.2 ? t / 0.2 : (t > 0.7 ? (1 - t) / 0.3 : 1); }
      else { alpha = p.type === 'trail' ? lr * 0.6 : lr; }
      const drawY = this.h - p.y;
      ctx.globalAlpha = alpha * 0.8;
      ctx.shadowBlur = p.size * 2;
      const rgb = `rgb(${Math.floor(p.r*255)},${Math.floor(p.g*255)},${Math.floor(p.b*255)})`;
      ctx.shadowColor = rgb; ctx.fillStyle = rgb;
      ctx.beginPath(); ctx.arc(p.x, drawY, Math.max(1, p.size / 2), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  }

  destroy() {
    this.stop();
    if (this.canvas.parentElement) this.canvas.parentElement.removeChild(this.canvas);
    if (!this.isFallback && this.renderer) { this.renderer.dispose(); this.geo.dispose(); this.mat.dispose(); }
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
  document.querySelector('.update-selector')?.classList.add('hidden');

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
  ps.setVignette(state.vignette !== undefined ? state.vignette : false);
  ps.start();
  window.addEventListener('resize', () => { ps.resize(); });

  // Start persistent effect
  const fx = new WebGLParticles(viewerView);
  fx.setMode(state.persistEffect || 'none');
  fx.start();
  window.addEventListener('resize', () => { fx.resize(); });

  // Bind replay animation trigger
  const replayBtn = document.getElementById('viewer-replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      replayEntrance(textEl, state.effect || 'floatUp', state.text || '');
      fx.reset();
    });
  }
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
  const effectBtns = document.querySelectorAll('#effect-selector .effect-btn');
  const persistBtns = document.querySelectorAll('#persist-selector .effect-btn');
  const glowToggle = document.getElementById('text-glow');
  const vignetteToggle = document.getElementById('bg-vignette');
  const previewText = document.getElementById('preview-text');
  const shareBtn = document.getElementById('share-btn');
  const shareResult = document.getElementById('share-result');
  const shareUrlInput = document.getElementById('share-url');
  const copyBtn = document.getElementById('copy-btn');
  const previewReplayBtn = document.getElementById('preview-replay-btn');

  const previewCanvas = document.getElementById('preview-canvas');
  const previewContainer = document.getElementById('preview-container');
  const ps = new BackgroundShader(previewCanvas);
  const fx = new WebGLParticles(previewContainer);

  // State
  let activeTheme = 0;
  let activeEffect = 'floatUp';
  let activePersist = 'none';
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
  fx.start();
  window.addEventListener('resize', () => { ps.resize(); fx.resize(); });
 
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

  // ---- Persistent Effect ----
  persistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      persistBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePersist = btn.dataset.persist;
      fx.setMode(activePersist);
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
      vignette: vignetteToggle.checked,
      persistEffect: activePersist
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

  // ---- Hard refresh / Update check button ----
  const updateBtn = document.getElementById('update-btn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('t', Date.now());

      if ('caches' in window) {
        caches.keys().then(names => {
          return Promise.all(names.map(name => caches.delete(name)));
        }).catch(err => console.warn('Cache clear failed:', err))
          .finally(() => {
            window.location.href = currentUrl.toString();
          });
      } else {
        window.location.href = currentUrl.toString();
      }
    });
  }

  // ---- Replay animation in preview ----
  if (previewReplayBtn) {
    previewReplayBtn.addEventListener('click', () => {
      replayEntrance(previewText, activeEffect, textInput.value);
      fx.reset();
    });
  }
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
