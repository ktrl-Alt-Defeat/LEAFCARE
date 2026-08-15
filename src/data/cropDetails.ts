import { CropAgronomy } from '@/types';

/**
 * Agronomy reference sheets keyed by crop id.
 * Crops without an entry fall back to a "sheet in progress" state in the UI.
 */
export const CROP_AGRONOMY: Record<string, CropAgronomy> = {
  apple: {
    cropId: 'apple',
    growing: {
      temperature: '15–24 °C',
      exposure: 'Full sun',
      rainfall: '500–1,000 mm/year',
      humidity: '50–70%',
      watering: 'Intermediate'
    },
    soil: { type: 'Loamy, well-drained', ph: '6.0–7.0', drainage: 'Good' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Transplanted / grafted',
      rowSpacing: '4–6 m',
      plantSpacing: '3–5 m'
    },
    nutrients: { nitrogen: '200 g/tree', phosphorus: '70 g/tree', potassium: '250 g/tree' },
    companions: {
      good: ['Garlic', 'Chives', 'Marigold'],
      bad: ['Walnut', 'Potato', 'Tomato']
    }
  },

  banana: {
    cropId: 'banana',
    growing: {
      temperature: '20–30 °C',
      exposure: 'Full sun',
      rainfall: '1,500–2,500 mm/year',
      humidity: '60–80%',
      watering: 'High'
    },
    soil: { type: 'Fertile, loamy', ph: '5.5–7.0', drainage: 'Good' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'High',
      plantingMethod: 'Suckers / tissue culture',
      rowSpacing: '2–3 m',
      plantSpacing: '2–3 m'
    },
    nutrients: { nitrogen: '200 g/plant', phosphorus: '60 g/plant', potassium: '300 g/plant' },
    companions: {
      good: ['Beans', 'Marigold', 'Sweet potato'],
      bad: ['Crops competing heavily for nutrients']
    }
  },

  basil: {
    cropId: 'basil',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '600–1,000 mm/year',
      humidity: '40–70%',
      watering: 'Moderate'
    },
    soil: { type: 'Loamy, fertile', ph: '6.0–7.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Low',
      plantingMethod: 'Seeds / transplanting',
      rowSpacing: '30–45 cm',
      plantSpacing: '20–30 cm'
    },
    nutrients: { nitrogen: '80 kg/ha', phosphorus: '40 kg/ha', potassium: '40 kg/ha' },
    companions: { good: ['Tomato', 'Pepper', 'Oregano'], bad: ['Rue'] }
  },

  beans: {
    cropId: 'beans',
    growing: {
      temperature: '18–27 °C',
      exposure: 'Full sun',
      rainfall: '500–900 mm/year',
      humidity: '50–70%',
      watering: 'Moderate'
    },
    soil: { type: 'Loamy, well-drained', ph: '6.0–7.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding',
      rowSpacing: '45–60 cm',
      plantSpacing: '10–20 cm'
    },
    nutrients: { nitrogen: '40 kg/ha', phosphorus: '60 kg/ha', potassium: '50 kg/ha' },
    companions: { good: ['Carrot', 'Cucumber', 'Corn'], bad: ['Onion', 'Garlic'] }
  },

  bell_pepper: {
    cropId: 'bell_pepper',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '600–1,200 mm/year',
      humidity: '50–70%',
      watering: 'Moderate–High'
    },
    soil: { type: 'Sandy loam, loamy', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Transplanted',
      rowSpacing: '45–60 cm',
      plantSpacing: '30–45 cm'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '60 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Basil', 'Carrot', 'Onion'], bad: ['Fennel', 'Potato'] }
  },

  blueberry: {
    cropId: 'blueberry',
    growing: {
      temperature: '15–25 °C',
      exposure: 'Full sun',
      rainfall: '700–1,200 mm/year',
      humidity: '50–70%',
      watering: 'High'
    },
    soil: { type: 'Acidic, sandy loam', ph: '4.5–5.5' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Transplanted',
      rowSpacing: '2.5–3 m',
      plantSpacing: '1–1.5 m'
    },
    nutrients: { nitrogen: '50 kg/ha', phosphorus: '30 kg/ha', potassium: '50 kg/ha' },
    companions: {
      good: ['Cranberry', 'Rhododendron'],
      bad: ['Crops requiring alkaline soil']
    }
  },

  broccoli: {
    cropId: 'broccoli',
    growing: {
      temperature: '15–23 °C',
      exposure: 'Full sun',
      rainfall: '500–800 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Fertile loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Transplanted',
      rowSpacing: '45–60 cm',
      plantSpacing: '30–45 cm'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '50 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Onion', 'Celery', 'Dill'], bad: ['Tomato', 'Strawberry'] }
  },

  cabbage: {
    cropId: 'cabbage',
    growing: {
      temperature: '15–22 °C',
      exposure: 'Full sun',
      rainfall: '500–800 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Fertile loam', ph: '6.0–7.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Transplanted',
      rowSpacing: '45–60 cm',
      plantSpacing: '30–45 cm'
    },
    nutrients: { nitrogen: '120 kg/ha', phosphorus: '60 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Dill', 'Onion', 'Celery'], bad: ['Strawberry', 'Tomato'] }
  },

  carrot: {
    cropId: 'carrot',
    growing: {
      temperature: '15–24 °C',
      exposure: 'Full sun',
      rainfall: '400–800 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Sandy loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Annual / biennial',
      labour: 'Medium',
      plantingMethod: 'Direct seeding',
      rowSpacing: '30–45 cm',
      plantSpacing: '5–10 cm'
    },
    nutrients: { nitrogen: '60 kg/ha', phosphorus: '50 kg/ha', potassium: '80 kg/ha' },
    companions: { good: ['Beans', 'Lettuce', 'Peas'], bad: ['Dill'] }
  },

  cauliflower: {
    cropId: 'cauliflower',
    growing: {
      temperature: '15–22 °C',
      exposure: 'Full sun',
      rainfall: '500–800 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Fertile loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Transplanted',
      rowSpacing: '45–60 cm',
      plantSpacing: '30–45 cm'
    },
    nutrients: { nitrogen: '120 kg/ha', phosphorus: '60 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Celery', 'Onion', 'Dill'], bad: ['Strawberry', 'Tomato'] }
  },

  celery: {
    cropId: 'celery',
    growing: {
      temperature: '15–21 °C',
      exposure: 'Full sun / partial shade',
      rainfall: '600–1,000 mm/year',
      watering: 'High'
    },
    soil: { type: 'Moist loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Biennial',
      labour: 'High',
      plantingMethod: 'Transplanted',
      rowSpacing: '45–60 cm',
      plantSpacing: '20–30 cm'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '50 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Cabbage', 'Broccoli', 'Tomato'], bad: ['Corn'] }
  },

  cherry: {
    cropId: 'cherry',
    growing: {
      temperature: '15–25 °C',
      exposure: 'Full sun',
      rainfall: '600–1,000 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Well-drained loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Grafted / transplanted',
      rowSpacing: '4–6 m',
      plantSpacing: '3–5 m'
    },
    nutrients: { nitrogen: '100 g/tree', phosphorus: '50 g/tree', potassium: '150 g/tree' },
    companions: { good: ['Garlic', 'Chives'], bad: ['Apple', 'Potato'] }
  },

  orange: {
    cropId: 'orange',
    growing: {
      temperature: '20–30 °C',
      exposure: 'Full sun',
      rainfall: '1,000–1,500 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Sandy loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Grafted / transplanted',
      rowSpacing: '5–7 m',
      plantSpacing: '4–6 m'
    },
    nutrients: { nitrogen: '200 g/tree', phosphorus: '100 g/tree', potassium: '200 g/tree' },
    companions: {
      good: ['Garlic', 'Marigold', 'Basil'],
      bad: ['Crops competing heavily for nutrients']
    }
  },

  citrus: {
    cropId: 'citrus',
    growing: {
      temperature: '20–30 °C',
      exposure: 'Full sun',
      rainfall: '1,000–1,500 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Sandy loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Grafted / transplanted',
      rowSpacing: '5–7 m',
      plantSpacing: '4–6 m'
    },
    nutrients: { nitrogen: '200 g/tree', phosphorus: '100 g/tree', potassium: '200 g/tree' },
    companions: {
      good: ['Garlic', 'Marigold', 'Basil'],
      bad: ['Crops competing heavily for nutrients']
    }
  },

  coffee: {
    cropId: 'coffee',
    growing: {
      temperature: '18–24 °C',
      exposure: 'Partial shade',
      rainfall: '1,500–2,500 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Deep, fertile loam', ph: '5.5–6.5' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'High',
      plantingMethod: 'Seedlings',
      rowSpacing: '2–3 m',
      plantSpacing: '1.5–2.5 m'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '40 kg/ha', potassium: '100 kg/ha' },
    companions: {
      good: ['Banana', 'Legumes', 'Shade trees'],
      bad: ['Crops requiring full sun']
    }
  },

  corn: {
    cropId: 'corn',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '500–800 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Fertile loam', ph: '5.8–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding',
      rowSpacing: '60–75 cm',
      plantSpacing: '20–30 cm'
    },
    nutrients: { nitrogen: '120 kg/ha', phosphorus: '60 kg/ha', potassium: '60 kg/ha' },
    companions: { good: ['Beans', 'Cucumber', 'Squash'], bad: ['Celery', 'Tomato'] }
  },

  cucumber: {
    cropId: 'cucumber',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '600–1,000 mm/year',
      watering: 'High'
    },
    soil: { type: 'Sandy loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding / transplanting',
      rowSpacing: '1–1.5 m',
      plantSpacing: '30–60 cm'
    },
    nutrients: { nitrogen: '80 kg/ha', phosphorus: '50 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Beans', 'Corn', 'Radish'], bad: ['Potato', 'Sage'] }
  },

  eggplant: {
    cropId: 'eggplant',
    growing: {
      temperature: '22–30 °C',
      exposure: 'Full sun',
      rainfall: '600–1,200 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Fertile loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Transplanted',
      rowSpacing: '60–75 cm',
      plantSpacing: '45–60 cm'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '60 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Beans', 'Basil', 'Marigold'], bad: ['Fennel', 'Potato'] }
  },

  garlic: {
    cropId: 'garlic',
    growing: {
      temperature: '12–24 °C',
      exposure: 'Full sun',
      rainfall: '500–800 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Loose loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Cloves',
      rowSpacing: '15–30 cm',
      plantSpacing: '10–15 cm'
    },
    nutrients: { nitrogen: '80 kg/ha', phosphorus: '50 kg/ha', potassium: '80 kg/ha' },
    companions: { good: ['Tomato', 'Carrot', 'Lettuce'], bad: ['Beans', 'Peas'] }
  },

  ginger: {
    cropId: 'ginger',
    growing: {
      temperature: '20–30 °C',
      exposure: 'Partial shade',
      rainfall: '1,500–2,500 mm/year',
      watering: 'High'
    },
    soil: { type: 'Loamy, rich in organic matter', ph: '5.5–6.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'High',
      plantingMethod: 'Rhizomes',
      rowSpacing: '30–45 cm',
      plantSpacing: '15–25 cm'
    },
    nutrients: { nitrogen: '75 kg/ha', phosphorus: '50 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Beans', 'Peas'], bad: ['Crops needing very dry soil'] }
  },

  grape: {
    cropId: 'grape',
    growing: {
      temperature: '15–30 °C',
      exposure: 'Full sun',
      rainfall: '500–900 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Sandy loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'High',
      plantingMethod: 'Cuttings / grafted plants',
      rowSpacing: '2–3 m',
      plantSpacing: '1.5–2.5 m'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '50 kg/ha', potassium: '150 kg/ha' },
    companions: { good: ['Clover', 'Basil'], bad: ['Crops with aggressive root systems'] }
  },

  lettuce: {
    cropId: 'lettuce',
    growing: {
      temperature: '10–22 °C',
      exposure: 'Full sun / partial shade',
      rainfall: '400–700 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Fertile loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Low',
      plantingMethod: 'Direct seeding / transplanting',
      rowSpacing: '30–45 cm',
      plantSpacing: '20–30 cm'
    },
    nutrients: { nitrogen: '60 kg/ha', phosphorus: '40 kg/ha', potassium: '60 kg/ha' },
    companions: { good: ['Carrot', 'Garlic', 'Cucumber'], bad: ['Fennel'] }
  },

  maple: {
    cropId: 'maple',
    growing: {
      temperature: '10–25 °C',
      exposure: 'Full sun / partial shade',
      rainfall: '750–1,500 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Well-drained loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Low',
      plantingMethod: 'Seedlings',
      rowSpacing: '5–8 m',
      plantSpacing: '4–6 m'
    },
    nutrients: { nitrogen: '100 g/tree', phosphorus: '50 g/tree', potassium: '100 g/tree' },
    companions: {
      good: ['Groundcover plants', 'Clover'],
      bad: ['Plants requiring very dry soil']
    }
  },

  peach: {
    cropId: 'peach',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '600–1,000 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Sandy loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Grafted / transplanted',
      rowSpacing: '4–5 m',
      plantSpacing: '3–5 m'
    },
    nutrients: { nitrogen: '150 g/tree', phosphorus: '60 g/tree', potassium: '200 g/tree' },
    companions: { good: ['Garlic', 'Basil', 'Marigold'], bad: ['Potato'] }
  },

  plum: {
    cropId: 'plum',
    growing: {
      temperature: '15–25 °C',
      exposure: 'Full sun',
      rainfall: '600–1,000 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Well-drained loam', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Grafted',
      rowSpacing: '4–6 m',
      plantSpacing: '3–5 m'
    },
    nutrients: { nitrogen: '150 g/tree', phosphorus: '60 g/tree', potassium: '200 g/tree' },
    companions: { good: ['Garlic', 'Chives'], bad: ['Potato', 'Tomato'] }
  },

  potato: {
    cropId: 'potato',
    growing: {
      temperature: '15–20 °C',
      exposure: 'Full sun',
      rainfall: '500–750 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Sandy loam', ph: '5.0–6.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Seed tubers',
      rowSpacing: '60–75 cm',
      plantSpacing: '20–30 cm'
    },
    nutrients: { nitrogen: '120 kg/ha', phosphorus: '80 kg/ha', potassium: '150 kg/ha' },
    companions: { good: ['Beans', 'Corn', 'Cabbage'], bad: ['Tomato', 'Eggplant'] }
  },

  raspberry: {
    cropId: 'raspberry',
    growing: {
      temperature: '15–25 °C',
      exposure: 'Full sun',
      rainfall: '600–1,000 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Loamy, well-drained', ph: '5.5–6.5' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'Medium',
      plantingMethod: 'Bare-root / transplants',
      rowSpacing: '2–3 m',
      plantSpacing: '45–60 cm'
    },
    nutrients: { nitrogen: '60 kg/ha', phosphorus: '30 kg/ha', potassium: '60 kg/ha' },
    companions: {
      good: ['Clover', 'Garlic'],
      bad: ['Plants with aggressive root systems']
    }
  },

  rice: {
    cropId: 'rice',
    growing: {
      temperature: '20–35 °C',
      exposure: 'Full sun',
      rainfall: '1,000–2,000 mm/year',
      watering: 'High'
    },
    soil: { type: 'Clay loam, alluvial', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'High',
      plantingMethod: 'Transplanting / direct seeding',
      rowSpacing: '20–25 cm',
      plantSpacing: '15–20 cm'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '40 kg/ha', potassium: '40 kg/ha' },
    companions: {
      good: ['Azolla', 'Legumes'],
      bad: ['Crops unsuitable for flooded conditions']
    }
  },

  soybean: {
    cropId: 'soybean',
    growing: {
      temperature: '20–30 °C',
      exposure: 'Full sun',
      rainfall: '500–900 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Loamy', ph: '6.0–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding',
      rowSpacing: '30–45 cm',
      plantSpacing: '5–10 cm'
    },
    nutrients: { nitrogen: '20 kg/ha starter', phosphorus: '50 kg/ha', potassium: '60 kg/ha' },
    companions: { good: ['Corn', 'Cucumber', 'Squash'], bad: ['Onion', 'Garlic'] }
  },

  squash: {
    cropId: 'squash',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '500–1,000 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Fertile loam', ph: '5.8–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding',
      rowSpacing: '1.5–3 m',
      plantSpacing: '60–120 cm'
    },
    nutrients: { nitrogen: '80 kg/ha', phosphorus: '50 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Corn', 'Beans', 'Radish'], bad: ['Potato'] }
  },

  strawberry: {
    cropId: 'strawberry',
    growing: {
      temperature: '15–25 °C',
      exposure: 'Full sun',
      rainfall: '500–800 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Sandy loam', ph: '5.5–6.5' },
    cultivation: {
      lifeCycle: 'Perennial',
      labour: 'High',
      plantingMethod: 'Transplants / runners',
      rowSpacing: '60–90 cm',
      plantSpacing: '30–45 cm'
    },
    nutrients: { nitrogen: '60 kg/ha', phosphorus: '40 kg/ha', potassium: '80 kg/ha' },
    companions: { good: ['Borage', 'Lettuce', 'Spinach'], bad: ['Cabbage', 'Broccoli'] }
  },

  tobacco: {
    cropId: 'tobacco',
    growing: {
      temperature: '20–30 °C',
      exposure: 'Full sun',
      rainfall: '500–1,000 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Sandy loam', ph: '5.5–6.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'High',
      plantingMethod: 'Transplanted',
      rowSpacing: '90–120 cm',
      plantSpacing: '45–60 cm'
    },
    nutrients: { nitrogen: '60 kg/ha', phosphorus: '40 kg/ha', potassium: '100 kg/ha' },
    companions: {
      good: ['Rotational crops such as legumes'],
      bad: ['Continuous planting with closely related crops']
    }
  },

  tomato: {
    cropId: 'tomato',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '600–1,200 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Fertile loam', ph: '5.5–7.0' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'High',
      plantingMethod: 'Transplanted',
      rowSpacing: '60–90 cm',
      plantSpacing: '45–60 cm'
    },
    nutrients: { nitrogen: '100 kg/ha', phosphorus: '60 kg/ha', potassium: '120 kg/ha' },
    companions: { good: ['Basil', 'Carrot', 'Garlic'], bad: ['Potato', 'Cabbage'] }
  },

  wheat: {
    cropId: 'wheat',
    growing: {
      temperature: '15–25 °C',
      exposure: 'Full sun',
      rainfall: '450–650 mm/year',
      watering: 'Moderate'
    },
    soil: { type: 'Loam, clay loam', ph: '6.0–7.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding',
      rowSpacing: '15–25 cm',
      plantSpacing: 'Closely spaced'
    },
    nutrients: { nitrogen: '120 kg/ha', phosphorus: '60 kg/ha', potassium: '40 kg/ha' },
    companions: { good: ['Legumes in rotation'], bad: ['Continuous wheat cropping'] }
  },

  zucchini: {
    cropId: 'zucchini',
    growing: {
      temperature: '18–30 °C',
      exposure: 'Full sun',
      rainfall: '500–1,000 mm/year',
      watering: 'Moderate–High'
    },
    soil: { type: 'Fertile loam', ph: '6.0–7.5' },
    cultivation: {
      lifeCycle: 'Annual',
      labour: 'Medium',
      plantingMethod: 'Direct seeding / transplanting',
      rowSpacing: '1–1.5 m',
      plantSpacing: '60–90 cm'
    },
    nutrients: { nitrogen: '80 kg/ha', phosphorus: '50 kg/ha', potassium: '100 kg/ha' },
    companions: { good: ['Corn', 'Beans', 'Mint'], bad: ['Potato'] }
  }
};

export const getCropAgronomy = (cropId: string): CropAgronomy | undefined =>
  CROP_AGRONOMY[cropId];
