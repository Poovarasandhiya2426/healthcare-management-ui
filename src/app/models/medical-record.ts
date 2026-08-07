export interface MedicalRecord {

  recordId?: number;

  patientId: number;

  patientName?: string;

  diagnosis: string;

  treatment: string;

  allergies: string;

  medicalHistory: string;

  recordDate: string;

}