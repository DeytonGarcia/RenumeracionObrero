// src/app/features/charges/charge-detail/charge-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargeService } from '../charge.service';
import { Charge } from '../../../core/models/charge';
import { AlertService } from '../../../core/services/alert.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-charge-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './charge-detail.component.html',
  styleUrl: './charge-detail.component.scss'
})
export class ChargeDetailComponent implements OnInit {
  charge: Charge | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chargeService: ChargeService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.chargeService.getChargeById(id).pipe(
          catchError(error => {
            console.error('Error fetching charge details:', error);
            this.alertService.showAlert('error', 'Error al cargar los detalles del cargo.');
            this.router.navigate(['/charges']);
            return of(null);
          })
        ).subscribe(charge => {
          this.charge = charge;
          this.isLoading = false;
        });
      } else {
        this.alertService.showAlert('error', 'ID de cargo no proporcionado.');
        this.router.navigate(['/charges']);
        this.isLoading = false;
      }
    });
  }
}