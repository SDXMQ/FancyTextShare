# ✨ FancyTextShare

🌎 **[한국어 버전](./README.md)**

FancyTextShare is a **premium serverless text card creation and sharing web service** that styles your text with dreamy and beautiful emotional designs, shareable via a single link.

As a static web application, it operates without any database or server. With just **a single line of URL**, you can perfectly deliver your written text and background shader graphics to others.

---

## 🎨 Key Features

### 1. Cinematic WebGL Shaders (Three.js)
Instead of generic gradients or heavy images, it features a high-performance **Three.js-based GLSL Fragment Shader** graphics engine.
* **Starry Night**: The gentle flow of the Milky Way along with meteor showers of random sizes and speeds falling diagonally across the night sky.
* **Dawn**: Firefly particles floating freely in 360 degrees on a gentle breeze over purple-red twilight horizons.
* **Morning**: Drifting 3D cloud noise over a fresh morning sky.
* **Sunset**: Sunset cloud textures based on noise algorithms.
* **Aurora**: A realistic green and blue aurora curtain dancing under the night sky.
* **Deep Sea**: Sea caustics along with organically distorting bubbles floating up subtly.
* **Live Weather**: An interactive theme that requests location consent, integrates with the Open-Meteo API, and dynamically maps weather (rain/snow particle animations) and time of day (day/night/twilight) to the background in real-time.

### 2. Hybrid Overlay & Mobile Responsive Optimization
* **Hybrid Rendering**: Instead of rendering heavy or low-resolution 3D text in WebGL, Three.js processes the background visual effects, while the text and entrance motion effects are managed in the top DOM layer.
* **Mobile Responsive UI**: Utilizing CSS media queries, the text menus on desktop automatically switch to compact circular icons on mobile or narrow screens, providing a clean experience without blocking titles or content.
* **Performance Control**: To prevent battery drain and overheating on older mobile devices, WebGL rendering resolution is capped below 1.5x `devicePixelRatio`, ensuring smooth 60fps animations.
* **Fallback 2D Mode**: If WebGL is unsupported or Three.js is blocked, the app automatically and gracefully rolls back to Canvas 2D gradient mode, ensuring high accessibility.

### 3. Serverless Shortened Sharing URL Technology
* Typically, encoding settings and text directly into a URL results in extremely long links that might break or fail to load across different devices.
* FancyTextShare uses a lightweight technology that compresses options (theme, font, size, alignment, text glow, vignette, etc.) into a **3-byte binary header**, performs a XOR operation, and encodes it into Base64URL.
* This allows sharing cards as **short URLs of about 50 characters** without requiring any database storage.

### 4. Robust Object-Oriented (OOP) Architecture
* **No-Build File Splitting Structure**: No complex build tools or local web servers are required. The modular source files in the `js/` directory are loaded sequentially, preserving the ability to run offline instantly (via `file://` by double-clicking `index.html`).
* **Extensibility**: The codebase strictly adheres to the Single Responsibility Principle (SRP). It features an encapsulated `I18nManager` for multi-language support, an `EntranceEffectFactory` implementing the Strategy Pattern for visual effects, and `EditorController`/`ViewController` classes controlling the UI lifecycles, making it highly maintainable and extensible.

---

## ⚙️ Customization Options

* **Text Input**: Supports up to 300 characters with a real-time character counter.
* **Background Theme**: Choose from Starry Night, Dawn, Morning, Sunset, Aurora, Deep Sea, and Live Weather.
* **Entrance Effect**:
  * `Float Up`: A gentle 3D motion rising from bottom to top.
  * `Fade Glow`: Text gradually appears from fog along with a glowing light.
  * `Typewriter`: Typographical typewriter motion printing characters one by one.
* **Style & Typography**:
  * Font selection (Outfit Modern, Playfair Serif, Fira Code Tech)
  * Real-time text size slider (16px ~ 56px)
  * Left/Center/Right alignment buttons
  * **Text Glow** ON/OFF toggle
  * **Vignette Effect** (darkens the corners of the card) ON/OFF toggle

