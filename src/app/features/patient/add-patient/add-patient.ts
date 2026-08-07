import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Patient } from '../../../models/patient';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css'
})
export class AddPatientComponent implements OnChanges {

  @Input()
  selectedPatient?: Patient;

  @Output()
  patientAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private patientService = inject(PatientService);

  isEditMode = false;

  patientForm = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    gender: ['', Validators.required],

    age: [0, Validators.required],

    dateOfBirth: ['', Validators.required],

    mobileNumber: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    bloodGroup: ['', Validators.required],

    address: ['', Validators.required]

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedPatient'] && this.selectedPatient) {

      this.isEditMode = true;

      this.patientForm.patchValue({

        firstName: this.selectedPatient.firstName,

        lastName: this.selectedPatient.lastName,

        gender: this.selectedPatient.gender,

        age: this.selectedPatient.age,

        dateOfBirth: this.selectedPatient.dateOfBirth,

        mobileNumber: this.selectedPatient.mobileNumber,

        email: this.selectedPatient.email,

        bloodGroup: this.selectedPatient.bloodGroup,

        address: this.selectedPatient.address

      });

    }

  }

  savePatient(): void {

    if (this.patientForm.invalid) {

      return;

    }

    if (this.isEditMode && this.selectedPatient?.patientId) {

      this.patientService
        .updatePatient(
          this.selectedPatient.patientId,
          this.patientForm.value as Patient
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.patientAdded.emit();

            this.patientForm.reset();

            this.isEditMode = false;

            this.selectedPatient = undefined;

          },

          error: (err) => {

            console.error(err);

          }

        });

    } else {

      this.patientService
        .addPatient(this.patientForm.value as Patient)
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.patientAdded.emit();

            this.patientForm.reset();

            this.isEditMode = false;

          },

          error: (err) => {

            console.error(err);

          }

        });

    }

  }

}