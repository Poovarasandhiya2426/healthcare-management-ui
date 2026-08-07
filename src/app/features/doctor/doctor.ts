import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../core/services/doctor.service';
import { AddDoctorComponent } from './add-doctor/add-doctor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
      FormsModule,
    AddDoctorComponent
  ],
  templateUrl: './doctor.html',
  styleUrl: './doctor.css'
})
export class DoctorComponent implements OnInit, OnDestroy {

  doctors: Doctor[] = [];

  searchKeyword = '';

  selectedDoctor?: Doctor;

  private subscription?: Subscription;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {

    this.subscription = this.doctorService.doctors$.subscribe({

      next: (data) => {

        this.doctors = [...data];

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  editDoctor(doctor: Doctor): void {

    this.selectedDoctor = { ...doctor };

  }

  deleteDoctor(id: number): void {

    if (!confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    this.doctorService.deleteDoctor(id).subscribe({

      next: (response: any) => {

        alert(response.message);

        this.selectedDoctor = undefined;

      },

      error: (err) => {

        console.error(err);

        alert(err.error?.message || 'Unable to delete doctor');

      }

    });

  }

  searchDoctors(): void {

  if (this.searchKeyword.trim() === '') {

    this.doctorService.loadDoctors();

    return;

  }

  this.doctorService
    .searchDoctors(this.searchKeyword)
    .subscribe({

      next: (response) => {

        this.doctors = response.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

}

  onDoctorAdded(): void {

    this.selectedDoctor = undefined;

  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}