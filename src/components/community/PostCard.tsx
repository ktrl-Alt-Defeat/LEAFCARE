'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, MapPin, Tag } from 'lucide-react';
import { CommunityPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { SafeImage } from '@/components/ui/SafeImage';
import { SpeakButton } from '@/components/voice/SpeakButton';

export interface PostCardProps {
  post: CommunityPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  return (
    <Card className="flex h-full flex-col gap-3 border-slate-100 p-4">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-slate-800 flex items-center justify-center text-xl shadow-inner">
            {post.authorAvatar}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              {post.authorName}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{post.authorLocation}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        <span className="text-[10px] font-bold text-agro-800 bg-agro-100 px-2.5 py-1 rounded-full border border-agro-200">
          {post.cropName}
        </span>
      </div>

      {/* Title & Body */}
      <div className="flex flex-1 items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="mb-1.5 text-sm font-bold leading-snug text-slate-900">
            {post.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">
            {post.content}
          </p>
        </div>

        {/* Attributed, because a post read aloud out of context sounds like
            advice from the app rather than from another farmer. */}
        <SpeakButton
          tone="subtle"
          label={post.title}
          text={[`${post.authorName} from ${post.authorLocation} asks`, post.title, post.content]}
        />
      </div>

      {/* Optional Post Image */}
      {post.imageUrl && (
        <div className="relative mt-1 h-44 w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <SafeImage
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Actions Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-agro-600" />
          <span>{post.category}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 transition-colors ${
              liked ? 'text-rose-600 font-bold' : 'hover:text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>{post.repliesCount} replies</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
