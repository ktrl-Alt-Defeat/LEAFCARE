import { Disease } from '@/types';

export const MOCK_DISEASES: Record<string, Disease> = {
  tomato: {
    id: 'disease_tomato_blight',
    cropId: 'tomato',
    cropName: 'Tomato',
    name: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    translatedNames: {
      en: 'Tomato Early Blight',
      ta: 'தக்காளி இலைக்கருகல் நோய் (Early Blight)',
      hi: 'टमाटर अगेती अंगमारी (Early Blight)',
      te: 'టమోటా ముందస్తు మచ్చ తెగులు',
      ml: 'തക്കാളി ഇലകരിച്ചിൽ രോഗം',
      kn: 'ಟೊಮೆಟೊ ಮುಂಗಾರು ರೋಗ'
    },
    confidence: 94,
    severity: 'moderate',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop',
    overview: 'Early blight is a common fungal disease of tomatoes caused by Alternaria solani. It causes concentric ring dark brown spots on older leaves, lower leaf yellowing, and foliage loss.',
    symptoms: [
      'Concentric dark brown circular spots with target-like rings on mature bottom leaves.',
      'Yellowing halo around dark foliage spots.',
      'Premature defoliation starting from the lower stem working upwards.',
      'Sunscald damage on fruit due to canopy leaf drop.'
    ],
    causes: [
      'Fungal spores (Alternaria solani) surviving in plant debris or soil over winter.',
      'Warm temperature combined with frequent leaf wetness or high humidity.',
      'Rain splash or overhead irrigation carrying spores to bottom leaves.'
    ],
    favorableConditions: [
      'Temperatures between 24°C and 29°C.',
      'High humidity (>80%) or frequent evening rains.',
      'Dense plant spacing with poor airflow.'
    ],
    immediateSteps: [
      'Prune off heavily infected lower leaves and discard them away from the field.',
      'Avoid overhead sprinklers — water only at the soil base around roots.',
      'Mulch soil surface with straw to prevent fungal spores splashing from soil.'
    ],
    organicTreatment: [
      'Spray Neem oil extract (5ml per liter water) every 7 days as an organic fungicide.',
      'Apply Copper-based bio-fungicide spray early in the morning.',
      'Spray Trichoderma viride bio-agent formulation (5g/L).'
    ],
    chemicalTreatment: [
      'Apply Mancozeb 75% WP @ 2.5g/liter of water.',
      'Alternate with Chlorothalonil 75% WP @ 2g/liter for fungicide resistance management.'
    ],
    preventionTips: [
      'Practice 3-year crop rotation with non-solanaceous crops like maize or beans.',
      'Maintain 60cm spacing between plants for adequate sunlight & ventilation.',
      'Destroy crop residue immediately after harvest.'
    ],
    disclaimer: 'Always follow local agricultural extension guidelines and official pesticide label instructions before chemical applications.'
  },
  rice: {
    id: 'disease_rice_blast',
    cropId: 'rice',
    cropName: 'Rice',
    name: 'Rice Leaf Blast',
    scientificName: 'Magnaporthe oryzae',
    translatedNames: {
      en: 'Rice Leaf Blast',
      ta: 'நெல் குலை நோய் (Leaf Blast)',
      hi: 'धान का झुलसा रोग (Blast)',
      te: 'వరి అగ్గి తెగులు',
      ml: 'നെല്ല് ബ്ലാസ്റ്റ് രോഗം',
      kn: 'ಅಕ್ಕಿ ಎಲೆ ರೋಗ (Blast)'
    },
    confidence: 91,
    severity: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=800&auto=format&fit=crop',
    overview: 'Rice blast is one of the most destructive fungal diseases affecting paddy fields. Spindle-shaped lesions with reddish-brown borders appear on leaves, causing plant stunting and panicle blast.',
    symptoms: [
      'Spindle-shaped or diamond-shaped spots with grey-white centers and dark brown margins.',
      'Drying and burning appearance of leaf tips across the field.',
      'Rotting and breaking of panicle nodes (Neck blast).'
    ],
    causes: [
      'Wind-borne fungal spores spreading rapidly in foggy morning conditions.',
      'Excessive nitrogenous fertilizer applications.',
      'Low soil moisture coupled with night dew drops.'
    ],
    favorableConditions: [
      'Cool temperatures (20°C–25°C) with high humidity.',
      'Cloudy weather and continuous wet leaf canopy.'
    ],
    immediateSteps: [
      'Drain standing water from paddy field temporarily if flooded.',
      'Suspend nitrogen fertilizer top-dressing immediately.',
      'Collect and destroy infected stubble.'
    ],
    organicTreatment: [
      'Spray Pseudomonas fluorescens @ 10g/liter of water during early disease incidence.',
      'Apply Panchagavya 3% spray on standing crop.'
    ],
    chemicalTreatment: [
      'Spray Tricyclazole 75% WP @ 0.6g/liter water.',
      'Or spray Isoprothiolane 40% EC @ 1.5ml/liter.'
    ],
    preventionTips: [
      'Use blast-resistant certified rice seeds.',
      'Maintain balanced NPK fertilizer ratio (avoid over-dosing Nitrogen).'
    ],
    disclaimer: 'Always consult your local Krishivigyan Kendra or agriculture department officer for field recommendations.'
  },
  wheat: {
    id: 'disease_wheat_rust',
    cropId: 'wheat',
    cropName: 'Wheat',
    name: 'Wheat Leaf Rust',
    scientificName: 'Puccinia triticina',
    translatedNames: {
      en: 'Wheat Leaf Rust',
      ta: 'கோதுமை இலை துரு நோய் (Rust)',
      hi: 'गेहूं का भूरा रतुआ (Leaf Rust)',
      te: 'గోధుమ ఆకు తుప్పు తెగులు',
      ml: 'ഗോതമ്പ് തുരുമ്പ് രോഗം',
      kn: 'ಗೋಧಿ ಎಲೆ ತುಕ್ಕು ರೋಗ'
    },
    confidence: 89,
    severity: 'moderate',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    overview: 'Wheat leaf rust produces orange-brown pustules on leaf blades. It reduces photosynthetic leaf area, grain weight, and yield quality if uncontrolled.',
    symptoms: [
      'Small, circular orange-red pustules on upper surface of leaves.',
      'Pustules rub off leaving orange powdery dust on fingers.',
      'Yellowing and premature drying of wheat leaves.'
    ],
    causes: [
      'Airborne urediniospores carried by seasonal winds across states.',
      'Continuous moist canopy with light dew.'
    ],
    favorableConditions: [
      'Temperatures between 15°C and 22°C.',
      'Dew drops persisting on leaves for more than 6 hours.'
    ],
    immediateSteps: [
      'Monitor wheat canopy twice weekly during rabi season.',
      'Identify rust spots early before field-wide outbreak.'
    ],
    organicTreatment: [
      'Spray Cow urine (10%) mixed with sour buttermilk 5%.',
      'Bio-control using Bacillus subtilis spray.'
    ],
    chemicalTreatment: [
      'Spray Propiconazole 25% EC @ 1ml/liter water at first appearance.',
      'Tebuconazole 25.9% EC @ 1.5ml/liter.'
    ],
    preventionTips: [
      'Sow rust-resistant varieties approved for your agro-zone.',
      'Timely sowing to avoid late season spore flights.'
    ],
    disclaimer: 'Adhere to recommended spray withholding periods prior to harvest.'
  },
  potato: {
    id: 'disease_potato_late_blight',
    cropId: 'potato',
    cropName: 'Potato',
    name: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    translatedNames: {
      en: 'Potato Late Blight',
      ta: 'உருளைக்கிழங்கு பிந்தைய இலைக்கருகல்',
      hi: 'आलू पिछेती अंगमारी (Late Blight)',
      te: 'బంగాళాదుంప లేట్ బ్లైట్ తెగులు',
      ml: 'ഉരുളക്കിഴങ്ങ് ലൈറ്റ് ബ്ലൈറ്റ്',
      kn: 'ಆಲೂಗಡ್ಡೆ ಲೇಟ್ ಬ್ಲೈಟ್'
    },
    confidence: 96,
    severity: 'severe',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop',
    overview: 'Late blight is an aggressive oomycete pathogen that can destroy potato fields within days. Dark water-soaked spots appear on leaves with white cottony mold under moist conditions.',
    symptoms: [
      'Water-soaked dark green/black foliage spots.',
      'White fungal fuzz on undersides of leaves during humid mornings.',
      'Tuber rot showing brown discoloration under skin.'
    ],
    causes: [
      'Infected seed tubers carrying Phytophthora infestans.',
      'Cool wet weather enabling rapid spore germination.'
    ],
    favorableConditions: [
      'Temperatures 12°C–20°C with relative humidity >90%.',
      'Overcast weather with light drizzle.'
    ],
    immediateSteps: [
      'Remove and bury severely blighted plants immediately.',
      'Hill up soil around tubers to prevent spores reaching underground potatoes.'
    ],
    organicTreatment: [
      'Preventive spray of Bordeaux mixture (1%).',
      'Copper oxychloride bio-spray @ 3g/liter.'
    ],
    chemicalTreatment: [
      'Systemic spray of Cymoxanil + Mancozeb @ 2g/liter.',
      'Or Metalaxyl + Mancozeb @ 2.5g/liter.'
    ],
    preventionTips: [
      'Plant certified disease-free seed potatoes.',
      'Destroy volunteer potato plants and nightshade weeds.'
    ],
    disclaimer: 'Late blight requires immediate action to prevent total crop loss.'
  },
  default: {
    id: 'disease_leaf_spot',
    cropId: 'crop',
    cropName: 'Crop',
    name: 'Fungal Leaf Spot',
    scientificName: 'Cercospora spp.',
    translatedNames: {
      en: 'Fungal Leaf Spot',
      ta: 'பூஞ்சை இலைப்புள்ளி நோய்',
      hi: 'कवक पत्ती धब्बा रोग',
      te: 'శిలీంధ్ర ఆకు మచ్చ తెగులు',
      ml: 'ഫംഗസ് ഇലപ്പുള്ളി രോഗം',
      kn: 'ಶಿಲೀಂಧ್ರ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ'
    },
    confidence: 92,
    severity: 'moderate',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop',
    overview: 'Leaf spot is a widely occurring fungal condition causing small brownish specks with reddish borders. Left unchecked, leaves turn yellow and drop off prematurely.',
    symptoms: [
      'Circular or angular brown spots with reddish halos on leaves.',
      'Center of leaf spots may dry out and drop, creating shot-hole effect.',
      'Lower leaves turn yellow and fall off.'
    ],
    causes: [
      'Fungal spores spread by splash water or wind.',
      'Warm temperature coupled with leaf wetness.'
    ],
    favorableConditions: [
      'Temperatures 22°C–30°C.',
      'High humidity or frequent overhead watering.'
    ],
    immediateSteps: [
      'Remove spotted leaves.',
      'Ensure proper spacing between crops for sunlight.'
    ],
    organicTreatment: [
      'Neem oil 5ml/L spray every week.',
      'Trichoderma viride 5g/L formulation.'
    ],
    chemicalTreatment: [
      'Mancozeb 75% WP @ 2.5g/L.',
      'Carbendazim 50% WP @ 1g/L.'
    ],
    preventionTips: [
      'Water plants at soil level.',
      'Rotate crops every season.'
    ],
    disclaimer: 'Follow safety guidelines when handling agricultural treatments.'
  }
};
