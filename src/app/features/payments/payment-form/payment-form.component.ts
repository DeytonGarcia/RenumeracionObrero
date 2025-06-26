// src/app/features/payments/payment-form/payment-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../payment.service';
import { WorkerService } from '../../workers/worker.service';
import { AlertService } from '../../../core/services/alert.service';
import { Payment } from '../../../core/models/payment';
import { Worker } from '../../../core/models/worker';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  isEditMode: boolean = false;
  paymentId: string | null = null;
  workers: Worker[] = [];
  isLoading: boolean = true;
  // FIXED: Added paymentTypes and paymentStatuses arrays
  paymentTypes: string[] = ['Salario', 'Bonificación', 'Comisión', 'Deducción', 'Reembolso'];
  paymentStatuses: string[] = ['Pendiente', 'Pagado', 'Rechazado', 'Cancelado'];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private workerService: WorkerService,
    private alertService: AlertService
  ) {
    this.paymentForm = this.fb.group({
      workerId: ['', Validators.required],
      paymentType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      paymentDate: ['', Validators.required],
      description: [''],
      // Assuming 'status' is also a field in your Payment model for dropdown
      status: ['Pendiente', Validators.required], // FIXED: Added status with default value
      active: [true] // Default to active for new payments
    });
  }

  ngOnInit(): void {
    this.workerService.getAllWorkers().subscribe({
      next: (data) => {
        this.workers = data;
        this.route.paramMap.pipe(
          switchMap(params => {
            this.paymentId = params.get('id');
            if (this.paymentId) {
              this.isEditMode = true;
              return this.paymentService.getPaymentById(this.paymentId);
            } else {
              this.isLoading = false;
              return of(null);
            }
          })
        ).subscribe({
          next: (payment: Payment | null) => {
            if (payment) {
              this.paymentForm.patchValue(payment);
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading payment:', err);
            this.alertService.showAlert('error', 'Error al cargar los datos del pago.');
            this.isLoading = false;
            this.router.navigate(['/payments']);
          }
        });
      },
      error: (err) => {
        console.error('Error loading workers:', err);
        this.alertService.showAlert('error', 'Error al cargar la lista de trabajadores.');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.valid) {
      const paymentData: Payment = this.paymentForm.value;

      if (this.isEditMode && this.paymentId) {
        this.paymentService.updatePayment(this.paymentId, paymentData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Pago actualizado correctamente.');
            this.router.navigate(['/payments']);
          },
          error: (err) => {
            console.error('Error updating payment:', err);
            this.alertService.showAlert('error', 'Error al actualizar el pago.');
          }
        });
      } else {
        this.paymentService.createPayment(paymentData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Pago creado correctamente.');
            this.router.navigate(['/payments']);
          },
          error: (err) => {
            console.error('Error creating payment:', err);
            this.alertService.showAlert('error', 'Error al crear el pago.');
          }
        });
      }
    } else {
      this.alertService.showAlert('warning', 'Por favor, corrige los errores en el formulario.');
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.paymentForm.get(controlName);
    // FIXED: Ensure boolean return
    return (control?.touched || control?.dirty || (control && control.value !== '')) && control?.hasError(errorType) || false;
  }
}