// src/app/core/models/bookmark.model.ts

export type BookmarkCategory = 'Social' | 'Development' | 'AI' | 'Personal';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: BookmarkCategory;
  visitCount: number;
  lastVisited: Date | null;
  icon: string;
}
