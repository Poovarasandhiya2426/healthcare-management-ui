import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Prescription } from '../../../models/prescription';
import { Appointment } from '../../../models/appointment';

import { PrescriptionService } from '../../../core/services/prescription.service';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-prescription.html',
  styleUrl: './add-prescription.css'
})
export class AddPrescriptionComponent implements OnChanges {

  @Input()
  selectedPrescription?: Prescription;

  @Output()
  prescriptionAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private prescriptionService = inject(PrescriptionService);

  private appointmentService = inject(AppointmentService);

  appointments: Appointment[] = [];

  isEditMode = false;

  prescriptionForm = this.fb.group({

    appointmentId: [0, Validators.required],

    medicineName: ['', Validators.required],

    dosage: ['', Validators.required],

    frequency: ['', Validators.required],

    durationInDays: [1, Validators.required],

    instructions: ['', Validators.required],

    prescriptionDate: ['', Validators.required]

  });

  constructor() {

    this.appointmentService.appointments$
      .subscribe(data => {

        this.appointments = data;

      });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedPrescription'] && this.selectedPrescription) {

      this.isEditMode = true;

      this.prescriptionForm.patchValue({

        appointmentId: this.selectedPrescription.appointmentId,

        medicineName: this.selectedPrescription.medicineName,

        dosage: this.selectedPrescription.dosage,

        frequency: this.selectedPrescription.frequency,

        durationInDays: this.selectedPrescription.durationInDays,

        instructions: this.selectedPrescription.instructions,

        prescriptionDate: this.selectedPrescription.prescriptionDate

      });

    }

  }

  savePrescription(): void {

    if (this.prescriptionForm.invalid) {
      return;
    }

    if (this.isEditMode && this.selectedPrescription?.prescriptionId) {

      this.prescriptionService
        .updatePrescription(
          this.selectedPrescription.prescriptionId,
          this.prescriptionForm.value as Prescription
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.prescriptionForm.reset({

              appointmentId: 0,

              durationInDays: 1

            });

            this.isEditMode = false;

            this.prescriptionAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Update Failed');

          }

        });

    } else {

      this.prescriptionService
        .addPrescription(
          this.prescriptionForm.value as Prescription
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.prescriptionForm.reset({

              appointmentId: 0,

              durationInDays: 1

            });

            this.prescriptionAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Save Failed');

          }

        });

    }

  }

}