/* ============================================================
   4. CryptoEngine
   ============================================================ */
window.FTS = window.FTS || {};
FTS.CryptoEngine = (() => {
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
