// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AlertComponent } from './shared/components/alert/alert.component'; // Ensure correct path

@Component({
  selector: 'app-root',
  standalone: true, // <-- Make this component standalone
  imports: [ // <-- Components, directives, and pipes used in this component's template go here
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AlertComponent // AlertComponent is standalone, so directly importable
  ],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <!-- Navbar -->
      <nav class="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-md text-white">
        <div class="container mx-auto flex justify-between items-center">
          <a routerLink="/" class="text-2xl font-bold tracking-wide">Vallegrande Remuneración</a>
          <div class="space-x-4">
            <a routerLink="/workers" routerLinkActive="font-bold underline" class="hover:text-blue-200">Trabajadores</a>
            <a routerLink="/charges" routerLinkActive="font-bold underline" class="hover:text-blue-200">Cargos</a>
            <a routerLink="/salaries" routerLinkActive="font-bold underline" class="hover:text-blue-200">Salarios</a>
            <a routerLink="/payments" routerLinkActive="font-bold underline" class="hover:text-blue-200">Pagos</a>
          </div>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="container mx-auto p-6 flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Alert Component (fixed position) -->
      <app-alert></app-alert>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white p-4 text-center text-sm">
        <div class="container mx-auto">
          &copy; {{ currentYear }} Vallegrande Remuneración. All rights reserved.
        </div>
      </footer>
    </div>
  `,
  styles: [] // Keep styles inline if they are minimal, or link a .scss file if complex
})
export class App { // <-- This is your root component, not a module
  title = 'vallegrande-remuneracion-frontend';
  currentYear = new Date().getFullYear();
}