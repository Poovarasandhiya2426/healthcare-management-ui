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

import { MedicalRecord } from '../../../models/medical-record';
import { Patient } from '../../../models/patient';

import { MedicalRecordService } from '../../../core/services/medical-record.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-add-medical-record',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-medical-record.html',
  styleUrl: './add-medical-record.css'
})
export class AddMedicalRecordComponent implements OnChanges {

  @Input()
  selectedRecord?: MedicalRecord;

  @Output()
  recordAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private medicalRecordService = inject(MedicalRecordService);

  private patientService = inject(PatientService);

  patients: Patient[] = [];

  isEditMode = false;

  medicalRecordForm = this.fb.group({

    patientId: [0, Validators.required],

    diagnosis: ['', Validators.required],

    treatment: ['', Validators.required],

    allergies: ['', Validators.required],

    medicalHistory: ['', Validators.required],

    recordDate: ['', Validators.required]

  });

  constructor() {

    this.patientService.patients$
      .subscribe(data => {

        this.patients = data;

      });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedRecord'] && this.selectedRecord) {

      this.isEditMode = true;

      this.medicalRecordForm.patchValue({

        patientId: this.selectedRecord.patientId,

        diagnosis: this.selectedRecord.diagnosis,

        treatment: this.selectedRecord.treatment,

        allergies: this.selectedRecord.allergies,

        medicalHistory: this.selectedRecord.medicalHistory,

        recordDate: this.selectedRecord.recordDate

      });

    }

  }

  saveMedicalRecord(): void {

    if (this.medicalRecordForm.invalid) {
      return;
    }

    if (this.isEditMode && this.selectedRecord?.recordId) {

      this.medicalRecordService
        .updateMedicalRecord(
          this.selectedRecord.recordId,
          this.medicalRecordForm.value as MedicalRecord
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.medicalRecordForm.reset({

              patientId: 0

            });

            this.isEditMode = false;

            this.recordAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Update Failed');

          }

        });

    } else {

      this.medicalRecordService
        .addMedicalRecord(
          this.medicalRecordForm.value as MedicalRecord
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.medicalRecordForm.reset({

              patientId: 0

            });

            this.recordAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Save Failed');

          }

        });

    }

  }

}