import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BookmarkCategory } from '../../../../core/models/bookmark.model';

export type FilterCategory = 'All' | BookmarkCategory;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <aside
      class="w-72 hidden lg:flex flex-col h-screen sticky top-0
             bg-base-100/80 backdrop-blur-xl border-r border-base-content/5 overflow-hidden"
    >
      <!-- Logo -->
      <div class="p-4 flex items-center gap-2">
        <lucide-icon name="star-half" class="size-7"></lucide-icon>
        <span
          class="text-2xl font-black tracking-tight bg-clip-text text-transparent
                 bg-linear-to-r from-base-content to-base-content/60"
        >
          MarkHub
        </span>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-h-0 flex flex-col px-4 py-4">
        <!-- Views -->
        <div class="flex flex-col gap-1.5 mb-8">
          <button
            class="flex items-center gap-3.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all"
            [ngClass]="
              currentView() === 'library'
                ? 'bg-primary text-primary-content shadow-xl shadow-primary/25'
                : 'text-base-content/60 hover:bg-base-200/50 hover:text-base-content'
            "
            (click)="viewChange.emit('library')"
          >
            <lucide-icon name="library" class="size-5"></lucide-icon>
            Library
          </button>

          <button
            class="flex items-center gap-3.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all"
            [ngClass]="
              currentView() === 'analytics'
                ? 'bg-primary text-primary-content shadow-xl shadow-primary/25'
                : 'text-base-content/60 hover:bg-base-200/50 hover:text-base-content'
            "
            (click)="viewChange.emit('analytics')"
          >
            <lucide-icon name="chart-column" class="size-5"></lucide-icon>
            Analytics
          </button>
        </div>

        <!-- Category Header -->
        <div class="flex items-center justify-between px-2 mb-3">
          <span class="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
            Categories
          </span>
          <button
            (click)="addCategoryClick.emit()"
            class="p-1 hover:bg-base-200 rounded-lg transition text-base-content/40 hover:text-primary"
          >
            <lucide-icon name="plus" class="size-4"></lucide-icon>
          </button>
        </div>

        <!-- Scroll Area -->
        <div class="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          <nav class="flex flex-col gap-1.5">
            <!-- All -->
            <button
              class="flex items-center gap-3.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all"
              [ngClass]="
                activeCategory() === 'All'
                  ? 'bg-secondary text-secondary-content shadow-md shadow-secondary/25'
                  : 'text-base-content/60 hover:bg-base-200/50 hover:text-base-content'
              "
              (click)="categoryChange.emit('All')"
            >
              <lucide-icon name="layout-grid" class="size-5"></lucide-icon>
              All Library
              <span
                class="ml-auto text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur-md"
                [ngClass]="
                  activeCategory() === 'All'
                    ? 'bg-black/20 text-white'
                    : 'bg-base-300/50 text-base-content/40'
                "
              >
                {{ categoryCounts()['All'] || 0 }}
              </span>
            </button>

            <!-- Dynamic Categories -->
            @for (cat of categories(); track cat.value) {
              <div class="relative group/cat">
                <button
                  class="w-full flex items-center gap-3.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all"
                  [ngClass]="
                    activeCategory() === cat.value
                      ? 'bg-accent text-accent-content shadow-md shadow-accent/25'
                      : 'text-base-content/60 hover:bg-base-200/50 hover:text-base-content'
                  "
                  (click)="categoryChange.emit(cat.value)"
                >
                  <lucide-icon [name]="cat.lucideName" class="size-5"></lucide-icon>
                  {{ cat.label }}

                  <span
                    class="ml-auto text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur-md transition-all group-hover/cat:opacity-0"
                    [ngClass]="
                      activeCategory() === cat.value
                        ? 'bg-black/30 text-white'
                        : 'bg-base-300/50 text-base-content/40'
                    "
                  >
                    {{ categoryCounts()[cat.value] || 0 }}
                  </span>
                </button>

                <button
                  (click)="$event.stopPropagation(); deleteCategory.emit(cat.value)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-error/40 opacity-0 group-hover/cat:opacity-100 transition hover:text-error"
                >
                  <lucide-icon name="trash-2" class="size-3.5"></lucide-icon>
                </button>
              </div>
            }
          </nav>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 bg-base-200/30 backdrop-blur-md border-t border-base-content/5">
        <button
          class="btn btn-primary btn-sm btn-block gap-3 border-none group"
          (click)="addClick.emit()"
        >
          <lucide-icon name="plus" class="size-4"></lucide-icon>
          <span class="font-bold tracking-wide">Add Bookmark</span>
        </button>

        <div class="grid grid-cols-3 gap-2 mt-4">
          <button
            class="btn btn-ghost btn-sm h-12 flex flex-col gap-1"
            (click)="importClick.emit()"
          >
            <lucide-icon name="upload" class="size-4"></lucide-icon>
            <span class="text-[9px] font-black uppercase">Import</span>
          </button>

          <button
            class="btn btn-ghost btn-sm h-12 flex flex-col gap-1"
            (click)="exportClick.emit()"
          >
            <lucide-icon name="download" class="size-4"></lucide-icon>
            <span class="text-[9px] font-black uppercase">Export</span>
          </button>

          <button
            class="btn btn-ghost btn-sm h-12 flex flex-col gap-1"
            (click)="themeToggle.emit()"
          >
            <lucide-icon [name]="isDark() ? 'sun' : 'moon'" class="size-4"></lucide-icon>
            <span class="text-[9px] font-black uppercase">Theme</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Scrollbar -->
    <style>
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: oklch(var(--bc) / 0.1);
        border-radius: 10px;
      }
    </style>
  `,
})
export class SidebarComponent {
  activeCategory = input.required<FilterCategory>();
  categoryCounts = input.required<Record<string, number>>();
  categories = input.required<{ label: string; value: string; lucideName: string }[]>();
  currentView = input.required<'library' | 'analytics'>();
  isDark = input.required<boolean>();

  categoryChange = output<FilterCategory>();
  viewChange = output<'library' | 'analytics'>();
  addClick = output<void>();
  importClick = output<void>();
  exportClick = output<void>();
  addCategoryClick = output<void>();
  themeToggle = output<void>();
  deleteCategory = output<string>();
}
