// src/app/features/payments/payment-detail/payment-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../payment.service';
import { WorkerService } from '../../workers/worker.service';
import { Payment } from '../../../core/models/payment';
import { Worker } from '../../../core/models/worker';
import { AlertService } from '../../../core/services/alert.service';
import { catchError, of, switchMap } from 'rxjs'; // <-- Import switchMap here

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.scss'
})
export class PaymentDetailComponent implements OnInit {
  payment: Payment | null = null;
  worker: Worker | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private workerService: WorkerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.paymentService.getPaymentById(id).pipe(
            switchMap((payment: Payment | undefined) => { // <-- Explicitly type payment
              if (payment) {
                this.payment = payment;
                return this.workerService.getWorkerById(payment.workerId).pipe(
                  catchError(err => {
                    console.warn(`Worker with ID ${payment.workerId} not found for payment.`, err);
                    return of(null);
                  })
                );
              } else {
                throw new Error('Payment not found');
              }
            }),
            catchError(error => {
              console.error('Error fetching payment details or related data:', error);
              this.alertService.showAlert('error', 'Error al cargar los detalles del pago.');
              this.router.navigate(['/payments']);
              return of(null);
            })
          );
        } else {
          this.alertService.showAlert('error', 'ID de pago no proporcionado.');
          this.router.navigate(['/payments']);
          this.isLoading = false;
          return of(null); // Return observable in else block for switchMap
        }
      })
    ).subscribe((worker: Worker | null) => { // <-- Explicitly type worker here
      this.worker = worker;
      this.isLoading = false;
    });
  }
}