// src/app/core/models/payment.ts
export interface Payment {
  id?: string;
  workerId: string;
  paymentDate: string; // ISO format 'YYYY-MM-DD'
  amount: number;
  paymentType: string;
  description: string;
  periodStart: string; // ISO format 'YYYY-MM-DD'
  periodEnd: string; // ISO format 'YYYY-MM-DD'
  status: string;
  active: boolean;
}