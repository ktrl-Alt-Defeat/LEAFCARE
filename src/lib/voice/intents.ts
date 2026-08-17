/**
 * Turns a spoken sentence into something the app can actually do.
 *
 * Deliberately a keyword matcher rather than a model call: the vocabulary here
 * is small and closed (twelve destinations and a handful of questions), a
 * farmer standing in a field should not wait on a second network round-trip
 * after transcription, and matching offline means the assistant still works
 * when only transcription succeeded.
 *
 * Keywords are listed in all six app languages because the transcript comes
 * back in whatever language was spoken, not in English.
 */

export type VoiceIntentId =
  | 'scan'
  | 'weather'
  | 'market'
  | 'community'
  | 'knowledge'
  | 'catalog'
  | 'crops'
  | 'profile'
  | 'language'
  | 'tools'
  | 'home'
  | 'howItWorks'
  | 'about'
  | 'help';

export interface VoiceIntent {
  id: VoiceIntentId;
  /** Where to navigate, when the intent is a destination. */
  route?: string;
  /** Spoken and displayed answer. Looked up in TRANSLATIONS, with this fallback. */
  replyKey: string;
  replyFallback: string;
  /**
   * Words that settle the intent on their own, outranking any amount of
   * incidental overlap elsewhere.
   *
   * Without this, "scan my crop" loses to the crop-list intent: "my crop" is
   * seven characters of generic possessive and "scan" is four characters of
   * unambiguous instruction, so length alone gets it backwards. A decisive word
   * is one that a farmer would only say when they mean this and nothing else.
   */
  decisive?: string[];
  /** Supporting phrases, weighted by how much of the sentence they explain. */
  keywords: string[];
}

/**
 * Order matters only as a tie-break: the more specific intents come first, so
 * "crop catalogue" beats a bare "crop" when both score the same.
 */
