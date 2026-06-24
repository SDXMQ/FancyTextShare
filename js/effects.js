/* ============================================================
   3. Entrance Effects (Strategy Pattern)
   ============================================================ */
window.FTS = window.FTS || {};
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
FTS.BaseEntranceEffect = BaseEntranceEffect;
FTS.FloatUpEffect = FloatUpEffect;
FTS.FadeGlowEffect = FadeGlowEffect;
FTS.TypewriterEffect = TypewriterEffect;
FTS.EntranceEffectFactory = EntranceEffectFactory;
