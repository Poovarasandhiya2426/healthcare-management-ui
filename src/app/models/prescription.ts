export interface Prescription {

  prescriptionId?: number;

  appointmentId: number;

  patientId?: number;

  patientName?: string;

  doctorId?: number;

  doctorName?: string;

  medicineName: string;

  dosage: string;

  frequency: string;

  durationInDays: number;

  instructions: string;

  prescriptionDate: string;

}