// src/app/features/charges/charges.routes.ts
import { Routes } from '@angular/router';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { ChargeDetailComponent } from './charge-detail/charge-detail.component';
import { ChargeFormComponent } from './charge-form/charge-form.component';

export const CHARGE_ROUTES: Routes = [
  { path: '', component: ChargeListComponent },
  { path: 'new', component: ChargeFormComponent },
  { path: ':id', component: ChargeDetailComponent },
  { path: ':id/edit', component: ChargeFormComponent },
];