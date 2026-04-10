import { Component, input, output, signal } from '@angular/core';
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
      class="w-64 shrink-0 bg-base-100 border-r border-base-300 hidden lg:flex flex-col p-6 gap-8 sticky top-0 h-screen"
    >
      <div class="flex items-center gap-3 px-2">
        <div class="bg-primary p-2 rounded-xl text-primary-content shadow-lg shadow-primary/20">
          <lucide-icon name="bookmark" class="size-6"></lucide-icon>
        </div>
        <span class="text-xl font-black tracking-tight text-base-content">MarkHub</span>
      </div>

      <nav class="flex flex-col gap-1 flex-1">
        @for (cat of categories; track cat.value) {
          <button
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            [class]="
              activeCategory() === cat.value
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
            "
            (click)="categoryChange.emit(cat.value)"
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
              {{ categoryCounts()[cat.value] || 0 }}
            </span>
          </button>
        }
      </nav>

      <div class="flex flex-col gap-3 pt-6 border-t border-base-300">
        <button
          class="btn btn-primary btn-block gap-2 shadow-lg shadow-primary/20"
          (click)="addClick.emit()"
        >
          <lucide-icon name="plus" class="size-4"></lucide-icon>
          Add New
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button class="btn btn-ghost btn-sm text-xs gap-2" (click)="exportClick.emit()">
            <lucide-icon name="download" class="size-3.5"></lucide-icon> Export
          </button>
          <button class="btn btn-ghost btn-sm text-xs gap-2" (click)="themeToggle.emit()">
            <lucide-icon [name]="isDark() ? 'sun' : 'moon'" class="size-3.5"></lucide-icon> Theme
          </button>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  activeCategory = input.required<FilterCategory>();
  categoryCounts = input.required<Record<string, number>>();
  isDark = input.required<boolean>();

  categoryChange = output<FilterCategory>();
  addClick = output<void>();
  exportClick = output<void>();
  themeToggle = output<void>();

  readonly categories = [
    { label: 'All', value: 'All' as FilterCategory, lucideName: 'layout-grid' },
    { label: 'Development', value: 'Development' as FilterCategory, lucideName: 'code' },
    { label: 'AI', value: 'AI' as FilterCategory, lucideName: 'cpu' },
    { label: 'Social', value: 'Social' as FilterCategory, lucideName: 'users' },
    { label: 'Personal', value: 'Personal' as FilterCategory, lucideName: 'user' },
  ];
}
