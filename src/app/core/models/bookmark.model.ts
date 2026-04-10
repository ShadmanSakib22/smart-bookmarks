// src/app/core/models/bookmark.model.ts

export type BookmarkCategory = string;

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: BookmarkCategory;
  visitCount: number;
  lastVisited: Date | null;
  icon: string;
}
