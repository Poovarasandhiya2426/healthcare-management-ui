import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Doctor } from '../../../models/doctor';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css'
})
export class DoctorDetailsComponent implements OnInit {

  doctor?: Doctor;

  isLoading = true;

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private doctorService = inject(DoctorService);

  private cdr = inject(ChangeDetectorRef);


  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    const doctorId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    console.log('🔍 Doctor ID:', doctorId);

    if (!doctorId) {

      console.error('❌ Invalid Doctor ID');

      this.isLoading = false;

      this.cdr.detectChanges();

      return;
    }

    this.loadDoctor(doctorId);

  }


  // =========================================
  // LOAD DOCTOR
  // =========================================

  loadDoctor(id: number): void {

    console.log(
      '📡 Calling API:',
      `http://localhost:8080/api/doctors/${id}`
    );

    this.isLoading = true;

    this.doctorService
      .getDoctorById(id)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Doctor API Response:',
            response
          );

          console.log(
            '👨‍⚕️ Doctor Data:',
            response.data
          );

          this.doctor = response.data;

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            '❌ Doctor API Error:',
            err
          );

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================
  // EDIT DOCTOR
  // =========================================

  editDoctor(): void {

    if (!this.doctor?.doctorId) {

      console.error(
        '❌ Doctor ID not available'
      );

      return;

    }

    console.log(
      '✏️ Editing Doctor:',
      this.doctor
    );

    this.router.navigate(
      ['/doctors'],
      {
        state: {
          editDoctor: this.doctor
        }
      }
    );

  }


  // =========================================
  // BACK TO DOCTOR LIST
  // =========================================

  goBack(): void {

    this.router.navigate([
      '/doctors'
    ]);

  }

}