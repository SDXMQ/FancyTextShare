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
