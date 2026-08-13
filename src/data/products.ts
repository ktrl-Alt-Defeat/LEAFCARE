import { MarketProduct } from '@/types';

export const MOCK_PRODUCTS: MarketProduct[] = [
  {
    id: 'prod_1',
    name: 'Neem-Care Organic Bio-Fungicide (1L)',
    category: 'Crop Protection',
    price: 340,
    unit: 'Bottle',
    rating: 4.8,
    reviewsCount: 142,
    seller: 'AgroBio Solutions',
    location: 'Coimbatore',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop',
    description: 'Cold-pressed 10,000 PPM Neem Oil solution for organic pest & fungal disease control on tomatoes, paddy, and chili.',
    isOrganic: true
  },
  {
    id: 'prod_2',
    name: 'Trichoderma Viride Bio-Control (1kg)',
    category: 'Crop Protection',
    price: 180,
    unit: 'Pack',
    rating: 4.9,
    reviewsCount: 98,
    seller: 'Green Earth Organics',
    location: 'Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=600&auto=format&fit=crop',
    description: 'Natural fungal bio-agent that prevents root rot, damping off, and wilt in all crops.',
    isOrganic: true
  },
  {
    id: 'prod_3',
    name: 'High-Yield Hybrid Paddy Seeds (5kg)',
    category: 'Seeds',
    price: 750,
    unit: 'Bag',
    rating: 4.7,
    reviewsCount: 210,
    seller: 'Kisan Seed Corp',
    location: 'Hyderabad',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=600&auto=format&fit=crop',
    description: 'Blast-tolerant hybrid rice seed with 135-day maturity period and high grain density.'
  },
  {
    id: 'prod_4',
    name: '16L Battery Powered Knapsack Sprayer',
    category: 'Equipment',
    price: 2450,
    unit: 'Piece',
    rating: 4.6,
    reviewsCount: 65,
    seller: 'Kisan Machinery Ltd',
    location: 'Pune',
    imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=600&auto=format&fit=crop',
    description: 'Rechargeable 12V 8Ah battery sprayer with stainless steel lance and dual nozzle for fast spraying.'
  }
];
