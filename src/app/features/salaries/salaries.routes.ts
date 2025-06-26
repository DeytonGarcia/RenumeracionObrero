// src/app/features/salaries/salaries.routes.ts
import { Routes } from '@angular/router';
import { SalaryListComponent } from './salary-list/salary-list.component';
import { SalaryDetailComponent } from './salary-detail/salary-detail.component';
import { SalaryFormComponent } from './salary-form/salary-form.component';

export const SALARY_ROUTES: Routes = [
  { path: '', component: SalaryListComponent },
  { path: 'new', component: SalaryFormComponent },
  { path: ':id', component: SalaryDetailComponent },
  { path: ':id/edit', component: SalaryFormComponent },
];