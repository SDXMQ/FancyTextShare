/* ============================================================
   FancyTextShare — App Logic (OOP Refactored)
   ============================================================ */

/* ============================================================
   1. Configuration & Constants
   ============================================================ */
const Config = {
  FONTS: [
    "'Outfit', 'Noto Sans KR', sans-serif",
    "'Playfair Display', serif",
    "'Fira Code', monospace"
  ],
  THEMES: [
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
  ],
  I18N: {
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
      'cache-notice': '업데이트가 반영되지 않거나 작동하지 않으면 왼쪽 상단의 새로고침 버튼을 눌러주세요!',
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
      'cache-notice': 'If updates are not reflected or it does not work, please click the refresh button in the top left!',
      'btn-update-check': 'Check for Updates',
      'btn-create-mine': 'Create My Own',
      'placeholder-text': 'Please enter some text...',
      'section-persist': 'Persistent Effect',
      'persist-none': 'None',
      'persist-fireworks': 'Fireworks',
      'persist-sparkle': 'Sparkle'
    }
  }
};


/* ============================================================
   2. I18nManager
   ============================================================ */
class I18nManager {
  constructor(defaultLang = 'ko') {
    this.lang = defaultLang;
    this.listeners = [];
  }

  setLanguage(lang) {
    if (!Config.I18N[lang]) return;
    this.lang = lang;
    this.updateDOM();
    this.notifyListeners();
  }

  toggleLanguage() {
    this.setLanguage(this.lang === 'ko' ? 'en' : 'ko');
  }

  get(key) {
    return Config.I18N[this.lang][key] || key;
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.lang));
  }

  updateDOM() {
    const langText = document.getElementById('lang-text');
    if (langText) langText.textContent = this.lang.toUpperCase();
    
    // Translate simple elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (Config.I18N[this.lang][key]) {
        const icon = el.querySelector('i');
        if (icon) {
          el.innerHTML = '';
          el.appendChild(icon);
          el.appendChild(document.createTextNode(' ' + this.get(key)));
        } else {
          el.textContent = this.get(key);
        }
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (Config.I18N[this.lang][key]) {
        el.setAttribute('placeholder', this.get(key));
      }
    });
  }
}


/* ============================================================
   3. Entrance Effects (Strategy Pattern)
   ============================================================ */
class BaseEntranceEffect {
  apply(el, text) {
    this.reset(el);
    el.className = 'floating-text viewer-floating-text';
    if (el.classList.contains('glow') === false && el.dataset.glow === 'true') {
      el.classList.add('glow');
    }
  }
  
  reset(el) {
    el.classList.remove('entrance-floatUp', 'entrance-fadeGlow', 'entrance-typewriter');
    el.style.animation = 'none';
    el.offsetHeight; // force reflow
    el.style.animation = '';
    
    if (el._typewriterInterval) {
      clearInterval(el._typewriterInterval);
    }
  }

  replay(el, text) {
    this.apply(el, text);
  }
}

class FloatUpEffect extends BaseEntranceEffect {
  apply(el, text) {
    super.apply(el, text);
    el.textContent = text;
    el.classList.add('entrance-floatUp');
  }
}

class FadeGlowEffect extends BaseEntranceEffect {
  apply(el, text) {
    super.apply(el, text);
    el.textContent = text;
    el.classList.add('entrance-fadeGlow');
  }
}

class TypewriterEffect extends BaseEntranceEffect {
  apply(el, text) {
    super.apply(el, text);
    el.textContent = '';
    el.classList.add('entrance-typewriter');
    
    let i = 0;
    el._typewriterInterval = setInterval(() => {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
      } else {
        clearInterval(el._typewriterInterval);
      }
    }, 60);
  }
}

class EntranceEffectFactory {
  static getEffect(effectName) {
    switch(effectName) {
      case 'typewriter': return new TypewriterEffect();
      case 'fadeGlow': return new FadeGlowEffect();
      case 'floatUp': 
      default: 
        return new FloatUpEffect();
    }
  }
}


