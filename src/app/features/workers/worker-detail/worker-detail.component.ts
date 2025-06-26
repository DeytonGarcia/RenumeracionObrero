// src/app/features/workers/worker-detail/worker-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkerService } from '../worker.service';
import { Worker } from '../../../core/models/worker';
import { AlertService } from '../../../core/services/alert.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-worker-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './worker-detail.component.html',
  styleUrl: './worker-detail.component.scss'
})
export class WorkerDetailComponent implements OnInit {
  worker: Worker | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.workerService.getWorkerById(id).pipe(
          catchError(error => {
            console.error('Error fetching worker details:', error);
            this.alertService.showAlert('error', 'Error al cargar los detalles del trabajador.');
            this.router.navigate(['/workers']); // Redirect to list on error
            return of(null); // Return an observable of null to continue stream
          })
        ).subscribe(worker => {
          this.worker = worker;
          this.isLoading = false;
        });
      } else {
        this.alertService.showAlert('error', 'ID de trabajador no proporcionado.');
        this.router.navigate(['/workers']);
        this.isLoading = false;
      }
    });
  }

  // Helper for date formatting in template if needed (using DatePipe better)
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString; // Fallback if invalid date
    }
  }
}