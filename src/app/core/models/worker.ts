// src/app/core/models/worker.ts
export interface Worker {
  id?: string;
  firstName: string;
  lastName: string;
  dni: string;
  address: string;
  phone: string;
  email: string;
  hireDate: string; // Use string for LocalDate (ISO format 'YYYY-MM-DD')
  birthDate: string; // Use string for LocalDate (ISO format 'YYYY-MM-DD')
  position: string;
  status: string; // e.g., "Active", "On Leave", "Terminated"
  active: boolean; // Campo para eliminación lógica
  createdAt?: string;
  updatedAt?: string;
}