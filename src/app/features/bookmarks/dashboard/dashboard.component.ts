// src/app/features/bookmarks/dashboard/dashboard.component.ts

import { Component, computed, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookmarkService } from '../services/bookmark.service';
import { BookmarkCardComponent } from '../components/bookmark-card/bookmark-card.component';
import {
  AddBookmarkModalComponent,
  AddBookmarkData,
} from '../components/add-bookmark-modal/add-bookmark-modal.component';
import { BookmarkCategory } from '../../../core/models/bookmark.model';
import { LucideAngularModule } from 'lucide-angular';

type FilterCategory = 'All' | BookmarkCategory;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    BookmarkCardComponent,
    AddBookmarkModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen bg-base-200/50">
      <aside
        class="w-64 shrink-0 bg-base-100 border-r border-base-300 hidden lg:flex flex-col p-6 gap-8 sticky top-0 h-screen"
      >
        <div class="flex items-center gap-3 px-2">
          <div class="bg-primary p-2 rounded-xl text-primary-content shadow-lg shadow-primary/20">
            <lucide-icon name="bookmark" class="size-6"></lucide-icon>
          </div>
          <span class="text-xl font-black tracking-tight text-base-content">MarkHub</span>
        </div>

        <nav class="flex flex-col gap-1 flex-1">
          <button
            *ngFor="let cat of categories"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            [class]="
              activeCategory() === cat.value
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
            "
            (click)="setCategory(cat.value)"
          >
            <lucide-icon [name]="cat.lucideName" class="size-4.5"></lucide-icon>
            <span class="text-sm font-semibold">{{ cat.label }}</span>
            <span
              class="ml-auto text-[10px] px-2 py-0.5 rounded-full"
              [class]="
                activeCategory() === cat.value
                  ? 'bg-white/20 text-white'
                  : 'bg-base-300 text-base-content/50'
              "
            >
              {{ getCategoryCount(cat.value) }}
            </span>
          </button>
        </nav>

        <div class="flex flex-col gap-3 pt-6 border-t border-base-300">
          <button
            class="btn btn-primary btn-block gap-2 shadow-lg shadow-primary/20"
            (click)="showModal.set(true)"
          >
            <lucide-icon name="plus" class="size-4"></lucide-icon>
            Add New
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button class="btn btn-ghost btn-sm text-xs gap-2" (click)="svc.exportData()">
              <lucide-icon name="download" class="size-3.5"></lucide-icon> Export
            </button>
            <button class="btn btn-ghost btn-sm text-xs gap-2" (click)="toggleTheme()">
              <lucide-icon [name]="isDark() ? 'sun' : 'moon'" class="size-3.5"></lucide-icon> Theme
            </button>
          </div>
        </div>
      </aside>

      <main class="flex-1 min-w-0 flex flex-col gap-8 overflow-y-auto">
        <header
          class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 lg:px-10 mt-6"
        >
          <div>
            <h1 class="text-3xl font-black text-base-content tracking-tight mb-1">
              {{ activeCategory() === 'All' ? 'Your Library' : activeCategory() }}
            </h1>
            <p class="text-sm text-base-content/50 font-medium">
              Managing {{ filteredBookmarks().length }} saved items
            </p>
          </div>

          <label class="input">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              required
              placeholder="Search Bookmarks..."
              [(ngModel)]="searchQuery"
            />
          </label>
        </header>

        <section class="min-h-100 bg-base-300 graph-pattern p-4 lg:p-10">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            *ngIf="filteredBookmarks().length > 0; else emptyState"
          >
            <app-bookmark-card
              *ngFor="let b of filteredBookmarks(); trackBy: trackById"
              [bookmark]="b"
              (visit)="onVisit($event)"
              (delete)="onDelete($event)"
              (copy)="onCopySuccess($event)"
            />
          </div>

          <ng-template #emptyState>
            <div
              class="flex flex-col items-center justify-center py-20 bg-base-100 rounded-3xl border-2 border-dashed border-base-300 text-base-content/30"
            >
              <div class="bg-base-200 p-6 rounded-full mb-4">
                <lucide-icon name="search-x" class="size-12"></lucide-icon>
              </div>
              <h3 class="text-xl font-bold text-base-content/60">No items found</h3>
              <p class="text-sm">Try adjusting your filters or search query</p>
            </div>
          </ng-template>
        </section>
      </main>

      <div
        *ngIf="toastMessage()"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 lg:translate-x-0 z-100 animate-in fade-in slide-in-from-bottom-5"
      >
        <div
          class="alert bg-neutral text-neutral-content shadow-2xl border-none pr-8 py-4 rounded-2xl min-w-75"
        >
          <lucide-icon name="CircleCheckBig" class="size-5 text-success"></lucide-icon>
          <span class="font-bold">{{ toastMessage() }}</span>
        </div>
      </div>
    </div>

    <app-add-bookmark-modal
      *ngIf="showModal()"
      (confirm)="onAddBookmark($event)"
      (cancel)="showModal.set(false)"
    />
  `,
})
export class DashboardComponent {
  readonly svc = inject(BookmarkService);

  readonly activeCategory = signal<FilterCategory>('All');
  readonly showModal = signal(false);
  readonly isDark = signal(true);
  readonly toastMessage = signal<string | null>(null);

  searchQuery = '';

  readonly categories = [
    { label: 'All', value: 'All' as FilterCategory, lucideName: 'layout-grid' },
    { label: 'Development', value: 'Development' as FilterCategory, lucideName: 'code' },
    { label: 'AI', value: 'AI' as FilterCategory, lucideName: 'cpu' },
    { label: 'Social', value: 'Social' as FilterCategory, lucideName: 'users' },
    { label: 'Personal', value: 'Personal' as FilterCategory, lucideName: 'user' },
  ];

  readonly filteredBookmarks = computed(() => {
    const cat = this.activeCategory();
    const q = this.searchQuery.toLowerCase().trim();
    return this.svc
      .bookmarks()
      .filter((b) => cat === 'All' || b.category === cat)
      .filter((b) => !q || b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q));
  });

  getCategoryCount(cat: FilterCategory): number {
    if (cat === 'All') return this.svc.bookmarks().length;
    return this.svc.bookmarks().filter((b) => b.category === cat).length;
  }

  setCategory(cat: FilterCategory): void {
    this.activeCategory.set(cat);
    this.searchQuery = '';
  }

  onVisit(id: string): void {
    const bm = this.svc.bookmarks().find((b) => b.id === id);
    if (bm) window.open(bm.url, '_blank');
    this.svc.trackVisit(id);
  }

  onDelete(id: string): void {
    this.svc.deleteBookmark(id);
    this.showToast('Bookmark deleted');
  }

  onAddBookmark(data: AddBookmarkData): void {
    this.svc.addBookmark(data);
    this.showModal.set(false);
    this.showToast('Bookmark saved successfully!');
  }

  onCopySuccess(url: string): void {
    this.showToast('Link copied to clipboard!');
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  toggleTheme(): void {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    this.isDark.set(next === 'dark');
  }

  trackById(_: number, b: { id: string }): string {
    return b.id;
  }
}
