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
    
    this.shader = new FTS.BackgroundShader(this.canvas);
    this.particles = new FTS.WebGLParticles(this.viewerView);
  }

  init() {
    this.editorView.classList.add('hidden');
    this.viewerView.classList.remove('hidden');

    this.i18n.setLanguage(this.state.lang || 'ko');

    document.querySelector('.lang-selector')?.classList.add('hidden');
    document.querySelector('.update-selector')?.classList.add('hidden');

    this.renderText();
    this.bindEvents();

    // Weather theme (index 6) needs async location/weather resolution
    if (this.state.theme === 6) {
      this.setupGraphics(2, 'none');
      FTS.WeatherManager.init(this.shader, this.particles);
    } else {
      this.setupGraphics();
    }
  }

  renderText() {
    this.textEl.style.fontFamily = FTS.Config.FONTS[this.state.font || 0];
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

    const effect = FTS.EntranceEffectFactory.getEffect(this.state.effect || 'floatUp');
    effect.apply(this.textEl, this.state.text || '');
  }

  setupGraphics(themeOverride, particleOverride) {
    this.shader.setTheme(themeOverride !== undefined ? themeOverride : (this.state.theme || 0));
    this.shader.setVignette(this.state.vignette !== undefined ? this.state.vignette : false);
    this.shader.start();

    this.particles.setMode(particleOverride || this.state.persistEffect || 'none');
    this.particles.start();

    window.addEventListener('resize', () => { 
      this.shader.resize(); 
      this.particles.resize(); 
    });
  }



  bindEvents() {
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        const effect = FTS.EntranceEffectFactory.getEffect(this.state.effect || 'floatUp');
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
    this.shader = new FTS.BackgroundShader(this.ui.previewCanvas);
    this.particles = new FTS.WebGLParticles(this.ui.previewContainer);
  }

  init() {
    this.i18n.setLanguage('ko');
    this.state.text = FTS.Config.THEMES[0].defaultText['ko'];
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
      this.ui.previewText.style.fontFamily = FTS.Config.FONTS[this.state.font];
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
        this.state.text = FTS.Config.THEMES[this.state.theme].defaultText[lang];
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
    
    // Update active button state
    this.ui.themeSelector.querySelector('.active')?.classList.remove('active');
    this.ui.themeSelector.querySelectorAll('.theme-btn')[index]?.classList.add('active');

    if (index === 6) {
      FTS.WeatherManager.init(this.shader, this.particles);
    } else {
      this.shader.setTheme(index);
      // Restore default persistent particle effect for other themes
      this.particles.setMode(this.state.persistEffect);
    }

    if (!this.state.isUserModified) {
      this.state.text = FTS.Config.THEMES[index].defaultText[this.i18n.lang];
      this.ui.textInput.value = this.state.text;
      this.syncPreview();
      this.triggerEntranceEffect();
    }
  }

  renderThemeButtons() {
    this.ui.themeSelector.innerHTML = '';
    FTS.Config.THEMES.forEach((theme, i) => {
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
    const effect = FTS.EntranceEffectFactory.getEffect(this.state.effect);
    const displayStr = this.state.text || this.i18n.get('placeholder-text');
    effect.replay(this.ui.previewText, displayStr);
  }

  generateShareLink() {
    const payload = {
      ...this.state,
      lang: this.i18n.lang
    };
    const encrypted = FTS.CryptoEngine.encrypt(payload);
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
  const i18nManager = new FTS.I18nManager('ko');
  window.FTS = window.FTS || {};
  FTS.i18n = i18nManager;

  const hashData = window.location.hash.slice(1);
  if (hashData) {
    const state = FTS.CryptoEngine.decrypt(hashData);
    if (state) {
      const viewer = new ViewController(state, i18nManager);
      viewer.init();
      return; 
    }
  }

  const editor = new EditorController(i18nManager);
  editor.init();
});
