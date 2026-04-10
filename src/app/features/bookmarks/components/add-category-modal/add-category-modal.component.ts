import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal modal-open">
      <div class="modal-box bg-base-100 rounded-md border border-base-content/5 shadow-2xl p-8">
        <header class="flex items-center gap-4 mb-8">
          <!-- <div class="bg-primary/10 text-primary p-3 rounded-2xl">
            <lucide-icon name="plus" class="size-6"></lucide-icon>
          </div> -->
          <div>
            <h3 class="text-2xl font-black text-base-content tracking-tight">New Category</h3>
            <p class="text-sm text-base-content/50 font-medium font-mono">
              Create a custom space for your links
            </p>
          </div>
        </header>

        <div class="space-y-6">
          <div class="form-control w-full">
            <label class="label mb-2">
              <span
                class="label-text font-bold text-xs uppercase tracking-widest text-base-content/40"
                >Category Name</span
              >
            </label>
            <input
              type="text"
              [(ngModel)]="name"
              placeholder="e.g. Reading List, Recipes..."
              class="input input-bordered w-full h-10 rounded-2xl focus:ring-2 focus:ring-primary/20 bg-base-200/50 border-none font-medium"
              (keydown.enter)="submit()"
              autofocus
            />
          </div>

          <p class="text-error text-sm font-bold flex items-center gap-2" *ngIf="error()">
            <lucide-icon name="circle-alert" class="size-4"></lucide-icon>
            {{ error() }}
          </p>
        </div>

        <div class="modal-action gap-2">
          <button class="btn btn-ghost btn-sm" (click)="cancel.emit()">Cancel</button>
          <button class="btn btn-primary btn-sm" (click)="submit()">Create</button>
        </div>
      </div>
      <div class="modal-backdrop bg-base-300/60 backdrop-blur-sm" (click)="cancel.emit()"></div>
    </div>
  `,
})
export class AddCategoryModalComponent {
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  error = signal('');

  submit(): void {
    const trimmed = this.name.trim();
    if (!trimmed) {
      this.error.set('Please enter a name');
      return;
    }
    this.confirm.emit(trimmed);
  }
}
