'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { PostCard } from '@/components/community/PostCard';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { MOCK_COMMUNITY_POSTS } from '@/data/community';
import { CommunityPost } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES = ['All', 'Disease Help', 'Crop Advice', 'Weather', 'Fertilizer', 'General Farming'];

export default function CommunityPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPost = (newPostData: { title: string; content: string; cropName: string; category: string }) => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: 'Farmer (You)',
      authorLocation: 'Mayiladuthurai, Tamil Nadu',
      authorAvatar: '👨‍🌾',
      timestamp: 'Just now',
      cropName: newPostData.cropName,
      category: newPostData.category as never,
      title: newPostData.title,
      content: newPostData.content,
      likes: 0,
      repliesCount: 0,
      isLiked: false
    };
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 pb-20">
      <Header />

      <div className="p-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('communityHeader', 'Farming Community')}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-agro-600 text-white text-xs font-bold shadow-soft-sm hover:bg-agro-700"
          >
            <Plus className="w-4 h-4" />
            <span>Ask</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search community questions..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-agro-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-agro-600 text-white shadow-soft-sm'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Feed */}
        <div className="flex flex-col gap-3">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitPost={handleAddPost}
      />
    </div>
  );
}
