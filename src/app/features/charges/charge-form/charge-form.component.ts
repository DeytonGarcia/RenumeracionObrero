// src/app/features/charges/charge-form/charge-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargeService } from '../charge.service';
import { AlertService } from '../../../core/services/alert.service';
import { Charge } from '../../../core/models/charge';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-charge-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './charge-form.component.html',
  styleUrl: './charge-form.component.scss'
})
export class ChargeFormComponent implements OnInit {
  chargeForm: FormGroup;
  isEditMode: boolean = false;
  chargeId: string | null = null;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private chargeService: ChargeService,
    private alertService: AlertService
  ) {
    this.chargeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      // FIXED: Add form controls for baseSalaryMin and baseSalaryMax
      baseSalaryMin: [null, Validators.min(0)], // Can be null for new charges, or 0 if a default is desired
      baseSalaryMax: [null, Validators.min(0)], // Can be null
      benefits: this.fb.array([]),
      responsibilities: this.fb.array([]),
      requiredSkills: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.chargeId = params.get('id');
        if (this.chargeId) {
          this.isEditMode = true;
          return this.chargeService.getChargeById(this.chargeId);
        } else {
          this.isLoading = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (charge: Charge | null) => {
        if (charge) {
          this.chargeForm.patchValue(charge);
          // FIXED: Use nullish coalescing to ensure an array is always passed
          this.setBenefits(charge.benefits ?? []);
          this.setResponsibilities(charge.responsibilities ?? []);
          this.setRequiredSkills(charge.requiredSkills ?? []);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading charge:', err);
        this.alertService.showAlert('error', 'Error al cargar los datos del cargo.');
        this.isLoading = false;
        this.router.navigate(['/charges']);
      }
    });
  }

  get benefits(): FormArray {
    return this.chargeForm.get('benefits') as FormArray;
  }

  addBenefit(): void {
    this.benefits.push(this.fb.control('', Validators.required));
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  private setBenefits(benefits: string[]): void {
    this.benefits.clear();
    benefits.forEach(benefit => this.benefits.push(this.fb.control(benefit, Validators.required)));
  }

  get responsibilities(): FormArray {
    return this.chargeForm.get('responsibilities') as FormArray;
  }

  addResponsibility(): void {
    this.responsibilities.push(this.fb.control('', Validators.required));
  }

  removeResponsibility(index: number): void {
    this.responsibilities.removeAt(index);
  }

  private setResponsibilities(responsibilities: string[]): void {
    this.responsibilities.clear();
    responsibilities.forEach(resp => this.responsibilities.push(this.fb.control(resp, Validators.required)));
  }

  get requiredSkills(): FormArray {
    return this.chargeForm.get('requiredSkills') as FormArray;
  }

  addRequiredSkill(): void {
    this.requiredSkills.push(this.fb.control('', Validators.required));
  }

  removeRequiredSkill(index: number): void {
    this.requiredSkills.removeAt(index);
  }

  private setRequiredSkills(skills: string[]): void {
    this.requiredSkills.clear();
    skills.forEach(skill => this.requiredSkills.push(this.fb.control(skill, Validators.required)));
  }

  onSubmit(): void {
    this.chargeForm.markAllAsTouched();
    if (this.chargeForm.valid) {
      const chargeData: Charge = this.chargeForm.value;

      if (this.isEditMode && this.chargeId) {
        this.chargeService.updateCharge(this.chargeId, chargeData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Cargo actualizado correctamente.');
            this.router.navigate(['/charges']);
          },
          error: (err) => {
            console.error('Error updating charge:', err);
            this.alertService.showAlert('error', 'Error al actualizar el cargo.');
          }
        });
      } else {
        this.chargeService.createCharge(chargeData).subscribe({
          next: () => {
            this.alertService.showAlert('success', 'Cargo creado correctamente.');
            this.router.navigate(['/charges']);
          },
          error: (err) => {
            console.error('Error creating charge:', err);
            this.alertService.showAlert('error', 'Error al crear el cargo.');
          }
        });
      }
    } else {
      this.alertService.showAlert('warning', 'Por favor, corrige los errores en el formulario.');
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.chargeForm.get(controlName);
    return (control?.touched || control?.dirty || (control && control.value !== '')) && control?.hasError(errorType) || false;
  }

  hasArrayControlError(formArray: FormArray, index: number, errorType: string): boolean {
    const control = formArray.at(index);
    return (control?.touched || control?.dirty || (control && control.value !== '')) && control?.hasError(errorType) || false;
  }
}