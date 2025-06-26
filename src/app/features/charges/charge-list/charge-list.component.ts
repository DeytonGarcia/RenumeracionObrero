// src/app/features/charges/charge-list/charge-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChargeService } from '../charge.service';
import { Charge } from '../../../core/models/charge';
import { AlertService } from '../../../core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-charge-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './charge-list.component.html',
  styleUrl: './charge-list.component.scss'
})
export class ChargeListComponent implements OnInit {
  charges$: Observable<Charge[]>;
  filteredCharges$: Observable<Charge[]>; // Combined with search and filter
  filterStatus: 'active' | 'inactive' | 'all' = 'active';
  searchTerm: string = '';
  isLoading: boolean = true;

  private refreshCharges$ = new BehaviorSubject<void>(undefined); // Trigger to reload charges

  constructor(
    private chargeService: ChargeService,
    private alertService: AlertService
  ) {
    const searchTerm$ = new BehaviorSubject(this.searchTerm);

    this.charges$ = this.refreshCharges$.pipe(
      switchMap(() => this.chargeService.getAllCharges())
    );

    this.filteredCharges$ = combineLatest([
      this.charges$,
      searchTerm$.asObservable().pipe(startWith(this.searchTerm)) // Start with current searchTerm
    ]).pipe(
      map(([charges, term]: [Charge[], string]) => { // Explicitly type the tuple
        this.isLoading = false; // Data loaded, set loading to false
        const lowerCaseTerm = term.toLowerCase();

        return charges.filter(charge => {
          const matchesSearch =
            (charge.name || '').toLowerCase().includes(lowerCaseTerm) || // Check name
            // FIXED: Safely access description
            (charge.description || '').toLowerCase().includes(lowerCaseTerm) || // Check description
            (charge.hourlyRate?.toString() || '').includes(lowerCaseTerm) || // Check hourlyRate
            // FIXED: Safely check baseSalaryMin and baseSalaryMax if they exist
            (charge.baseSalaryMin?.toString() || '').includes(lowerCaseTerm) ||
            (charge.baseSalaryMax?.toString() || '').includes(lowerCaseTerm) ||
            (charge.benefits || []).some(b => b.toLowerCase().includes(lowerCaseTerm)) ||
            (charge.responsibilities || []).some(r => r.toLowerCase().includes(lowerCaseTerm)) ||
            (charge.requiredSkills || []).some(s => s.toLowerCase().includes(lowerCaseTerm));


          const matchesFilter =
            this.filterStatus === 'all' ||
            (this.filterStatus === 'active' && charge.active) ||
            (this.filterStatus === 'inactive' && !charge.active);

          return matchesSearch && matchesFilter;
        }).sort((a, b) => (a.name || '').localeCompare(b.name || '')); // Sort alphabetically by name
      })
    );
  }

  ngOnInit(): void {
    this.refreshCharges$.next(); // Trigger initial load
  }

  onSearchChange(): void {
    // Manually trigger the search term update to re-filter
    // This is necessary because [(ngModel)] only updates the property,
    // not the BehaviorSubject automatically for filtering pipelines.
    (this.filteredCharges$ as any).source.internalSources[1].next(this.searchTerm);
  }

  softDeleteCharge(id: string, name: string): void {
    if (confirm(`¿Estás seguro de que quieres inactivar el cargo "${name}"?`)) {
      this.chargeService.softDeleteCharge(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `Cargo "${name}" inactivado correctamente.`);
          this.refreshCharges$.next(); // Reload data after action
        },
        error: (err) => {
          console.error('Error inactivando cargo:', err);
          this.alertService.showAlert('error', `Error al inactivar el cargo "${name}".`);
        }
      });
    }
  }

  restoreCharge(id: string, name: string): void {
    if (confirm(`¿Estás seguro de que quieres activar el cargo "${name}"?`)) {
      this.chargeService.restoreCharge(id).subscribe({
        next: () => {
          this.alertService.showAlert('success', `Cargo "${name}" activado correctamente.`);
          this.refreshCharges$.next(); // Reload data after action
        },
        error: (err) => {
          console.error('Error activando cargo:', err);
          this.alertService.showAlert('error', `Error al activar el cargo "${name}".`);
        }
      });
    }
  }
}