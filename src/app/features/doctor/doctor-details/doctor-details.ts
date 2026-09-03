import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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

  ngOnInit(): void {

    const doctorId =
      Number(this.route.snapshot.paramMap.get('id'));

    if (!doctorId) {

      this.isLoading = false;

      return;
    }

    this.loadDoctor(doctorId);

  }

  // =========================================
  // LOAD DOCTOR DETAILS
  // =========================================

  loadDoctor(id: number): void {

    this.isLoading = true;

    this.doctorService
      .getDoctorById(id)
      .subscribe({

        next: (response) => {

          this.doctor = response.data;

          this.isLoading = false;

        },

        error: (err) => {

          console.error(
            'Doctor Details Error:',
            err
          );

          this.isLoading = false;

        }

      });

  }

  // =========================================
  // BACK TO DOCTOR LIST
  // =========================================

  goBack(): void {

    this.router.navigate(['/doctors']);

  }

}