/* ============================================================
   4. CryptoEngine
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
    let padded = str.replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) {
      padded += '=';
    }
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  return {
    encrypt(stateObj) {
      const textEncoder = new TextEncoder();
      const textBytes = textEncoder.encode(stateObj.text || '');
      
      const payload = new Uint8Array(3 + textBytes.length);
      
      const effectMap = { 'floatUp': 0, 'fadeGlow': 1, 'typewriter': 2 };
      const effectVal = effectMap[stateObj.effect] !== undefined ? effectMap[stateObj.effect] : 0;
      const glowVal = stateObj.glow ? 1 : 0;
      payload[0] = ((stateObj.theme & 0x07) << 5) | ((effectVal & 0x03) << 3) | ((stateObj.font & 0x03) << 1) | glowVal;
      
      const alignMap = { 'left': 0, 'center': 1, 'right': 2 };
      const alignVal = alignMap[stateObj.align] !== undefined ? alignMap[stateObj.align] : 1;
      const sizeOffset = Math.max(0, Math.min(63, (stateObj.size || 28) - 16));
      payload[1] = (sizeOffset << 2) | alignVal;
      
      const vignetteVal = stateObj.vignette ? 1 : 0;
      const langVal = stateObj.lang === 'en' ? 1 : 0;
      const persistMap = { 'none': 0, 'fireworks': 1, 'sparkle': 2 };
      const persistVal = persistMap[stateObj.persistEffect] || 0;
      payload[2] = (vignetteVal & 0x01) | ((langVal & 0x01) << 1) | ((persistVal & 0x03) << 2);
      
      payload.set(textBytes, 3);
      const xored = xorBytes(payload, KEY);
      return toBase64Url(xored);
    },
    decrypt(hash) {
      try {
        const bytes = fromBase64Url(hash);
        const xored = xorBytes(bytes, KEY);
        if (xored.length < 3) return null;
        
        const b1 = xored[0];
        const theme = (b1 >> 5) & 0x07;
        const effectCode = (b1 >> 3) & 0x03;
        const font = (b1 >> 1) & 0x03;
        const glow = (b1 & 0x01) === 1;
        const effectMap = ['floatUp', 'fadeGlow', 'typewriter'];
        const effect = effectMap[effectCode] || 'floatUp';
        
        const b2 = xored[1];
        const sizeOffset = (b2 >> 2) & 0x3F;
        const size = sizeOffset + 16;
        const alignCode = b2 & 0x03;
        const alignMap = ['left', 'center', 'right'];
        const align = alignMap[alignCode] || 'center';
        
        const b3 = xored[2];
        const vignette = (b3 & 0x01) === 1;
        const lang = ((b3 >> 1) & 0x01) === 1 ? 'en' : 'ko';
        const persistCode = (b3 >> 2) & 0x03;
        const persistEffect = ['none', 'fireworks', 'sparkle'][persistCode] || 'none';
        
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


/* ============================================================
   6. WebGLParticles
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
      const drawY = this.h - p.y; ctx.globalAlpha = alpha * 0.8; ctx.shadowBlur = p.size * 2;
      const rgb = `rgb(${Math.floor(p.r*255)},${Math.floor(p.g*255)},${Math.floor(p.b*255)})`;
      ctx.shadowColor = rgb; ctx.fillStyle = rgb;
      ctx.beginPath(); ctx.arc(p.x, drawY, Math.max(1, p.size / 2), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  }
}


/* ============================================================
   7. ViewController (Viewer Mode)
   ============================================================ */
class ViewController {
  constructor(state, i18nManager) {
    this.state = state;
    this.i18n = i18nManager;
    
    this.viewerView = document.getElementById('viewer-view');
    this.editorView = document.getElementById('editor-view');
    this.canvas = document.getElementById('viewer-canvas');
    this.textEl = document.getElementById('viewer-text');
    this.replayBtn = document.getElementById('viewer-replay-btn');
    
    this.shader = new BackgroundShader(this.canvas);
    this.particles = new WebGLParticles(this.viewerView);
  }

  init() {
    this.editorView.classList.add('hidden');
    this.viewerView.classList.remove('hidden');

    this.i18n.setLanguage(this.state.lang || 'ko');

    document.querySelector('.lang-selector')?.classList.add('hidden');
    document.querySelector('.update-selector')?.classList.add('hidden');

    this.renderText();
    this.setupGraphics();
    this.bindEvents();
  }

  renderText() {
    this.textEl.style.fontFamily = Config.FONTS[this.state.font || 0];
    this.textEl.style.fontSize = (this.state.size || 28) + 'px';
    this.textEl.style.textAlign = this.state.align || 'center';
    
    // Pass user's glow setting as a data attribute or direct class handling
    if (this.state.glow) {
      this.textEl.classList.add('glow');
      this.textEl.dataset.glow = 'true';
    } else {
      this.textEl.classList.remove('glow');
      this.textEl.dataset.glow = 'false';
    }

    const effect = EntranceEffectFactory.getEffect(this.state.effect || 'floatUp');
    effect.apply(this.textEl, this.state.text || '');
  }

