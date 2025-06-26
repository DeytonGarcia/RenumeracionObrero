// src/app/core/models/salary.ts
export interface Salary {
  id?: string;
  workerId: string;
  chargeId: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  effectiveDate: string; // ISO format 'YYYY-MM-DD'
  active: boolean;
}