export const VOICE_INTENTS: VoiceIntent[] = [
  {
    id: 'scan',
    route: '/scan',
    replyKey: 'voiceReplyScan',
    replyFallback: 'Opening the camera. Hold a single affected leaf steady in the frame.',
    decisive: [
      'scan', 'camera', 'photo', 'picture', 'diagnose', 'diagnosis',
      'ஸ்கேன்', 'கேமரா', 'படம்',
      'स्कैन', 'कैमरा', 'फोटो',
      'స్కాన్', 'కెమెరా', 'ఫోటో',
      'സ്കാൻ', 'ക്യാമറ', 'ഫോട്ടോ',
      'ಸ್ಕ್ಯಾನ್', 'ಕ್ಯಾಮೆರಾ', 'ಫೋಟೋ',
    ],
    keywords: [
      'disease', 'infected', 'sick plant', 'check my crop', 'check crop', 'leaf spot', 'blight',
      'நோய்', 'இலை',
      'बीमारी', 'रोग', 'पत्ती',
      'వ్యాధి', 'ఆకు',
      'രോഗം', 'ഇല',
      'ರೋಗ', 'ಎಲೆ',
    ],
  },
  {
    id: 'weather',
    route: '/home',
    replyKey: 'voiceReplyWeather',
    replyFallback:
      'Here is your local forecast, with the spraying window for today at the top of the home screen.',
    keywords: [
      'weather', 'forecast', 'rain', 'rainfall', 'temperature', 'humidity', 'wind',
      'spray today', 'spraying', 'irrigate', 'watering today',
      'வானிலை', 'மழை', 'வெப்பநிலை', 'காற்று',
      'मौसम', 'बारिश', 'तापमान', 'नमी', 'हवा',
      'వాతావరణం', 'వర్షం', 'ఉష్ణోగ్రత',
      'കാലാവസ്ഥ', 'മഴ', 'താപനില',
      'ಹವಾಮಾನ', 'ಮಳೆ', 'ತಾಪಮಾನ',
    ],
  },
  {
    id: 'tools',
    route: '/home',
    replyKey: 'voiceReplyTools',
    replyFallback:
      'The farming tools are on the home screen: a pesticide dosage calculator, a sowing calendar, and a spray weather check.',
    keywords: [
      'tool', 'tools', 'calculator', 'dosage', 'dose', 'how much pesticide', 'sowing calendar',
      'planting calendar', 'spray window', 'spray weather',
      'கருவி', 'கணக்கீடு', 'அளவு',
      'औजार', 'उपकरण', 'कैलकुलेटर', 'मात्रा', 'बुवाई',
      'పరికరం', 'లెక్కింపు', 'మోతాదు',
      'ഉപകരണം', 'കണക്കുകൂട്ടൽ', 'അളവ്',
      'ಸಾಧನ', 'ಲೆಕ್ಕಾಚಾರ', 'ಪ್ರಮಾಣ',
    ],
  },
  {
    id: 'market',
    route: '/market',
    replyKey: 'voiceReplyMarket',
    replyFallback: 'Opening the marketplace — seeds, fertilizers, crop protection and tools from verified sellers.',
    keywords: [
      'market', 'marketplace', 'buy', 'shop', 'price', 'cost', 'seed', 'seeds', 'fertilizer',
      'fertiliser', 'pesticide to buy', 'product', 'order',
      'சந்தை', 'விலை', 'விதை', 'உரம்', 'வாங்க',
      'बाजार', 'बाज़ार', 'खरीद', 'दाम', 'कीमत', 'बीज', 'खाद',
      'మార్కెట్', 'ధర', 'విత్తనం', 'ఎరువు',
      'മാർക്കറ്റ്', 'വില', 'വിത്ത്', 'വളം',
      'ಮಾರುಕಟ್ಟೆ', 'ಬೆಲೆ', 'ಬೀಜ', 'ಗೊಬ್ಬರ',
    ],
  },
  {
    id: 'community',
    route: '/community',
    replyKey: 'voiceReplyCommunity',
    replyFallback: 'Opening the community, where farmers near you share problems and answers.',
    keywords: [
      'community', 'forum', 'other farmers', 'farmers', 'discussion', 'ask farmers', 'post',
      'சமூகம்', 'விவசாயி', 'விவசாயிகள்',
      'समुदाय', 'किसान', 'चर्चा',
      'సంఘం', 'రైతు', 'రైతులు',
      'കമ്മ്യൂണിറ്റി', 'കർഷക', 'കർഷകർ',
      'ಸಮುದಾಯ', 'ರೈತ', 'ರೈತರು',
    ],
  },
  {
    id: 'knowledge',
    route: '/knowledge',
    replyKey: 'voiceReplyKnowledge',
    replyFallback: 'Opening the knowledge base — practical guides written by agronomists.',
    keywords: [
      'knowledge', 'article', 'articles', 'guide', 'guides', 'learn', 'read about', 'how to grow',
      'tips', 'advice',
      'அறிவு', 'கட்டுரை', 'வழிகாட்டி', 'கற்று',
      'ज्ञान', 'लेख', 'जानकारी', 'सीख',
      'జ్ఞానం', 'వ్యాసం', 'సమాచారం',
      'അറിവ്', 'ലേഖനം', 'വിവരം',
      'ಜ್ಞಾನ', 'ಲೇಖನ', 'ಮಾಹಿತಿ',
    ],
  },
  {
    id: 'catalog',
    route: '/catalog',
    replyKey: 'voiceReplyCatalog',
    replyFallback:
      'Opening the crop catalogue — soil, pH, spacing, nutrients and companion planting for every crop.',
    keywords: [
      'catalog', 'catalogue', 'crop library', 'agronomy', 'soil', 'ph', 'spacing', 'nutrient',
      'companion', 'reference sheet',
      'பயிர் நூலகம்', 'மண்',
      'फसल पुस्तकालय', 'मिट्टी', 'पोषक',
      'పంట గ్రంథాలయం', 'నేల',
      'വിള ലൈബ്രറി', 'മണ്ണ്',
      'ಬೆಳೆ ಗ್ರಂಥಾಲಯ', 'ಮಣ್ಣು',
    ],
  },
  {
    id: 'crops',
    route: '/crops',
    replyKey: 'voiceReplyCrops',
    replyFallback: 'Opening your crop list, where you can add or remove the crops you grow.',
    keywords: [
      // "my crop" rather than "my crops": it matches both, where listing the two
      // would score a plural twice and let this intent outrank a real command.
      'my crop', 'select crop', 'change crop', 'add crop', 'remove crop', 'crop list',
      'என் பயிர்', 'பயிர் தேர்வு',
      'मेरी फसल', 'फसल चुन',
      'నా పంట', 'పంట ఎంపిక',
      'എന്റെ വിള', 'വിള തിരഞ്ഞെടു',
      'ನನ್ನ ಬೆಳೆ', 'ಬೆಳೆ ಆಯ್ಕೆ',
    ],
  },
  {
    id: 'profile',
    route: '/profile',
    replyKey: 'voiceReplyProfile',
    replyFallback: 'Opening your profile and settings.',
    keywords: [
      'profile', 'account', 'my details', 'settings', 'my name', 'my phone', 'farm size',
      'சுயவிவரம்', 'அமைப்பு',
      'प्रोफ़ाइल', 'प्रोफाइल', 'खाता', 'सेटिंग',
      'ప్రొఫైల్', 'ఖాతా', 'సెట్టింగ',
      'പ്രൊഫൈൽ', 'അക്കൗണ്ട്', 'ക്രമീകരണ',
      'ಪ್ರೊಫೈಲ್', 'ಖಾತೆ', 'ಸೆಟ್ಟಿಂಗ',
    ],
  },
  {
    id: 'language',
    route: '/language',
    replyKey: 'voiceReplyLanguage',
    replyFallback: 'Opening language settings. LeafCare speaks English, Tamil, Hindi, Telugu, Malayalam and Kannada.',
    keywords: [
      'language', 'change language', 'speak in', 'english', 'tamil', 'hindi', 'telugu',
      'malayalam', 'kannada',
      'மொழி', 'தமிழ்',
      'भाषा', 'हिन्दी', 'हिंदी',
      'భాష', 'తెలుగు',
      'ഭാഷ', 'മലയാളം',
      'ಭಾಷೆ', 'ಕನ್ನಡ',
    ],
  },
  {
    id: 'home',
    route: '/home',
    replyKey: 'voiceReplyHome',
    replyFallback: 'Taking you to the home screen.',
    keywords: [
      'home', 'dashboard', 'main screen', 'go back', 'start screen',
      'முகப்பு', 'வீடு',
      'होम', 'मुख्य', 'घर',
      'హోమ్', 'ముఖ్య',
      'ഹോം', 'പ്രധാന',
      'ಹೋಮ್', 'ಮುಖ್ಯ',
    ],
  },
  {
    id: 'howItWorks',
    replyKey: 'voiceReplyHowItWorks',
    replyFallback:
      'LeafCare works in three steps. Pl@ntNet identifies the plant from your photo. If it is one of the supported crops, an EfficientNet model checks the leaf for disease. Then the app shows symptoms, immediate steps, and organic and chemical treatment options. Weather comes from Open-Meteo, and this voice is powered by ElevenLabs.',
    keywords: [
      'how does it work', 'how does this work', 'how it works', 'technology', 'technologies',
      'which model', 'what model', 'artificial intelligence', 'how accurate', 'how do you know',
      'எப்படி வேலை', 'தொழில்நுட்ப',
      'कैसे काम', 'तकनीक', 'तकनीकी',
      'ఎలా పని', 'సాంకేతిక',
      'എങ്ങനെ പ്രവർത്തി', 'സാങ്കേതിക',
      'ಹೇಗೆ ಕೆಲಸ', 'ತಂತ್ರಜ್ಞಾನ',
    ],
  },
  {
    id: 'about',
    replyKey: 'voiceReplyAbout',
    replyFallback:
      'LeafCare is a farming assistant. Photograph a leaf to find out what is wrong with it, check the local weather and spraying window, look up crops and guides, buy supplies, and ask other farmers. Everything is available in six languages, and every block of text can be read aloud.',
    keywords: [
      'what is leafcare', 'about leafcare', 'about this app', 'who are you', 'what can you do',
      'what can this app do', 'introduce',
      'என்ன செய்ய',
      'क्या है', 'क्या कर सकते',
      'ఏమిటి', 'ఏమి చేయ',
      'എന്താണ്', 'എന്ത് ചെയ്യ',
      'ಏನು', 'ಏನು ಮಾಡ',
    ],
  },
  {
    id: 'help',
    replyKey: 'voiceReplyHelp',
    replyFallback:
      'Try saying: scan my crop, show the weather, open the market, find guides, or how does it work.',
    keywords: [
      'help', 'what can i say', 'commands', 'guide me', 'tour', 'how to use',
      'உதவி', 'எப்படி பயன்படுத்த',
      'मदद', 'सहायता', 'कैसे उपयोग',
      'సహాయం', 'ఎలా ఉపయోగించ',
      'സഹായം', 'എങ്ങനെ ഉപയോഗിക്ക',
      'ಸಹಾಯ', 'ಹೇಗೆ ಬಳಸ',
    ],
  },
];

