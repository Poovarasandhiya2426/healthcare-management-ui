export interface Appointment {

  appointmentId?: number;

  patientId: number;

  patientName?: string;

  doctorId: number;

  doctorName?: string;

  specialization?: string;

  appointmentDate: string;

  appointmentTime: string;

  reason: string;

  status: string;

}