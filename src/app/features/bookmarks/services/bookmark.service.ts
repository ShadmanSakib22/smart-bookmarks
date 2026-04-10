// src/app/features/bookmarks/services/bookmark.service.ts

import { Injectable, computed, signal } from '@angular/core';
import { Bookmark, BookmarkCategory } from '../../../core/models/bookmark.model';
import { StorageService } from '../../../core/services/storage.service';

const STORAGE_KEY = 'markhub_bookmarks';
const CATEGORIES_KEY = 'markhub_categories';

const DEFAULT_CATEGORIES = [
  { label: 'Development', value: 'Development', lucideName: 'code' },
  { label: 'AI', value: 'AI', lucideName: 'cpu' },
  { label: 'Social', value: 'Social', lucideName: 'users' },
  { label: 'Personal', value: 'Personal', lucideName: 'user' },
];

const SEED_DATA: Bookmark[] = [
  // Development
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '2',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '3',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '4',
    title: 'Angular Docs',
    url: 'https://angular.dev',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '5',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '6',
    title: 'TypeScript',
    url: 'https://typescriptlang.org',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '7',
    title: 'Vercel',
    url: 'https://vercel.com',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '8',
    title: 'Netlify',
    url: 'https://netlify.com',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '9',
    title: 'npm',
    url: 'https://npmjs.com',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '10',
    title: 'CodePen',
    url: 'https://codepen.io',
    category: 'Development',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },

  // AI
  {
    id: '11',
    title: 'Claude',
    url: 'https://claude.ai',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '12',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '13',
    title: 'Gemini',
    url: 'https://gemini.google.com',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '14',
    title: 'Perplexity',
    url: 'https://perplexity.ai',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '15',
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '16',
    title: 'Midjourney',
    url: 'https://midjourney.com',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '17',
    title: 'Replicate',
    url: 'https://replicate.com',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '18',
    title: 'Together AI',
    url: 'https://together.ai',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '19',
    title: 'Groq',
    url: 'https://groq.com',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '20',
    title: 'Anthropic',
    url: 'https://anthropic.com',
    category: 'AI',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },

  // Social
  {
    id: '21',
    title: 'X (Twitter)',
    url: 'https://x.com',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '22',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '23',
    title: 'Reddit',
    url: 'https://reddit.com',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '24',
    title: 'Discord',
    url: 'https://discord.com',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '25',
    title: 'YouTube',
    url: 'https://youtube.com',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '26',
    title: 'Dev.to',
    url: 'https://dev.to',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '27',
    title: 'Hashnode',
    url: 'https://hashnode.com',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '28',
    title: 'Mastodon',
    url: 'https://mastodon.social',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '29',
    title: 'Bluesky',
    url: 'https://bsky.app',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '30',
    title: 'Twitch',
    url: 'https://twitch.tv',
    category: 'Social',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },

  // Personal
  {
    id: '31',
    title: 'Google Drive',
    url: 'https://drive.google.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '32',
    title: 'Notion',
    url: 'https://notion.so',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '33',
    title: 'Obsidian',
    url: 'https://obsidian.md',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '34',
    title: 'Todoist',
    url: 'https://todoist.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '35',
    title: 'Figma',
    url: 'https://figma.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '36',
    title: 'Spotify',
    url: 'https://spotify.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '37',
    title: 'Medium',
    url: 'https://medium.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '38',
    title: 'Pocket',
    url: 'https://getpocket.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '39',
    title: 'Trello',
    url: 'https://trello.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
  {
    id: '40',
    title: 'Google Calendar',
    url: 'https://calendar.google.com',
    category: 'Personal',
    visitCount: 0,
    lastVisited: null,
    icon: '',
  },
];

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly _bookmarks = signal<Bookmark[]>([]);
  private readonly _categories = signal<{ label: string; value: string; lucideName: string }[]>([]);

  readonly bookmarks = this._bookmarks.asReadonly();
  readonly categories = this._categories.asReadonly();

  readonly totalVisits = computed(() =>
    this._bookmarks().reduce((sum, b) => sum + b.visitCount, 0),
  );

  readonly mostVisited = computed(
    () => [...this._bookmarks()].sort((a, b) => b.visitCount - a.visitCount)[0] ?? null,
  );

  readonly categoryCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const b of this._bookmarks()) {
      counts[b.category] = (counts[b.category] ?? 0) + 1;
    }
    return counts;
  });

  readonly top5 = computed(() =>
    [...this._bookmarks()].sort((a, b) => b.visitCount - a.visitCount).slice(0, 5),
  );

  constructor(private storage: StorageService) {
    this.load();
  }

  private load(): void {
    const stored = this.storage.get<Bookmark[]>(STORAGE_KEY);
    if (stored && stored.length > 0) {
      this._bookmarks.set(
        stored.map((b) => ({ ...b, lastVisited: b.lastVisited ? new Date(b.lastVisited) : null })),
      );
    } else {
      this._bookmarks.set(SEED_DATA);
      this.persist();
    }

    const storedCats = this.storage.get<{ label: string; value: string; lucideName: string }[]>(
      CATEGORIES_KEY,
    );
    if (storedCats && storedCats.length > 0) {
      this._categories.set(storedCats);
    } else {
      this._categories.set(DEFAULT_CATEGORIES);
      this.persistCategories();
    }
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._bookmarks());
  }

  private persistCategories(): void {
    this.storage.set(CATEGORIES_KEY, this._categories());
  }

  trackVisit(id: string): void {
    this._bookmarks.update((list) =>
      list.map((b) =>
        b.id === id ? { ...b, visitCount: b.visitCount + 1, lastVisited: new Date() } : b,
      ),
    );
    this.persist();
  }

  addBookmark(data: Omit<Bookmark, 'id' | 'visitCount' | 'lastVisited' | 'icon'>): void {
    const newBookmark: Bookmark = {
      ...data,
      id: crypto.randomUUID(),
      visitCount: 0,
      lastVisited: null,
      icon: '',
    };
    this._bookmarks.update((list) => [...list, newBookmark]);
    this.persist();
  }

  deleteBookmark(id: string): void {
    this._bookmarks.update((list) => list.filter((b) => b.id !== id));
    this.persist();
  }

  getByCategory(category: BookmarkCategory | 'All'): Bookmark[] {
    if (category === 'All') return this._bookmarks();
    return this._bookmarks().filter((b) => b.category === category);
  }

  exportData(): void {
    const data = {
      bookmarks: this._bookmarks(),
      categories: this._categories(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markhub-bookmarks-full.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importData(json: string): void {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        // Legacy or simple import
        this._bookmarks.set(
          parsed.map((b) => ({ ...b, lastVisited: b.lastVisited ? new Date(b.lastVisited) : null })),
        );
      } else if (parsed.bookmarks && parsed.categories) {
        // New combined format
        this._bookmarks.set(
          parsed.bookmarks.map((b: any) => ({
            ...b,
            lastVisited: b.lastVisited ? new Date(b.lastVisited) : null,
          })),
        );
        this._categories.set(parsed.categories);
        this.persistCategories();
      }
      this.persist();
    } catch {
      console.error('Invalid import data');
    }
  }

  addCategory(label: string): void {
    const value = label;
    if (this._categories().some((c) => c.value === value)) return;

    this._categories.update((prev) => [...prev, { label, value, lucideName: 'folder' }]);
    this.persistCategories();
  }

  deleteCategory(value: string): void {
    this._categories.update((list) => list.filter((c) => c.value !== value));
    this._bookmarks.update((list) => list.filter((b) => b.category !== value));
    this.persistCategories();
    this.persist();
  }

  getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  }
}
