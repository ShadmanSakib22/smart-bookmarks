// src/app/features/bookmarks/dashboard/dashboard.component.ts

import { Component, computed, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookmarkService } from '../services/bookmark.service';
import { BookmarkCardComponent } from '../components/bookmark-card/bookmark-card.component';
import { SidebarComponent, FilterCategory } from '../components/sidebar/sidebar.component';
import {
  AddBookmarkModalComponent,
  AddBookmarkData,
} from '../components/add-bookmark-modal/add-bookmark-modal.component';
import { LucideAngularModule } from 'lucide-angular';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { AddCategoryModalComponent } from '../components/add-category-modal/add-category-modal.component';
import { DeleteCategoryModalComponent } from '../components/delete-category-modal/delete-category-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    BookmarkCardComponent,
    SidebarComponent,
    AddBookmarkModalComponent,
    AnalyticsComponent,
    AddCategoryModalComponent,
    DeleteCategoryModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen">
      <app-sidebar
        [activeCategory]="activeCategory()"
        [categoryCounts]="categoryCounts()"
        [categories]="svc.categories()"
        [currentView]="currentView()"
        [isDark]="isDark()"
        (categoryChange)="setCategory($event)"
        (viewChange)="currentView.set($event)"
        (addClick)="showModal.set(true)"
        (importClick)="importFileInput.click()"
        (exportClick)="svc.exportData()"
        (addCategoryClick)="showCategoryModal.set(true)"
        (themeToggle)="toggleTheme()"
        (deleteCategory)="onDeleteCategory($event)"
      />

      <input
        #importFileInput
        type="file"
        accept=".json"
        class="hidden"
        (change)="onImportFile($event)"
      />

      <main class="flex-1 min-w-0 flex flex-col">
        @if (currentView() === 'library') {
          <header class="w-full px-4 lg:px-10 py-3">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 class="text-3xl font-black text-base-content tracking-tight mb-1">
                  {{ activeCategory() === 'All' ? 'Your Library' : activeCategory() }}
                </h1>
                <p class="text-sm text-base-content/50 font-medium italic">
                  {{ filteredBookmarks().length }} items found
                </p>
              </div>

              <div class="form-control">
                <label
                  class="input input-bordered flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary/20"
                >
                  <lucide-icon name="search" class="size-4 opacity-50"></lucide-icon>
                  <input
                    type="search"
                    class="grow border-none focus:ring-0"
                    placeholder="Search bookmarks..."
                    [value]="searchQuery()"
                    (input)="searchQuery.set($any($event.target).value)"
                  />
                </label>
              </div>
            </div>
          </header>

          <section class="min-h-screen bg-base-300 graph-pattern p-4 lg:p-10">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
              *ngIf="filteredBookmarks().length > 0; else emptyState"
            >
              @for (b of filteredBookmarks(); track b.id) {
                <app-bookmark-card
                  [bookmark]="b"
                  (visit)="onVisit($event)"
                  (delete)="onDelete($event)"
                  (copy)="onCopySuccess($event)"
                />
              }
            </div>

            <ng-template #emptyState>
              <div
                class="flex flex-col items-center justify-center py-32 bg-base-100/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-base-300 text-base-content/30"
              >
                <div class="bg-base-200 p-6 rounded-full mb-4">
                  <lucide-icon name="search-x" class="size-12"></lucide-icon>
                </div>
                <h3 class="text-xl font-bold text-base-content/60">No matching bookmarks</h3>
                <p class="text-sm">Try a different search term or category</p>
              </div>
            </ng-template>
          </section>
        } @else {
          <app-analytics />
        }
      </main>

      @if (toastMessage()) {
        <div
          class="fixed bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 lg:translate-x-0 z-100 animate-in fade-in slide-in-from-bottom-5"
        >
          <div
            class="alert bg-neutral text-neutral-content shadow-2xl border-none pr-8 py-4 rounded-2xl min-w-75"
          >
            <lucide-icon name="circle-check-big" class="size-5 text-success"></lucide-icon>
            <span class="font-bold">{{ toastMessage() }}</span>
          </div>
        </div>
      }
    </div>

    @if (showModal()) {
      <app-add-bookmark-modal (confirm)="onAddBookmark($event)" (cancel)="showModal.set(false)" />
    }

    @if (showCategoryModal()) {
      <app-add-category-modal
        (confirm)="onConfirmCategory($event)"
        (cancel)="showCategoryModal.set(false)"
      />
    }

    @if (categoryToDelete()) {
      <app-delete-category-modal
        [categoryName]="categoryToDelete()!"
        (confirm)="onConfirmDeleteCategory()"
        (cancel)="categoryToDelete.set(null)"
      />
    }
  `,
})
export class DashboardComponent {
  readonly svc = inject(BookmarkService);

  readonly activeCategory = signal<FilterCategory>('All');
  readonly currentView = signal<'library' | 'analytics'>('library');
  readonly showModal = signal(false);
  readonly showCategoryModal = signal(false);
  readonly categoryToDelete = signal<string | null>(null);
  readonly isDark = signal(true);
  readonly toastMessage = signal<string | null>(null);
  readonly searchQuery = signal('');

  readonly categoryCounts = computed(() => {
    const bookmarks = this.svc.bookmarks();
    const counts: Record<string, number> = { All: bookmarks.length };
    bookmarks.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  });

  readonly filteredBookmarks = computed(() => {
    const cat = this.activeCategory();
    const q = this.searchQuery().toLowerCase().trim();

    return this.svc
      .bookmarks()
      .filter((b) => cat === 'All' || b.category === cat)
      .filter(
        (b) =>
          !q ||
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q),
      );
  });

  setCategory(cat: FilterCategory): void {
    this.activeCategory.set(cat);
    this.currentView.set('library');
    this.searchQuery.set('');
  }

  onVisit(id: string): void {
    const bm = this.svc.bookmarks().find((b) => b.id === id);
    if (bm) {
      window.open(bm.url, '_blank');
      this.svc.trackVisit(id);
    }
  }

  onDelete(id: string): void {
    this.svc.deleteBookmark(id);
    this.showToast('Bookmark removed');
  }

  onAddBookmark(data: AddBookmarkData): void {
    this.svc.addBookmark(data);
    this.showModal.set(false);
    this.showToast('Added to library!');
  }

  onCopySuccess(_url: string): void {
    this.showToast('Copied to clipboard');
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.svc.importData(content);
      this.showToast('Import successful!');
    };
    reader.readAsText(file);
    input.value = ''; // Reset for next time
  }

  onConfirmCategory(name: string): void {
    this.svc.addCategory(name);
    this.showCategoryModal.set(false);
    this.showToast(`Category "${name}" added`);
  }

  onDeleteCategory(cat: string): void {
    this.categoryToDelete.set(cat);
  }

  onConfirmDeleteCategory(): void {
    const cat = this.categoryToDelete();
    if (cat) {
      this.svc.deleteCategory(cat);
      if (this.activeCategory() === cat) {
        this.activeCategory.set('All');
      }
      this.categoryToDelete.set(null);
      this.showToast(`Category "${cat}" removed`);
    }
  }

  toggleTheme(): void {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    this.isDark.set(next === 'dark');
  }
}
