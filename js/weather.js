/* ============================================================
   6.5. WeatherManager (Live Weather Helpers)
   ============================================================ */
const WeatherManager = {
  cachedCode: null,

  init(shader, particles) {
    if (this.cachedCode !== null) {
      this.applyWeatherMapping(this.cachedCode, shader, particles);
      return;
    }

    // Start with morning theme as a placeholder while resolving
    shader.setTheme(2);
    particles.setMode('none');

    const hasConsent = localStorage.getItem('fts-location-consent') === 'true';
    if (hasConsent) {
      this.requestGeolocationAndApply(shader, particles);
    } else {
      this.showConsentModal(shader, particles);
    }
  },

  showConsentModal(shader, particles) {
    const modal = document.getElementById('location-consent-modal');
    if (!modal) { return; }
    modal.classList.remove('hidden');

    const allowBtn = document.getElementById('consent-allow');
    const denyBtn = document.getElementById('consent-deny');

    // Clone buttons to clear existing listeners
    const newAllowBtn = allowBtn.cloneNode(true);
    const newDenyBtn = denyBtn.cloneNode(true);
    allowBtn.parentNode.replaceChild(newAllowBtn, allowBtn);
    denyBtn.parentNode.replaceChild(newDenyBtn, denyBtn);

    newAllowBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      localStorage.setItem('fts-location-consent', 'true');
      this.requestGeolocationAndApply(shader, particles);
    }, { once: true });

    newDenyBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    }, { once: true });
  },

  requestGeolocationAndApply(shader, particles) {
    if (!navigator.geolocation) { return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => this.fetchWeather(pos.coords.latitude, pos.coords.longitude, shader, particles),
      () => { /* keep default */ }
    );
  },

  async fetchWeather(lat, lon, shader, particles) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      this.cachedCode = data.current.weather_code;
      this.applyWeatherMapping(this.cachedCode, shader, particles);
    } catch { /* keep default */ }
  },

  applyWeatherMapping(code, shader, particles) {
    const hour = new Date().getHours();
    const isNight = hour >= 21 || hour < 6;
    const isTwilight = (hour >= 6 && hour < 8) || (hour >= 18 && hour < 21);

    // WMO Weather Code × Time of Day → shader theme + particle mode
    let shaderTheme, particleMode;
    if (code === 0) {
      shaderTheme = isNight ? 0 : isTwilight ? 3 : 2;  // starryNight / sunset / morning
      particleMode = 'sparkle';
    } else if (code <= 3) {
      shaderTheme = isNight ? 0 : isTwilight ? 1 : 2;  // starryNight / dawn / morning
      particleMode = 'none';
    } else if (code <= 48) {
      shaderTheme = 4; particleMode = 'none';           // aurora
    } else if (code <= 67 || (code >= 80 && code <= 82) || code >= 95) {
      shaderTheme = 5; particleMode = 'rain';           // deepSea + rain
    } else if (code >= 71 && code <= 86) {
      shaderTheme = 0; particleMode = 'snow';           // starryNight + snow
    } else {
      shaderTheme = isNight ? 0 : 2; particleMode = 'none';
    }

    shader.setTheme(shaderTheme);
    particles.setMode(particleMode);
  }
};
