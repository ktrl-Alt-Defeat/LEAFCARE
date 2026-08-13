'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (post: { title: string; content: string; cropName: string; category: string }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cropName, setCropName] = useState('Tomato');
  const [category, setCategory] = useState('Disease Help');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmitPost({ title, content, cropName, category: category as never });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ask the Farming Community">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Question Title:
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., How to control leaf curling on chili plants?"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-agro-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Crop:
            </label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
            >
              <option value="Tomato">Tomato</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Chili">Chili</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
            >
              <option value="Disease Help">Disease Help</option>
              <option value="Crop Advice">Crop Advice</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Weather">Weather</option>
              <option value="General Farming">General Farming</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Details:
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your crop symptoms, weather conditions, or question..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-agro-500 focus:bg-white resize-none"
          />
        </div>

        <Button type="submit" size="lg" fullWidth>
          Post Question
        </Button>
      </form>
    </Modal>
  );
};
