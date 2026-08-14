'use client';

import React, { useMemo, useState } from 'react';
import { Plus, MessagesSquare } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { PostCard } from '@/components/community/PostCard';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterChips } from '@/components/ui/FilterChips';
import { MOCK_COMMUNITY_POSTS } from '@/data/community';
import { CommunityPost } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES = [
  'All',
  'Disease Help',
  'Crop Advice',
  'Weather',
  'Fertilizer',
  'General Farming',
] as const;

export default function CommunityPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPost = (newPostData: {
    title: string;
    content: string;
    cropName: string;
    category: string;
  }) => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: 'Farmer (You)',
      authorLocation: 'Mayiladuthurai, Tamil Nadu',
      authorAvatar: '👨‍🌾',
      timestamp: 'Just now',
      cropName: newPostData.cropName,
      category: newPostData.category as CommunityPost['category'],
      title: newPostData.title,
      content: newPostData.content,
      likes: 0,
      repliesCount: 0,
      isLiked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, activeCategory]);

  const askButton = (
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-agro-600 px-3.5 py-2 text-xs font-bold text-white shadow-soft-sm transition-colors hover:bg-agro-700"
    >
      <Plus className="h-4 w-4" />
      <span>Ask a question</span>
    </button>
  );

  return (
    <Page
      title={t('communityHeader', 'Farming Community')}
      subtitle="Questions and answers from farmers nearby"
      titleAction={askButton}
    >
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 flex flex-col gap-3 bg-[#F6F8F6]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between xl:-mx-8 xl:px-8">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search community questions…"
          className="lg:max-w-sm lg:flex-1"
        />
        <FilterChips options={CATEGORIES} value={activeCategory} onChange={setActiveCategory} />
      </div>

      {filteredPosts.length > 0 ? (
        // A single readable column on phones; two balanced columns once a laptop
        // has the width, so the feed doesn't become one very long strip.
        <div
          data-tour="community"
          className="grid gap-3 lg:grid-cols-2 lg:items-start lg:gap-4"
        >
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
          <MessagesSquare className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No questions here yet</p>
          <p className="max-w-xs text-xs font-medium text-slate-500">
            Be the first to ask about this topic — farmers nearby get notified.
          </p>
        </div>
      )}

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitPost={handleAddPost}
      />
    </Page>
  );
}
