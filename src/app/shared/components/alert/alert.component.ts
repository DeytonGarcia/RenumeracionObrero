// src/app/shared/components/alert/alert.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, Alert } from '../../../core/services/alert.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="alert" [ngClass]="getAlertClasses(alert.type)"
         class="fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white z-50 animate-fade-in-down">
      <div class="flex items-center">
        <ng-container [ngSwitch]="alert.type">
          <svg *ngSwitchCase="'success'" class="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngSwitchCase="'error'" class="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngSwitchCase="'warning'" class="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg *ngSwitchCase="'info'" class="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ng-container>
        <p>{{ alert.message }}</p>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in-down {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fade-in-down 0.3s ease-out forwards;
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: Alert | null = null;
  private alertSubscription!: Subscription; // FIXED: Added definite assignment assertion (!)

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.onAlert()
      .subscribe(alert => {
        this.alert = alert;
        setTimeout(() => this.alert = null, 4000); // Auto-hide after 4 seconds
      });
  }

  getAlertClasses(type: Alert['type']): string {
    switch (type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      case 'info': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
  }
}