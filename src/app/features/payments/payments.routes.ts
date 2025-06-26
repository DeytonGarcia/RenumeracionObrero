// src/app/features/payments/payments.routes.ts
import { Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';

export const PAYMENT_ROUTES: Routes = [
  { path: '', component: PaymentListComponent },
  { path: 'new', component: PaymentFormComponent },
  { path: ':id', component: PaymentDetailComponent },
  { path: ':id/edit', component: PaymentFormComponent },
];