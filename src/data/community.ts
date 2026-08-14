import { CommunityPost } from '@/types';

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Ramanathan K.',
    authorLocation: 'Mayiladuthurai, Tamil Nadu',
    authorAvatar: '👨‍🌾',
    timestamp: '2 hours ago',
    cropName: 'Tomato',
    category: 'Disease Help',
    title: 'Yellow spots appearing on bottom tomato leaves after heavy rain. Is this early blight?',
    content: 'Friends, after last night rain my 40-day tomato crop is showing round yellow spots with dark rings on lower leaves. LeafCare scanner suggested early blight. Has anyone used Neem oil + Mancozeb spray? What is the best dose?',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=600&auto=format&fit=crop',
    likes: 24,
    repliesCount: 8,
    isLiked: false
  },
  {
    id: 'post_2',
    authorName: 'Sunita Sharma',
    authorLocation: 'Karnal, Haryana',
    authorAvatar: '👩‍🌾',
    timestamp: '5 hours ago',
    cropName: 'Rice',
    category: 'Crop Advice',
    title: 'Tips for preventing neck blast in PB-1121 Paddy variety?',
    content: 'We are in boot leaf stage. Humid morning weather is predicted for next week in Haryana. What preventive bio-spray should I use before flowering starts?',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=600&auto=format&fit=crop',
    likes: 42,
    repliesCount: 15,
    isLiked: true
  },
  {
    id: 'post_3',
    authorName: 'Venkat Reddy',
    authorLocation: 'Guntur, Andhra Pradesh',
    authorAvatar: '👨‍🌾',
    timestamp: '1 day ago',
    cropName: 'Chili',
    category: 'Fertilizer',
    title: 'Micronutrient mix spray for chili flowering drop stage',
    content: 'Used 19-19-19 water soluble NPK spray along with Boron 20%. Great results within 5 days! Flowering retention increased significantly.',
    likes: 56,
    repliesCount: 12,
    isLiked: false
  }
];