  setupGraphics() {
    this.shader.setTheme(this.state.theme || 0);
    this.shader.setVignette(this.state.vignette !== undefined ? this.state.vignette : false);
    this.shader.start();

    this.particles.setMode(this.state.persistEffect || 'none');
    this.particles.start();

    window.addEventListener('resize', () => { 
      this.shader.resize(); 
      this.particles.resize(); 
    });
  }

  bindEvents() {
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        const effect = EntranceEffectFactory.getEffect(this.state.effect || 'floatUp');
        effect.replay(this.textEl, this.state.text || '');
        this.particles.reset();
      });
    }
  }
}


/* ============================================================
   8. EditorController (Editor Mode)
   ============================================================ */
class EditorController {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    
    // State
    this.state = {
      theme: 0,
      effect: 'floatUp',
      persistEffect: 'none',
      align: 'center',
      font: 0,
      size: 28,
      glow: true,
      vignette: false,
      text: '',
      isUserModified: false
    };

    // DOM Elements
    this.ui = {
      textInput: document.getElementById('text-input'),
      charCount: document.getElementById('current-char-count'),
      themeSelector: document.getElementById('theme-selector'),
      fontSelect: document.getElementById('font-family'),
      fontSizeInput: document.getElementById('font-size'),
      fontSizeVal: document.getElementById('font-size-val'),
      alignBtns: document.querySelectorAll('.align-btn'),
      effectBtns: document.querySelectorAll('#effect-selector .effect-btn'),
      persistBtns: document.querySelectorAll('#persist-selector .effect-btn'),
      glowToggle: document.getElementById('text-glow'),
      vignetteToggle: document.getElementById('bg-vignette'),
      previewText: document.getElementById('preview-text'),
      shareBtn: document.getElementById('share-btn'),
      shareResult: document.getElementById('share-result'),
      shareUrlInput: document.getElementById('share-url'),
      copyBtn: document.getElementById('copy-btn'),
      previewReplayBtn: document.getElementById('preview-replay-btn'),
      langBtn: document.getElementById('lang-btn'),
      updateBtn: document.getElementById('update-btn'),
      previewCanvas: document.getElementById('preview-canvas'),
      previewContainer: document.getElementById('preview-container')
    };

