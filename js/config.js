/* ============================================================
   1. Configuration & Constants
   ============================================================ */
window.FTS = window.FTS || {};
FTS.Config = {
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
    },
    {
      id: 'realtimeWeather',
      label: { ko: '현재날씨 🌦️', en: 'Live Weather 🌦️' },
      bgGradient: ['#3a7bd5', '#3a6073'],
      previewGradient: 'linear-gradient(135deg, #3a7bd5, #00d2ff)',
      particles: 'weather',
      defaultText: { ko: '오늘 그대 곁의 하늘은 어떤가요', en: 'How is the sky beside you today' }
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
      'persist-sparkle': '반짝이',
      'consent-title': '위치 정보 사용 안내',
      'consent-body': '이 카드는 당신이 있는 곳의 실시간 날씨를 배경에 반영합니다. 위치 정보 사용을 허용해 주시겠어요?',
      'consent-allow': '허용할게요',
      'consent-deny': '괜찮아요',
      'weather-error': '위치 정보 수신 또는 날씨 조회가 실패하여 기본 테마로 표시됩니다.'
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
      'persist-sparkle': 'Sparkle',
      'consent-title': 'Location Access',
      'consent-body': 'This card reflects the live weather at your location. Would you allow location access?',
      'consent-allow': 'Allow',
      'consent-deny': 'No thanks',
      'weather-error': 'Failed to fetch live weather. Showing default theme.'
    }
  }
};
