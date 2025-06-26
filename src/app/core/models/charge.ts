// src/app/core/models/charge.ts

export interface Charge {
  id?: string; // Optional for new charges
  name: string;
  description?: string;
  hourlyRate: number;
  benefits?: string[];
  responsibilities?: string[];
  requiredSkills?: string[];
  active?: boolean; // For soft delete/activate
  // FIXED: Added baseSalaryMin and baseSalaryMax properties
  baseSalaryMin?: number; // Optional as it might not be present for all charges
  baseSalaryMax?: number; // Optional
}