    // Graphics
    this.shader = new BackgroundShader(this.ui.previewCanvas);
    this.particles = new WebGLParticles(this.ui.previewContainer);
  }

  init() {
    this.i18n.setLanguage('ko');
    this.state.text = Config.THEMES[0].defaultText['ko'];
    this.ui.textInput.value = this.state.text;
    
    this.renderThemeButtons();
    this.bindEvents();
    
    this.shader.setTheme(this.state.theme);
    this.shader.setVignette(this.state.vignette);
    this.shader.start();
    
    this.particles.setMode(this.state.persistEffect);
    this.particles.start();
    
    window.addEventListener('resize', () => { 
      this.shader.resize(); 
      this.particles.resize(); 
    });

    this.syncPreview();
    this.triggerEntranceEffect();
  }

  bindEvents() {
    // Input Sync
    this.ui.textInput.addEventListener('input', () => {
      this.state.text = this.ui.textInput.value;
      this.state.isUserModified = this.state.text.trim() !== '';
      this.syncPreview();
    });

    // Typography
    this.ui.fontSelect.addEventListener('change', () => {
      this.state.font = parseInt(this.ui.fontSelect.value);
      this.ui.previewText.style.fontFamily = Config.FONTS[this.state.font];
    });

    this.ui.fontSizeInput.addEventListener('input', () => {
      this.state.size = parseInt(this.ui.fontSizeInput.value);
      this.ui.fontSizeVal.textContent = this.state.size + 'px';
      this.ui.previewText.style.fontSize = this.state.size + 'px';
    });

    this.ui.alignBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.ui.alignBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.align = btn.dataset.align;
        this.ui.previewText.style.textAlign = this.state.align;
      });
    });

    // Effects
    this.ui.effectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.ui.effectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.effect = btn.dataset.effect;
        this.triggerEntranceEffect();
      });
    });

    this.ui.persistBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.ui.persistBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.persistEffect = btn.dataset.persist;
        this.particles.setMode(this.state.persistEffect);
      });
    });

    // Toggles
    this.ui.glowToggle.addEventListener('change', () => {
      this.state.glow = this.ui.glowToggle.checked;
      this.ui.previewText.classList.toggle('glow', this.state.glow);
      this.ui.previewText.dataset.glow = this.state.glow ? 'true' : 'false';
    });
    this.ui.previewText.dataset.glow = 'true';

    this.ui.vignetteToggle.addEventListener('change', () => {
      this.state.vignette = this.ui.vignetteToggle.checked;
      this.shader.setVignette(this.state.vignette);
    });

    // Replay
    if (this.ui.previewReplayBtn) {
      this.ui.previewReplayBtn.addEventListener('click', () => {
        this.triggerEntranceEffect();
        this.particles.reset();
      });
    }

    // Language change
    this.ui.langBtn.addEventListener('click', () => {
      this.i18n.toggleLanguage();
    });

    this.i18n.onChange((lang) => {
      this.renderThemeButtons();
      if (!this.state.isUserModified) {
        this.state.text = Config.THEMES[this.state.theme].defaultText[lang];
        this.ui.textInput.value = this.state.text;
        this.syncPreview();
        this.triggerEntranceEffect();
      } else if (this.ui.textInput.value === '') {
        this.syncPreview();
      }
    });

    // Share & Copy
    this.ui.shareBtn.addEventListener('click', () => this.generateShareLink());
    this.ui.copyBtn.addEventListener('click', () => this.copyShareLink());

    // Update (Hard refresh)
    if (this.ui.updateBtn) {
      this.ui.updateBtn.addEventListener('click', () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('t', Date.now());
        if ('caches' in window) {
          caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
            .finally(() => window.location.href = currentUrl.toString());
        } else {
          window.location.href = currentUrl.toString();
        }
      });
    }
  }

  setTheme(index) {
    this.state.theme = index;
    this.shader.setTheme(index);
    
    // Update active button state
    this.ui.themeSelector.querySelector('.active')?.classList.remove('active');
    this.ui.themeSelector.querySelectorAll('.theme-btn')[index]?.classList.add('active');

    if (!this.state.isUserModified) {
      this.state.text = Config.THEMES[index].defaultText[this.i18n.lang];
      this.ui.textInput.value = this.state.text;
      this.syncPreview();
      this.triggerEntranceEffect();
    }
  }

  renderThemeButtons() {
    this.ui.themeSelector.innerHTML = '';
    Config.THEMES.forEach((theme, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `theme-btn ${i === this.state.theme ? 'active' : ''}`;
      btn.style.background = theme.previewGradient;
      btn.dataset.label = theme.label[this.i18n.lang];
      btn.addEventListener('click', () => this.setTheme(i));
      this.ui.themeSelector.appendChild(btn);
    });
  }

  syncPreview() {
    const displayStr = this.state.text || this.i18n.get('placeholder-text');
    this.ui.previewText.textContent = displayStr;
    this.ui.charCount.textContent = this.state.text.length;
  }

  triggerEntranceEffect() {
    const effect = EntranceEffectFactory.getEffect(this.state.effect);
    const displayStr = this.state.text || this.i18n.get('placeholder-text');
    effect.replay(this.ui.previewText, displayStr);
  }

  generateShareLink() {
    const payload = {
      ...this.state,
      lang: this.i18n.lang
    };
    const encrypted = CryptoEngine.encrypt(payload);
    const base = window.location.origin + window.location.pathname;
    this.ui.shareUrlInput.value = base + '#' + encrypted;
    this.ui.shareResult.classList.remove('hidden');
  }

  copyShareLink() {
    navigator.clipboard.writeText(this.ui.shareUrlInput.value).then(() => {
      const icon = this.ui.copyBtn.querySelector('i');
      icon.className = 'fa-solid fa-check';
      this.ui.copyBtn.style.color = '#10b981';
      setTimeout(() => { 
        icon.className = 'fa-solid fa-copy'; 
        this.ui.copyBtn.style.color = ''; 
      }, 1500);
    });
  }
}


/* ============================================================
   9. Application Entry Point
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const i18nManager = new I18nManager('ko');

  const hashData = window.location.hash.slice(1);
  if (hashData) {
    const state = CryptoEngine.decrypt(hashData);
    if (state) {
      const viewer = new ViewController(state, i18nManager);
      viewer.init();
      return; 
    }
  }

  const editor = new EditorController(i18nManager);
  editor.init();
});
