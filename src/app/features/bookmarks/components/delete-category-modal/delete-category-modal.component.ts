import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-delete-category-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal modal-open">
      <div class="modal-box bg-base-100 rounded-3xl border border-base-content/5 shadow-2xl p-8 max-w-sm">
        <header class="flex flex-col items-center text-center gap-4 mb-8">
          <div class="bg-error/10 text-error p-4 rounded-full ring-8 ring-error/5">
            <lucide-icon name="triangle-alert" class="size-8"></lucide-icon>
          </div>
          <div>
            <h3 class="text-2xl font-black text-base-content tracking-tight">Delete Category?</h3>
            <p class="text-sm text-base-content/50 font-medium mt-2">
              Are you sure you want to delete <span class="text-base-content font-bold underline decoration-error/30">"{{ categoryName() }}"</span>?
            </p>
          </div>
        </header>

        <div class="bg-base-200/50 rounded-2xl p-4 mb-8">
          <p class="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-1">Warning</p>
          <p class="text-sm text-base-content/70 leading-relaxed font-medium">
            This will permanently remove the category and <span class="text-error font-bold">ALL</span> bookmarks inside it. This action cannot be undone.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <button 
            class="btn btn-error btn-md rounded-2xl font-black tracking-wide gap-2 shadow-lg shadow-error/20" 
            (click)="confirm.emit()"
          >
            <lucide-icon name="trash-2" class="size-4"></lucide-icon>
            Delete Everything
          </button>
          <button 
            class="btn btn-ghost btn-md rounded-2xl font-bold text-base-content/40 hover:text-base-content" 
            (click)="cancel.emit()"
          >
            Go Back
          </button>
        </div>
      </div>
      <div class="modal-backdrop bg-base-300/80 backdrop-blur-md" (click)="cancel.emit()"></div>
    </div>
  `,
})
export class DeleteCategoryModalComponent {
  categoryName = input.required<string>();
  confirm = output<void>();
  cancel = output<void>();
}
