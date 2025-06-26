// src/app/features/workers/workers.routes.ts
import { Routes } from '@angular/router';
import { WorkerListComponent } from './worker-list/worker-list.component';
import { WorkerDetailComponent } from './worker-detail/worker-detail.component';
import { WorkerFormComponent } from './worker-form/worker-form.component';

export const WORKER_ROUTES: Routes = [
  { path: '', component: WorkerListComponent },
  { path: 'new', component: WorkerFormComponent },
  { path: ':id', component: WorkerDetailComponent },
  { path: ':id/edit', component: WorkerFormComponent },
];