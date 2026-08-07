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

import { Appointment } from '../../../models/appointment';
import { AppointmentService } from '../../../core/services/appointment.service';

import { Patient } from '../../../models/patient';
import { Doctor } from '../../../models/doctor';

import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-appointment.html',
  styleUrl: './add-appointment.css'
})
export class AddAppointmentComponent implements OnChanges {

  @Input()
  selectedAppointment?: Appointment;

  @Output()
  appointmentAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private appointmentService = inject(AppointmentService);

  private patientService = inject(PatientService);

  private doctorService = inject(DoctorService);

  patients: Patient[] = [];

  doctors: Doctor[] = [];

  isEditMode = false;

  appointmentForm = this.fb.group({

    patientId: [0, Validators.required],

    doctorId: [0, Validators.required],

    appointmentDate: ['', Validators.required],

    appointmentTime: ['', Validators.required],

    reason: ['', Validators.required],

    status: ['BOOKED', Validators.required]

  });

  constructor() {

    this.patientService.patients$.subscribe(data => {

      this.patients = data;

    });

    this.doctorService.doctors$.subscribe(data => {

      this.doctors = data;

    });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedAppointment'] && this.selectedAppointment) {

      this.isEditMode = true;

      this.appointmentForm.patchValue({

        patientId: this.selectedAppointment.patientId,

        doctorId: this.selectedAppointment.doctorId,

        appointmentDate: this.selectedAppointment.appointmentDate,

        appointmentTime: this.selectedAppointment.appointmentTime,

        reason: this.selectedAppointment.reason,

        status: this.selectedAppointment.status

      });

    }

  }

  saveAppointment(): void {

    if (this.appointmentForm.invalid) {

      return;

    }

    if (this.isEditMode && this.selectedAppointment?.appointmentId) {

      this.appointmentService
        .updateAppointment(
          this.selectedAppointment.appointmentId,
          this.appointmentForm.value as Appointment
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.appointmentForm.reset();

            this.isEditMode = false;

            this.appointmentAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Update Failed');

          }

        });

    } else {

      this.appointmentService
        .addAppointment(this.appointmentForm.value as Appointment)
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.appointmentForm.reset({

              status: 'BOOKED',

              patientId: 0,

              doctorId: 0

            });

            this.appointmentAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Save Failed');

          }

        });

    }

  }

}