/**
 * Lower-cases and strips punctuation so "Scan my crop!" and "scan my crop"
 * score alike. Includes the Devanagari danda, which Scribe emits at the end of
 * Hindi sentences and which would otherwise glue itself to the last word.
 */
const normalize = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[.,!?;:"'()[\]{}।॥]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export interface VoiceMatch {
  intent: VoiceIntent;
  /** Roughly how much of the sentence the match accounts for, 0–1. */
  confidence: number;
}

/**
 * Picks the best intent for a transcript, or null when nothing matches.
 *
 * Two rules, in order:
 *  1. an intent whose `decisive` word appears beats one without, whatever the
 *     scores — "scan my crop" is a scan, not a visit to the crop list;
 *  2. otherwise the higher score wins, where score is total matched keyword
 *     length. Length rather than count, so a specific phrase ("crop library")
 *     outranks an incidental word ("crop") inside a longer sentence.
 *
 * Comparisons are strictly greater, so an exact tie goes to the intent declared
 * first — which is why the list is ordered most-specific first.
 */
export const resolveVoiceIntent = (transcript: string): VoiceMatch | null => {
  const haystack = normalize(transcript);
  if (!haystack) return null;

  let best: VoiceIntent | null = null;
  let bestScore = 0;
  let bestDecisive = false;

  for (const intent of VOICE_INTENTS) {
    let score = 0;
    let decisive = false;

    for (const keyword of intent.decisive ?? []) {
      const needle = normalize(keyword);
      if (needle && haystack.includes(needle)) {
        score += needle.length;
        decisive = true;
      }
    }

    for (const keyword of intent.keywords) {
      const needle = normalize(keyword);
      if (needle && haystack.includes(needle)) {
        score += needle.length;
      }
    }

    if (score === 0) continue;

    const wins = decisive === bestDecisive ? score > bestScore : decisive;

    if (!best || wins) {
      best = intent;
      bestScore = score;
      bestDecisive = decisive;
    }
  }

  if (!best) return null;

  return { intent: best, confidence: Math.min(bestScore / haystack.length, 1) };
};
