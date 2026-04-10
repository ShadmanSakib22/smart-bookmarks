// src/app/app.config.ts
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  LucideAngularModule,
  Trash2,
  SquareArrowOutUpRight,
  Copy,
  Plus,
  Search,
  LayoutGrid,
  Code,
  Cpu,
  Users,
  User,
  CircleCheckBig,
  Download,
  Sun,
  Moon,
  Bookmark,
  SearchX,
  Link,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Trash2,
        SquareArrowOutUpRight,
        Copy,
        Plus,
        Search,
        LayoutGrid,
        Code,
        Cpu,
        Users,
        User,
        CircleCheckBig,
        Download,
        Sun,
        Moon,
        Bookmark,
        SearchX,
        Link,
      }),
    ),
  ],
};
