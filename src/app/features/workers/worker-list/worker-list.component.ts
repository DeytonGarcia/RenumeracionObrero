// src/app/features/workers/worker-list/worker-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkerService } from '../worker.service';
import { Worker } from '../../../core/models/worker';
import { AlertService } from '../../../core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './worker-list.component.html',
  styleUrl: './worker-list.component.scss'
})
export class WorkerListComponent implements OnInit {
  workers$: Observable<Worker[]>;
  activeWorkers$: Observable<Worker[]>;
  inactiveWorkers$: Observable<Worker[]>;

  filterStatus: 'active' | 'inactive' | 'all' = 'active';
  searchTerm: string = '';

  private refreshWorkers$ = new BehaviorSubject<void>(undefined);

  constructor(
    private workerService: WorkerService,
    private alertService: AlertService
  ) {
    this.workers$ = this.refreshWorkers$.pipe(
      switchMap(() => this.workerService.getAllWorkers()),
      map(workers => workers.sort((a, b) => {
        // Sort by active status first (active first), then by last name, then first name
        if (a.active !== b.active) {
          return a.active ? -1 : 1; // Active comes before inactive
        }
        const lastNameComparison = a.lastName.localeCompare(b.lastName);
        if (lastNameComparison !== 0) {
          return lastNameComparison;
        }
        return a.firstName.localeCompare(b.firstName);
      }))
    );

    const searchTerm$ = new BehaviorSubject(this.searchTerm);
    this.workers$ = combineLatest([
      this.refreshWorkers$.pipe(switchMap(() => this.workerService.getAllWorkers())),
      searchTerm$.pipe(startWith(this.searchTerm))
    ]).pipe(
      map(([workers, term]) => {
        const lowerCaseTerm = term.toLowerCase();
        return workers.filter(worker =>
          worker.firstName.toLowerCase().includes(lowerCaseTerm) ||
          worker.lastName.toLowerCase().includes(lowerCaseTerm) ||
          worker.dni.toLowerCase().includes(lowerCaseTerm) ||
          worker.position.toLowerCase().includes(lowerCaseTerm)
        ).sort((a, b) => {
          if (a.active !== b.active) {
            return a.active ? -1 : 1;
          }
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) {
            return lastNameComparison;
          }
          return a.firstName.localeCompare(b.firstName);
        });
      })
    );


    this.activeWorkers$ = this.workers$.pipe(
      map(workers => workers.filter(worker => worker.active))
    );
    this.inactiveWorkers$ = this.workers$.pipe(
      map(workers => workers.filter(worker => !worker.active))
    );

    // Subscribe to search term changes to update the observable
    // This is crucial if searchTerm is updated via ngModel
    // We bind (input)="onSearchChange()" to update the subject
    // For ngModel, simply referencing `this.searchTerm` in the `combineLatest`
    // will react to changes automatically as long as the component is alive.
    // No explicit subscription here is strictly necessary if the template updates the property.
  }

  ngOnInit(): void {
    this.refreshWorkers$.next();
  }

  // Called when input changes to trigger the search term update
  onSearchChange(): void {
    // The `searchTerm` property is updated by `[(ngModel)]`.
    // The `combineLatest` observable will automatically react to this change
    // because `searchTerm$` (which uses `startWith(this.searchTerm)`) will implicitly re-evaluate.
    // If we had a direct `BehaviorSubject` for `searchTerm` (`this.searchTermSubject.next(this.searchTerm);`),
    // it would be more explicit. For simplicity with ngModel, this is fine.
  }

  softDeleteWorker(id: string, name: string): void {
    if (confirm(`¿Estás seguro de que quieres inactivar a ${name}?`)) {
      this.workerService.softDeleteWorker(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `${name} ha sido inactivado correctamente.`);
          this.refreshWorkers$.next();
        },
        error: (err) => {
          console.error('Error inactivando trabajador:', err);
          this.alertService.showAlert('error', `Error al inactivar a ${name}.`);
        }
      });
    }
  }

  restoreWorker(id: string, name: string): void {
    if (confirm(`¿Estás seguro de que quieres restaurar a ${name} (activar)?`)) {
      this.workerService.restoreWorker(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `${name} ha sido restaurado y está activo.`);
          this.refreshWorkers$.next();
        },
        error: (err) => {
          console.error('Error restaurando trabajador:', err);
          this.alertService.showAlert('error', `Error al restaurar a ${name}.`);
        }
      });
    }
  }
}