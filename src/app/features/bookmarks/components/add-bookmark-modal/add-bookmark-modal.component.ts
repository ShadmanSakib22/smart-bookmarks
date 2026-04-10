import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BookmarkCategory } from '../../../../core/models/bookmark.model';
import { BookmarkService } from '../../services/bookmark.service';

export interface AddBookmarkData {
  title: string;
  url: string;
  category: BookmarkCategory;
}

@Component({
  selector: 'app-add-bookmark-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal modal-open">
      <div class="modal-box bg-base-100 rounded-md border border-base-content/5 shadow-2xl p-8">
        <!-- Header -->
        <header class="flex items-center gap-4 mb-8">
          <div>
            <h3 class="text-2xl font-black text-base-content tracking-tight">Add Bookmark</h3>
            <p class="text-sm text-base-content/50 font-medium font-mono">
              Save and organize your favorite links
            </p>
          </div>
        </header>

        <!-- Form -->
        <div class="space-y-6">
          <!-- Title -->
          <div class="form-control w-full">
            <label class="label mb-2">
              <span
                class="label-text font-bold text-xs uppercase tracking-widest text-base-content/40"
              >
                Title
              </span>
            </label>
            <input
              type="text"
              [(ngModel)]="title"
              placeholder="e.g. YouTube, Docs..."
              class="input input-bordered w-full h-10 rounded-2xl
                     focus:ring-2 focus:ring-primary/20
                     bg-base-200/50 border-none font-medium"
              (keydown.enter)="submit()"
            />
          </div>

          <!-- URL -->
          <div class="form-control w-full">
            <label class="label mb-2">
              <span
                class="label-text font-bold text-xs uppercase tracking-widest text-base-content/40"
              >
                URL
              </span>
            </label>
            <input
              type="url"
              [(ngModel)]="url"
              placeholder="https://example.com"
              class="input input-bordered w-full h-10 rounded-2xl
                     focus:ring-2 focus:ring-primary/20
                     bg-base-200/50 border-none font-medium"
              (keydown.enter)="submit()"
            />
          </div>

          <!-- Category -->
          <div class="form-control w-full">
            <label class="label mb-2">
              <span
                class="label-text font-bold text-xs uppercase tracking-widest text-base-content/40"
              >
                Category
              </span>
            </label>
            <select
              [(ngModel)]="category"
              class="select w-full h-10 rounded-2xl
                     bg-base-200/50 border-none font-medium
                     focus:ring-2 focus:ring-primary/20"
            >
              <optgroup label="Default">
                @for (c of svc.categories(); track c.value) {
                  <option [value]="c.value">{{ c.label }}</option>
                }
              </optgroup>
            </select>
          </div>

          <!-- Error -->
          <p class="text-error text-sm font-bold flex items-center gap-2" *ngIf="error()">
            <lucide-icon name="circle-alert" class="size-4"></lucide-icon>
            {{ error() }}
          </p>
        </div>

        <!-- Actions -->
        <div class="modal-action gap-2">
          <button class="btn btn-ghost btn-sm" (click)="cancel.emit()">Cancel</button>
          <button class="btn btn-primary btn-sm" (click)="submit()">Add</button>
        </div>
      </div>

      <!-- Backdrop -->
      <div class="modal-backdrop bg-base-300/60 backdrop-blur-sm" (click)="cancel.emit()"></div>
    </div>
  `,
})
export class AddBookmarkModalComponent {
  @Output() confirm = new EventEmitter<AddBookmarkData>();
  @Output() cancel = new EventEmitter<void>();

  readonly svc = inject(BookmarkService);

  title = '';
  url = '';
  category: BookmarkCategory = this.svc.categories()[0]?.value || '';
  error = signal('');

  submit(): void {
    this.error.set('');

    if (!this.title.trim()) {
      this.error.set('Title is required.');
      return;
    }

    if (!this.url.trim()) {
      this.error.set('URL is required.');
      return;
    }

    try {
      new URL(this.url);
    } catch {
      this.error.set('Invalid URL.');
      return;
    }

    this.confirm.emit({
      title: this.title.trim(),
      url: this.url.trim(),
      category: this.category,
    });
  }
}
