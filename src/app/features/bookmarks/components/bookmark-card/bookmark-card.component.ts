import { Component, input, output, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bookmark } from '../../../../core/models/bookmark.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-bookmark-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="card bg-base-100 border-2 border-base-100 shadow hover:border-primary/30 transition-colors duration-300"
    >
      <div class="card-body p-4">
        <div class="flex items-start gap-3">
          <div class="avatar">
            <div
              class="w-12 h-12 inset rounded-full bg-base-200 flex items-center justify-center ring-1 ring-base-300 overflow-hidden"
            >
              @if (!imageFailed()) {
                <img
                  [src]="faviconUrl()"
                  [alt]="bookmark().title"
                  class="size-9 object-contain rounded-full"
                  (error)="onImgError()"
                />
              } @else {
                <lucide-icon name="link" class="size-6 text-base-content/30"></lucide-icon>
              }
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span
                class="badge badge-ghost badge-sm text-[10px] uppercase tracking-wider font-bold opacity-70"
              >
                {{ bookmark().category }}
              </span>
              <span class="text-[10px] text-base-content/50 font-medium">
                {{ bookmark().visitCount }} visits
              </span>
            </div>
            <h3 class="font-bold text-base truncate group-hover:text-primary transition-colors">
              {{ bookmark().title }}
            </h3>
            <p class="text-xs text-base-content/50 truncate font-mono">{{ displayUrl() }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4 pt-3 border-t border-base-200">
          <div class="text-[10px] text-base-content/40 italic">
            @if (bookmark().lastVisited) {
              Active {{ bookmark().lastVisited | date: 'shortDate' }}
            } @else {
              Not visited yet
            }
          </div>

          <div class="flex gap-1">
            <button
              class="btn btn-ghost btn-xs btn-square text-base-content/30 hover:text-error hover:bg-error/10 transition-colors"
              (click)="delete.emit(bookmark().id)"
              title="Remove Bookmark"
            >
              <lucide-icon name="trash-2" class="size-4"></lucide-icon>
            </button>

            <button
              class="btn btn-ghost btn-xs btn-square text-base-content/30 hover:text-primary hover:bg-primary/10 transition-colors"
              (click)="onCopy()"
              title="Copy Link"
            >
              <lucide-icon name="copy" class="size-4"></lucide-icon>
            </button>

            <button
              class="btn btn-primary btn-xs transition-colors gap-1.5 ml-2"
              (click)="visit.emit(bookmark().id)"
            >
              Visit
              <lucide-icon name="square-arrow-out-up-right" class="size-3.5"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BookmarkCardComponent {
  bookmark = input.required<Bookmark>();

  visit = output<string>();
  delete = output<string>();
  copy = output<string>();

  faviconUrl = computed(() => {
    try {
      const domain = new URL(this.bookmark().url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  });

  displayUrl = computed(() => {
    try {
      return new URL(this.bookmark().url).hostname.replace('www.', '');
    } catch {
      return this.bookmark().url;
    }
  });

  onCopy(): void {
    navigator.clipboard.writeText(this.bookmark().url);
    this.copy.emit(this.bookmark().url);
  }

  imageFailed = signal(false);
  onImgError(): void {
    this.imageFailed.set(true);
  }
}
