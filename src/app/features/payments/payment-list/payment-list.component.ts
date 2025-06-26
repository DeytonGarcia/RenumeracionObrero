// src/app/features/payments/payment-list/payment-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../payment.service';
import { WorkerService } from '../../workers/worker.service';
import { Payment } from '../../../core/models/payment';
import { Worker } from '../../../core/models/worker';
import { AlertService } from '../../../core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, startWith, switchMap } from 'rxjs';

// Define a new interface that includes workerName
interface PaymentViewModel extends Payment {
  workerName: string;
}

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss'
})
export class PaymentListComponent implements OnInit {
  payments$: Observable<PaymentViewModel[]>; // <-- Use the new ViewModel
  activePayments$: Observable<PaymentViewModel[]>;
  inactivePayments$: Observable<PaymentViewModel[]>;

  filterStatus: 'active' | 'inactive' | 'all' = 'active';
  searchTerm: string = '';

  private refreshPayments$ = new BehaviorSubject<void>(undefined);

  constructor(
    private paymentService: PaymentService,
    private workerService: WorkerService,
    private alertService: AlertService
  ) {
    const searchTerm$ = new BehaviorSubject(this.searchTerm);

    this.payments$ = combineLatest([
      this.refreshPayments$.pipe(switchMap(() => this.paymentService.getAllPayments())),
      this.workerService.getAllWorkers(),
      searchTerm$.asObservable().pipe(startWith(this.searchTerm)) // Ensure searchTerm$ is an observable
    ]).pipe(
      map(([payments, workers, term]: [Payment[], Worker[], string]) => { // <-- Explicitly type the tuple
        const workerMap = new Map(workers.map((w: Worker) => [w.id, `${w.firstName} ${w.lastName}`]));
        const lowerCaseTerm = term.toLowerCase();

        return payments.map((payment: Payment) => ({ // <-- Type payment here
          ...payment,
          workerName: workerMap.get(payment.workerId) || 'Desconocido'
        })).filter((payment: PaymentViewModel) => // <-- Use PaymentViewModel for filter
          payment.workerName.toLowerCase().includes(lowerCaseTerm) ||
          payment.paymentType.toLowerCase().includes(lowerCaseTerm) ||
          payment.amount.toString().includes(lowerCaseTerm)
        ).sort((a: PaymentViewModel, b: PaymentViewModel) => { // <-- Type a and b
          if (a.active !== b.active) {
            return a.active ? -1 : 1;
          }
          return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
        });
      })
    );

    this.activePayments$ = this.payments$.pipe(
      map(payments => payments.filter(payment => payment.active))
    );
    this.inactivePayments$ = this.payments$.pipe(
      map(payments => payments.filter(payment => !payment.active))
    );
  }

  ngOnInit(): void {
    this.refreshPayments$.next();
  }

  onSearchChange(): void {
    // No explicit action needed here, as searchTerm$ (BehaviorSubject) handles changes via ngModel binding implicitly.
    // If searchTerm was a simple string property, you would need searchTerm$.next(this.searchTerm);
  }

  softDeletePayment(id: string, workerName: string): void {
    if (confirm(`¿Estás seguro de que quieres inactivar el pago de ${workerName}?`)) {
      this.paymentService.softDeletePayment(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `El pago de ${workerName} ha sido inactivado correctamente.`);
          this.refreshPayments$.next();
        },
        error: (err) => {
          console.error('Error inactivando pago:', err);
          this.alertService.showAlert('error', `Error al inactivar el pago de ${workerName}.`);
        }
      });
    }
  }

  restorePayment(id: string, workerName: string): void {
    if (confirm(`¿Estás seguro de que quieres restaurar el pago de ${workerName} (activar)?`)) {
      this.paymentService.restorePayment(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `El pago de ${workerName} ha sido restaurado y está activo.`);
          this.refreshPayments$.next();
        },
        error: (err) => {
          console.error('Error restaurando pago:', err);
          this.alertService.showAlert('error', `Error al restaurar el pago de ${workerName}.`);
        }
      });
    }
  }
}