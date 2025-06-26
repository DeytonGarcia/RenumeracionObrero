import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'workers', pathMatch: 'full' },
  {
    path: 'workers',
    loadChildren: () => import('./features/workers/workers.routes').then(m => m.WORKER_ROUTES)
  },
  {
    path: 'charges',
    loadChildren: () => import('./features/charges/charges.routes').then(m => m.CHARGE_ROUTES)
  },
  {
    path: 'salaries',
    loadChildren: () => import('./features/salaries/salaries.routes').then(m => m.SALARY_ROUTES)
  },
  {
    path: 'payments',
    loadChildren: () => import('./features/payments/payments.routes').then(m => m.PAYMENT_ROUTES)
  },
  { path: '**', redirectTo: 'workers' }
];