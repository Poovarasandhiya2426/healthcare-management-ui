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

import { Doctor } from '../../../models/doctor';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-doctor.html',
  styleUrl: './add-doctor.css'
})
export class AddDoctorComponent implements OnChanges {

  @Input()
  selectedDoctor?: Doctor;

  @Output()
  doctorAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private doctorService = inject(DoctorService);

  isEditMode = false;

  doctorForm = this.fb.group({

    doctorName: ['', Validators.required],
    specialization: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', Validators.required],
    experience: [0, Validators.required],
    consultationFee: [0, Validators.required],
    qualification: ['', Validators.required],
    hospitalName: ['', Validators.required]

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedDoctor'] && this.selectedDoctor) {

      this.isEditMode = true;

      this.doctorForm.patchValue({

        doctorName: this.selectedDoctor.doctorName,
        specialization: this.selectedDoctor.specialization,
        email: this.selectedDoctor.email,
        mobileNumber: this.selectedDoctor.mobileNumber,
        experience: this.selectedDoctor.experience,
        consultationFee: this.selectedDoctor.consultationFee,
        qualification: this.selectedDoctor.qualification,
        hospitalName: this.selectedDoctor.hospitalName

      });

    }

  }

  saveDoctor(): void {

    if (this.doctorForm.invalid) {
      return;
    }

    if (this.isEditMode && this.selectedDoctor?.doctorId) {

      this.doctorService
        .updateDoctor(
          this.selectedDoctor.doctorId,
          this.doctorForm.value as Doctor
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.doctorForm.reset();

            this.isEditMode = false;

            this.doctorAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Update Failed');

          }

        });

    } else {

      this.doctorService
        .addDoctor(this.doctorForm.value as Doctor)
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.doctorForm.reset();

            this.doctorAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Save Failed');

          }

        });

    }

  }

}