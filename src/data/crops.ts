import { Crop } from '@/types';

export const CROPS_DATA: Crop[] = [
  {
    id: 'rice',
    name: 'Rice',
    translatedNames: {
      en: 'Rice',
      ta: 'நெல்',
      hi: 'चावल / धान',
      te: 'వరి',
      ml: 'നെല്ല്',
      kn: 'ಅಕ್ಕಿ / ಭತ್ತ'
    },
    category: 'Cereals',
    icon: '🌾',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Staple cereal grain grown widely in paddy fields.'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    translatedNames: {
      en: 'Tomato',
      ta: 'தக்காளி',
      hi: 'टमाटर',
      te: 'టమోటా',
      ml: 'തക്കാളി',
      kn: 'ಟೊಮೆಟೊ'
    },
    category: 'Vegetables',
    icon: '🍅',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'High-value vegetable crop susceptible to blight and leaf spots.'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    translatedNames: {
      en: 'Wheat',
      ta: 'கோதுமை',
      hi: 'गेहूं',
      te: 'గోధుమ',
      ml: 'ഗോതമ്പ്',
      kn: 'ಗೋಧಿ'
    },
    category: 'Cereals',
    icon: '🌾',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Major food grain grown during rabi season.'
  },
  {
    id: 'potato',
    name: 'Potato',
    translatedNames: {
      en: 'Potato',
      ta: 'உருளைக்கிழங்கு',
      hi: 'आलू',
      te: 'బంగాళాదుంప',
      ml: 'ഉരുളക്കിഴങ്ങ്',
      kn: 'ಆಲೂಗಡ್ಡೆ'
    },
    category: 'Vegetables',
    icon: '🥔',
    color: 'bg-amber-100 text-amber-900 border-amber-400',
    description: 'Tuber crop prone to late blight and bacterial wilt.'
  },
  {
    id: 'apple',
    name: 'Apple',
    translatedNames: {
      en: 'Apple',
      ta: 'ஆப்பிள்',
      hi: 'सेब',
      te: 'యాపిల్',
      ml: 'ആപ്പിൾ',
      kn: 'ಸೇಬು'
    },
    category: 'Fruits',
    icon: '🍎',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Temperate fruit crop subject to scab and cedar rust.'
  },
  {
    id: 'banana',
    name: 'Banana',
    translatedNames: {
      en: 'Banana',
      ta: 'வாழை',
      hi: 'केला',
      te: 'అరటి',
      ml: 'വാഴ',
      kn: 'ಬಾಳೆ'
    },
    category: 'Fruits',
    icon: '🍌',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    description: 'Tropical fruit plant prone to Sigatoka leaf spot and Panama wilt.'
  },
  {
    id: 'corn',
    name: 'Corn (Maize)',
    translatedNames: {
      en: 'Corn (Maize)',
      ta: 'சோளம்',
      hi: 'मक्का',
      te: 'మొక్కజొన్న',
      ml: 'ചോളം',
      kn: 'ಮೆಕ್ಕೆಜೋಳ'
    },
    category: 'Cereals',
    icon: '🌽',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Versatile grain susceptible to leaf blight and rust.'
  },
  {
    id: 'bell_pepper',
    name: 'Bell Pepper',
    translatedNames: {
      en: 'Bell Pepper',
      ta: 'குடைமிளகாய்',
      hi: 'शिमला मिर्च',
      te: 'బెల్ పెప్పర్',
      ml: 'ക്യാപ്സിക്കം',
      kn: 'ಸಿಹಿ ಮೆಣಸಿನಕಾಯಿ'
    },
    category: 'Vegetables',
    icon: '🫑',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Sweet pepper crop sensitive to leaf spot and mosaic virus.'
  },
  // Note: the former 'chili_pepper' entry (listed as "Pepper Bell") duplicated
  // 'bell_pepper' and has been merged into it.
  {
    id: 'cotton',
    name: 'Cotton',
    translatedNames: {
      en: 'Cotton',
      ta: 'பருத்தி',
      hi: 'कपास',
      te: 'ప్రత్తి',
      ml: 'പരുത്തി',
      kn: 'ಹತ್ತಿ'
    },
    category: 'Cash Crops',
    icon: '☁️',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Fiber crop susceptible to boll rot and leaf curl virus.'
  },
  {
    id: 'grape',
    name: 'Grape',
    translatedNames: {
      en: 'Grape',
      ta: 'திராட்சை',
      hi: 'अंगूर',
      te: 'ద్రాక్ష',
      ml: 'മുന്തിരി',
      kn: 'ದ್ರಾಕ್ಷಿ'
    },
    category: 'Fruits',
    icon: '🍇',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Vine fruit vulnerable to powdery mildew and black rot.'
  },
  {
    id: 'citrus',
    name: 'Citrus (Lemon/Orange)',
    translatedNames: {
      en: 'Citrus',
      ta: 'எலுமிச்சை / நார்த்தை',
      hi: 'नींबू / संतरा',
      te: 'నిమ్మ',
      ml: 'നാരങ്ങ',
      kn: 'ನಿಂಬೆ'
    },
    category: 'Fruits',
    icon: '🍋',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Citrus crop prone to citrus canker and greening disease.'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    translatedNames: {
      en: 'Coffee',
      ta: 'காபி',
      hi: 'कॉफी',
      te: 'కాఫీ',
      ml: 'കാപ്പി',
      kn: 'ಕಾಫಿ'
    },
    category: 'Cash Crops',
    icon: '☕',
    color: 'bg-amber-900 text-amber-100 border-amber-700',
    description: 'Plantation crop affected by coffee leaf rust and berry borer.'
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    translatedNames: {
      en: 'Cucumber',
      ta: 'வெள்ளரி',
      hi: 'खीरा',
      te: 'దోసకాయ',
      ml: 'വെള്ളരി',
      kn: 'ಸೌತೆಕಾಯಿ'
    },
    category: 'Vegetables',
    icon: '🥒',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Gourd crop affected by downy mildew and mosaic virus.'
  },
  {
    id: 'eggplant',
    name: 'Eggplant (Brinjal)',
    translatedNames: {
      en: 'Eggplant',
      ta: 'கத்தரிக்காய்',
      hi: 'बैंगन',
      te: 'వంకాయ',
      ml: 'വഴുതനങ്ങ',
      kn: 'ಬದನೆಕಾಯಿ'
    },
    category: 'Vegetables',
    icon: '🍆',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Popular vegetable subject to shoot borer and leaf spot.'
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    translatedNames: {
      en: 'Strawberry',
      ta: 'ស្ត്രോബെറി',
      hi: 'स्ट्रॉबेरी',
      te: 'స్ట్రాబెర్రీ',
      ml: 'സ്ട്രോബെറി',
      kn: 'ಸ್ಟ್ರಾಬೆರಿ'
    },
    category: 'Fruits',
    icon: '🍓',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Berry fruit prone to leaf scorch and grey mold.'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    translatedNames: {
      en: 'Soybean',
      ta: 'சோயாபீன்',
      hi: 'सोयाबीन',
      te: 'సోయాబీన్',
      ml: 'സോയാബീൻ',
      kn: 'ಸೋಯಾಬೀನ್'
    },
    category: 'Cash Crops',
    icon: '🫘',
    color: 'bg-lime-100 text-lime-800 border-lime-300',
    description: 'Legume crop susceptible to rust and leaf spot.'
  },
  {
    id: 'beans',
    name: 'Beans',
    translatedNames: {
      en: 'Beans',
      ta: 'பீன்ஸ்',
      hi: 'बीन्स / फली',
      te: 'చిక్కుడు',
      ml: 'പയർ',
      kn: 'ಹುರುಳಿಕಾಯಿ'
    },
    category: 'Vegetables',
    icon: '🫛',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Pulse vegetable prone to rust and root rot.'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    translatedNames: {
      en: 'Garlic',
      ta: 'பூண்டு',
      hi: 'लहसुन',
      te: 'వెల్లుల్లి',
      ml: 'വെളുത്തുള്ളി',
      kn: 'ಬೆಳ್ಳುಳ್ಳಿ'
    },
    category: 'Herbs',
    icon: '🧄',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Bulb herb affected by purple blotch and neck rot.'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    translatedNames: {
      en: 'Ginger',
      ta: 'இஞ்சி',
      hi: 'अदरक',
      te: 'అల్లం',
      ml: 'ഇഞ്ചി',
      kn: 'ಶುಂಠಿ'
    },
    category: 'Herbs',
    icon: '🫚',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Rhizome spice vulnerable to soft rot and leaf spot.'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    translatedNames: {
      en: 'Carrot',
      ta: 'கேரட்',
      hi: 'गाजर',
      te: 'క్యారెట్',
      ml: 'കാരറ്റ്',
      kn: 'ಕ್ಯಾರೆಟ್'
    },
    category: 'Vegetables',
    icon: '🥕',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Root vegetable vulnerable to Alternaria leaf blight.'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    translatedNames: {
      en: 'Cabbage',
      ta: 'முட்டைக்கோஸ்',
      hi: 'पत्तागोभी',
      te: 'కేబేజీ',
      ml: 'കാബേജ്',
      kn: 'ಕೋಸು'
    },
    category: 'Vegetables',
    icon: '🥬',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Cruciferous crop subject to black rot and downy mildew.'
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    translatedNames: {
      en: 'Cauliflower',
      ta: 'காலிஃப்ளவர்',
      hi: 'फूलगोभी',
      te: 'కాలీఫ్లవర్',
      ml: 'കോളിഫ്ലവർ',
      kn: 'ಹೂಕೋಸು'
    },
    category: 'Vegetables',
    icon: '🥦',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Cruciferous vegetable prone to curd rot and leaf spot.'
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    translatedNames: {
      en: 'Broccoli',
      ta: 'புரோக்கோலி',
      hi: 'ब्रोकोली',
      te: 'బ్రోకలీ',
      ml: 'ബ്രൊക്കോളി',
      kn: 'ಬ್ರೊಕೊಲಿ'
    },
    category: 'Vegetables',
    icon: '🥦',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Nutritious green vegetable prone to downy mildew.'
  },
  {
    id: 'basil',
    name: 'Basil',
    translatedNames: {
      en: 'Basil',
      ta: 'துளசி',
      hi: 'तुलसी',
      te: 'తులసి',
      ml: 'തുളസി',
      kn: 'ತುಳಸಿ'
    },
    category: 'Herbs',
    icon: '🌿',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Aromatic herb susceptible to downy mildew and Fusarium wilt.'
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    translatedNames: {
      en: 'Blueberry',
      ta: 'ப்ளூபெர்ரி',
      hi: 'ब्लूबेरी',
      te: 'బ్లూబెర్రీ',
      ml: 'ബ്ലൂബെറി',
      kn: 'ಬ್ಲೂಬೆರ್ರಿ'
    },
    category: 'Fruits',
    icon: '🫐',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Berry fruit prone to mummy berry and leaf spot.'
  },
  {
    id: 'celery',
    name: 'Celery',
    translatedNames: {
      en: 'Celery',
      ta: 'செலரி',
      hi: 'सेलरी / अजवाइन पत्ता',
      te: 'సెలరీ',
      ml: 'സെലറി',
      kn: 'ಸೆಲರಿ'
    },
    category: 'Vegetables',
    icon: '🥬',
    color: 'bg-lime-100 text-lime-800 border-lime-300',
    description: 'Stalk vegetable affected by early blight and mosaic virus.'
  },
  {
    id: 'cherry',
    name: 'Cherry',
    translatedNames: {
      en: 'Cherry',
      ta: 'செர்ரி',
      hi: 'चेरी',
      te: 'చెర్రీ',
      ml: 'ചെറി',
      kn: 'ಚೆರ್ರಿ'
    },
    category: 'Fruits',
    icon: '🍒',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'Stone fruit susceptible to powdery mildew and leaf spot.'
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    translatedNames: {
      en: 'Lettuce',
      ta: 'லெட்டூஸ்',
      hi: 'सलाद पत्ता',
      te: 'లెట్యూస్',
      ml: 'ലെറ്റൂസ്',
      kn: 'ಲೆಟ್ಯೂಸ್'
    },
    category: 'Vegetables',
    icon: '🥬',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Leafy green susceptible to downy mildew and drop.'
  },
  {
    id: 'maple',
    name: 'Maple',
    translatedNames: {
      en: 'Maple',
      ta: 'மேப்பிள்',
      hi: 'मैपल',
      te: 'మేపుల్',
      ml: 'മേപ്പിൾ',
      kn: 'ಮೇಪಲ್'
    },
    category: 'Cash Crops',
    icon: '🍁',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Tree species susceptible to tar spot and anthracnose.'
  },
  {
    id: 'peach',
    name: 'Peach',
    translatedNames: {
      en: 'Peach',
      ta: 'பீச்',
      hi: 'आड़ू',
      te: 'పీచ్',
      ml: 'പീച്ച്',
      kn: 'ಪೀಚ್'
    },
    category: 'Fruits',
    icon: '🍑',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Stone fruit susceptible to peach leaf curl and brown rot.'
  },
  {
    id: 'plum',
    name: 'Plum',
    translatedNames: {
      en: 'Plum',
      ta: 'ப்ளம்ஸ்',
      hi: 'आलूबुखारा',
      te: 'ప్లమ్',
      ml: 'പ്ലം',
      kn: 'ಪ್ಲಮ್'
    },
    category: 'Fruits',
    icon: '🍑',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Fruit tree subject to black knot and leaf spot.'
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    translatedNames: {
      en: 'Raspberry',
      ta: 'ராஸ்ப்பெர்ரி',
      hi: 'रसभरी',
      te: 'రాస్ప్‌బెర్రీ',
      ml: 'റാസ്പ്ബെറി',
      kn: 'ರಾಸ್ಪ್ಬೆರಿ'
    },
    category: 'Fruits',
    icon: '🍇',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Cane berry vulnerable to leaf spot and anthracnose.'
  },
  {
    id: 'squash',
    name: 'Squash',
    translatedNames: {
      en: 'Squash',
      ta: 'சீமைச்சுரைக்காய்',
      hi: 'कद्दू / स्क्वैश',
      te: 'స్క్వాష్',
      ml: 'മത്തൻ സ്ക്വാഷ്',
      kn: 'ಕುಂಬಳಕಾಯಿ'
    },
    category: 'Vegetables',
    icon: '🎃',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Cucurbit crop prone to powdery mildew and mosaic virus.'
  },
  {
    id: 'tobacco',
    name: 'Tobacco',
    translatedNames: {
      en: 'Tobacco',
      ta: 'புகையிலை',
      hi: 'तंबाकू',
      te: 'పొగాకు',
      ml: 'പുകയില',
      kn: 'ತಂಬಾಕು'
    },
    category: 'Cash Crops',
    icon: '🍂',
    color: 'bg-amber-100 text-amber-900 border-amber-400',
    description: 'Cash crop susceptible to tobacco mosaic virus and leaf curl.'
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    translatedNames: {
      en: 'Zucchini',
      ta: 'சுரைக்காய் வகை',
      hi: 'जुकिनी',
      te: 'జుకినీ',
      ml: 'സുക്കിനി',
      kn: 'ಜುಚಿನಿ'
    },
    category: 'Vegetables',
    icon: '🥒',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Summer squash prone to powdery mildew and fruit rot.'
  }
];