---

## 🚀 How to Use

### For Card Creators
1. Type your message in the input text area. (If left blank, custom placeholder quotes matching each background theme will be displayed.)
2. Customize your card using the **Background Themes**, **Entrance Effects**, and **Style Options** at the bottom.
3. Once satisfied, click the **`Generate Share Link`** button.
4. The generated link is copied to your clipboard. Send it to your loved ones via messenger or social media.

### For Link Receivers
* Open the link, and the configured shader graphic effects along with the styled text will immediately animate in full screen.
* Click the **`Create Mine`** button on the bottom right to create and share your own card at any time.

---

## 📂 Project Structure

```text
FancyTextShare/
├── .github/
│   └── workflows/
│       └── static.yml    # GitHub Pages Actions automation
├── js/                   # Modular JavaScript files split by responsibility
│   ├── config.js         # Configuration data and theme list definition
│   ├── i18n.js           # Multi-language translations manager (I18nManager)
│   ├── effects.js        # Text entrance animation strategy classes
│   ├── crypto.js         # Encryption engine for sharing hash encoding/decoding (CryptoEngine)
│   ├── shader.js         # Three.js background shader renderer (BackgroundShader)
│   ├── particles.js      # Three.js particle effect renderer (WebGLParticles)
│   ├── weather.js        # Live weather fetch and mapping manager (WeatherManager)
│   └── main.js           # Editor/Viewer controllers and DOM entry point
├── index.html            # Main markup with semantic structure and SEO optimization
├── README.md             # Project introduction document (Korean)
└── style.css             # Glassmorphism styling and modern UI CSS
```

---

## 🛠️ Development & Local Run

This project requires absolutely no setup or build steps!

1. Clone this repository or download the ZIP.
2. Double-click or open `index.html` in your web browser (Chrome, Safari, Firefox, etc.) to start creating cards locally.

---

## 📝 Update Log

### 2026-06-24
* **Added Location-based "Live Weather" Theme**
  - **Improved Location Consent Flow**: Instead of calling the native browser permission prompt directly, a custom glassmorphism modal is shown first to reduce user friction. Consent state is cached in `localStorage` so returning users bypass this modal.
  - **Open-Meteo API Integration**: Fetches weather data using the receiver's coordinates without needing an API key.
  - **Real-time Weather Particles**: Overlays fast-falling rain particles for rainy weather, and swaying snowflake particles for snowy weather on top of the WebGL canvas.
  - **Time-of-day Adaptive Background**: Detects the current hour (`new Date().getHours()`) and dynamically maps matching shaders (Morning, Sunset, Dawn, Starry Night) corresponding to day, night, or twilight.
  - **Creator Preview Support & Memory Caching (WYSIWYG)**: Refactored the weather logic to allow the creator (Editor Mode) to also view real-time local weather in their preview area. Additionally, cached the fetched weather code (`cachedCode`) in memory to ensure instant theme rendering when switching back and forth between themes without geolocation or API delays.
* **Codebase Modularization & Refactoring**
  - **Monolithic to Modular**: Split the single ~1,300-line `app.js` file into 8 dedicated files in the `js/` directory (`config.js`, `i18n.js`, `effects.js`, `crypto.js`, `shader.js`, `particles.js`, `weather.js`, `main.js`) based on specific responsibilities to maximize readability and maintainability.
  - **Preserved Offline Execution**: Retained a sequential script-loading method instead of CORS-restricted modules, ensuring that double-clicking `index.html` (via `file://` protocol) works out-of-the-box locally without needing any build tools or web servers.
  - **Performance & Deployment**: Leveraged HTTP/2 parallel downloads for script resources so there is no performance penalty, and kept compatibility with the existing GitHub Actions deployment workflow without any changes.
