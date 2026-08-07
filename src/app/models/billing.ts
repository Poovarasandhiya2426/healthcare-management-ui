export interface Billing {

  billId?: number;

  patientId: number;

  patientName?: string;

  consultationFee: number;

  medicineCharge: number;

  labCharge: number;

  otherCharge: number;

  totalAmount?: number;

  paymentStatus: string;

  paymentMethod: string;

  billDate: string;

}