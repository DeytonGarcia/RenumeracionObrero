// src/app/features/workers/worker-form/worker-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkerService } from '../worker.service';
import { AlertService } from '../../../core/services/alert.service';
import { Worker } from '../../../core/models/worker';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.scss'
})
export class WorkerFormComponent implements OnInit {
  workerForm: FormGroup;
  isEditMode: boolean = false;
  workerId: string | null = null;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerService,
    private alertService: AlertService
  ) {
    this.workerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Example: 8 digits for DNI
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\d{9}$/)], // Example: 9 digits for phone
      address: [''],
      hireDate: ['', Validators.required],
      active: [true] // Default to active for new workers
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.workerId = params.get('id');
        if (this.workerId) {
          this.isEditMode = true;
          return this.workerService.getWorkerById(this.workerId);
        } else {
          this.isLoading = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (worker: Worker | null) => {
        if (worker) {
          this.workerForm.patchValue(worker);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading worker:', err);
        this.alertService.showAlert('error', 'Error al cargar los datos del trabajador.');
        this.isLoading = false;
        this.router.navigate(['/workers']);
      }
    });
  }

  onSubmit(): void {
    this.workerForm.markAllAsTouched();
    if (this.workerForm.valid) {
      const workerData: Worker = this.workerForm.value;

      if (this.isEditMode && this.workerId) {
        this.workerService.updateWorker(this.workerId, workerData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Trabajador actualizado correctamente.');
            this.router.navigate(['/workers']);
          },
          error: (err) => {
            console.error('Error updating worker:', err);
            this.alertService.showAlert('error', 'Error al actualizar el trabajador.');
          }
        });
      } else {
        this.workerService.createWorker(workerData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Trabajador creado correctamente.');
            this.router.navigate(['/workers']);
          },
          error: (err) => {
            console.error('Error creating worker:', err);
            this.alertService.showAlert('error', 'Error al crear el trabajador.');
          }
        });
      }
    } else {
      this.alertService.showAlert('warning', 'Por favor, corrige los errores en el formulario.');
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.workerForm.get(controlName);
    // FIXED: Ensure boolean return
    return (control?.touched || control?.dirty || (control && control.value !== '')) && control?.hasError(errorType) || false;
  }
}