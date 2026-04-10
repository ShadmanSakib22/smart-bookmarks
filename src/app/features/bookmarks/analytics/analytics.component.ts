import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BookmarkService } from '../services/bookmark.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-4 lg:p-10 space-y-8">
      <!-- Header -->
      <header>
        <h1 class="text-3xl font-bold">Analytics</h1>
        <p class="text-sm opacity-60">Insights into your bookmarking habits</p>
      </header>

      <!-- Stats -->
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-300">
        <div class="stat">
          <div class="stat-figure text-primary">
            <lucide-icon name="bookmark" class="size-6"></lucide-icon>
          </div>
          <div class="stat-title">Bookmarks</div>
          <div class="stat-value">{{ svc.bookmarks().length }}</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <lucide-icon name="mouse-pointer-2" class="size-6"></lucide-icon>
          </div>
          <div class="stat-title">Visits</div>
          <div class="stat-value">{{ svc.totalVisits() }}</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-accent">
            <lucide-icon name="trophy" class="size-6"></lucide-icon>
          </div>

          @if (svc.mostVisited(); as mv) {
            <div class="stat-title">Top Bookmark</div>
            <div class="stat-value text-lg truncate max-w-[200px]">
              {{ mv.title }}
            </div>
            <div class="stat-desc">{{ mv.visitCount }} visits</div>
          } @else {
            <div class="stat-title">Top Bookmark</div>
            <div class="stat-desc">No data yet</div>
          }
        </div>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Bookmarks -->
        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <h2 class="card-title bg-base-300 py-1.5 px-3 rounded-md shadow mb-2">
              <lucide-icon name="trending-up" class="size-5"></lucide-icon>
              Top Bookmarks
            </h2>

            <div class="space-y-3">
              @for (b of svc.top5(); track b.id; let i = $index) {
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="badge badge-primary/10">{{ i + 1 }}</span>
                    <span class="truncate">{{ b.title }}</span>
                  </div>
                  <span class="font-semibold">{{ b.visitCount }}</span>
                </div>
              } @empty {
                <div class="text-sm opacity-50 text-center py-6">No bookmarks visited yet</div>
              }
            </div>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <h2 class="card-title bg-base-300 py-1.5 px-3 rounded-md shadow mb-2">
              <lucide-icon name="chart-pie" class="size-5"></lucide-icon>
              Categories
            </h2>

            <div class="space-y-4">
              @for (item of categoryStats(); track item.name) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ item.name }}</span>
                    <span class="opacity-60">
                      {{ item.count }} ({{ item.percent | number: '1.0-0' }}%)
                    </span>
                  </div>
                  <progress
                    class="progress progress-primary w-full"
                    [value]="item.percent"
                    max="100"
                  ></progress>
                </div>
              } @empty {
                <div class="text-sm opacity-50 text-center py-6">No data available</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent {
  readonly svc = inject(BookmarkService);

  readonly categoryStats = computed(() => {
    const counts = this.svc.categoryCounts();
    const total = this.svc.bookmarks().length;
    if (total === 0) return [];

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percent: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  });
}
