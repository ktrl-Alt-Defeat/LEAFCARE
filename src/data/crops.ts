import { Crop } from '@/types';

export const CROPS_DATA: Crop[] = [
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
    image: '/crops/tomato.jpg',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'High-value vegetable crop susceptible to blight and leaf spots.'
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
    image: '/crops/soybean.jpg',
    color: 'bg-lime-100 text-lime-800 border-lime-300',
    description: 'Legume crop susceptible to rust and leaf spot.'
  },
  {
    id: 'orange',
    name: 'Orange',
    translatedNames: {
      en: 'Orange',
      ta: 'ஆரஞ்சு',
      hi: 'संतरा',
      te: 'నారింజ',
      ml: 'ഓറഞ്ച്',
      kn: 'ಕಿತ್ತಳೆ'
    },
    category: 'Fruits',
    icon: '🍊',
    image: '/crops/orange.jpg',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Citrus fruit crop prone to citrus canker and greening disease.'
  },
  {
    id: 'peach',
    name: 'Peach',
    translatedNames: {
      en: 'Peach',
      ta: 'பீச்',
      hi: 'ஆड़ू',
      te: 'పీచ్',
      ml: 'പീച്ച്',
      kn: 'ಪೀಚ್'
    },
    category: 'Fruits',
    icon: '🍑',
    image: '/crops/peach.jpg',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Stone fruit susceptible to peach leaf curl and brown rot.'
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
    image: '/crops/squash.jpg',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Cucurbit crop prone to powdery mildew and mosaic virus.'
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
    image: '/crops/apple.jpg',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Temperate fruit crop subject to scab and cedar rust.'
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
    image: '/crops/blueberry.jpg',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Berry fruit prone to mummy berry and leaf spot.'
  },
  {
    id: 'bell_pepper',
    name: 'Bell Pepper',
    translatedNames: {
      en: 'Bell Pepper',
      ta: 'குடைமிளகாய்',
      hi: 'शिमला मिर्च',
      te: 'బెల్ పెప్పర్',
      ml: 'ക്യാപ്சിക്കம்',
      kn: 'ಸಿಹಿ ಮೆಣಸಿನಕಾಯಿ'
    },
    category: 'Vegetables',
    icon: '🫑',
    image: '/crops/bell-pepper.jpg',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Sweet pepper crop sensitive to leaf spot and mosaic virus.'
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
    image: '/crops/grape.jpg',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Vine fruit vulnerable to powdery mildew and black rot.'
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
    image: '/crops/corn-maize.jpg',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Versatile grain susceptible to leaf blight and rust.'
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    translatedNames: {
      en: 'Strawberry',
      ta: 'ஸ்டிராபெரி',
      hi: 'स्ट्रॉबेरी',
      te: 'స్ట్రాబెర్రీ',
      ml: 'സ്ട്രോബെറി',
      kn: 'ಸ್ಟ್ರಾಬೆರಿ'
    },
    category: 'Fruits',
    icon: '🍓',
    image: '/crops/strawberry.jpg',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Berry fruit prone to leaf scorch and grey mold.'
  },
  {
    id: 'potato',
    name: 'Potato',
    translatedNames: {
      en: 'Potato',
      ta: 'உருளைக்கிழங்கு',
      hi: 'आलू',
      te: 'బంగాళాదుంప',
      ml: 'உருளക്കിഴങ്ങ്',
      kn: 'ಆಲೂಗಡ್ಡೆ'
    },
    category: 'Vegetables',
    icon: '🥔',
    image: '/crops/potato.jpg',
    color: 'bg-amber-100 text-amber-900 border-amber-400',
    description: 'Tuber crop prone to late blight and bacterial wilt.'
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
    image: '/crops/cherry.jpg',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'Stone fruit susceptible to powdery mildew and leaf spot.'
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    translatedNames: {
      en: 'Raspberry',
      ta: 'ராஸ்ப்பெர்ரி',
      hi: 'रसभरी',
      te: 'ராஸ்ప్‌బెర్రీ',
      ml: 'റാസ്പ്ബെറി',
      kn: 'ರಾಸ್ಪ್ಬೆರಿ'
    },
    category: 'Fruits',
    icon: '🍇',
    image: '/crops/raspberry.jpg',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Cane berry vulnerable to leaf spot and anthracnose.'
  }
];
