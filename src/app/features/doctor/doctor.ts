import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../core/services/doctor.service';
import { AddDoctorComponent } from './add-doctor/add-doctor';

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

  // =========================================
  // PAGINATION
  // =========================================

  currentPage = 1;
  pageSize = 5;

  private subscription?: Subscription;

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.subscription =
      this.doctorService.doctors$.subscribe({

        next: (data) => {

          this.doctors = [...data];

          // Reset page if current page becomes invalid
          if (
            this.currentPage > this.totalPages &&
            this.totalPages > 0
          ) {
            this.currentPage = this.totalPages;
          }

        },

        error: (err) => {

          console.error(
            'Doctor Load Error:',
            err
          );

        }

      });

  }

  // =========================================
  // VIEW DOCTOR
  // =========================================

  viewDoctor(id: number): void {

    this.router.navigate([
      '/doctors',
      id
    ]);

  }

  // =========================================
  // EDIT DOCTOR
  // =========================================

  editDoctor(doctor: Doctor): void {

    this.selectedDoctor = {
      ...doctor
    };

    // Scroll to Add / Update form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  // =========================================
  // DELETE DOCTOR
  // =========================================

  deleteDoctor(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this doctor?'
      )
    ) {
      return;
    }

    this.doctorService
      .deleteDoctor(id)
      .subscribe({

        next: (response: any) => {

          alert(response.message);

          this.selectedDoctor = undefined;

        },

        error: (err) => {

          console.error(
            'Delete Doctor Error:',
            err
          );

          alert(
            err.error?.message ||
            'Unable to delete doctor'
          );

        }

      });

  }

  // =========================================
  // SEARCH DOCTOR
  // =========================================

  searchDoctors(): void {

    this.currentPage = 1;

    const keyword =
      this.searchKeyword.trim();

    if (keyword === '') {

      this.doctorService.loadDoctors();

      return;

    }

    this.doctorService
      .searchDoctors(keyword)
      .subscribe({

        next: (response) => {

          this.doctors = [
            ...response.data
          ];

        },

        error: (err) => {

          console.error(
            'Search Doctor Error:',
            err
          );

        }

      });

  }

  // =========================================
  // DOCTOR ADDED / UPDATED
  // =========================================

  onDoctorAdded(): void {

    this.selectedDoctor = undefined;

    this.currentPage = 1;

  }

  // =========================================
  // TOTAL PAGES
  // =========================================

  get totalPages(): number {

    return Math.ceil(
      this.doctors.length /
      this.pageSize
    );

  }

  // =========================================
  // PAGINATED DOCTORS
  // =========================================

  get paginatedDoctors(): Doctor[] {

    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;

    const endIndex =
      startIndex +
      this.pageSize;

    return this.doctors.slice(
      startIndex,
      endIndex
    );

  }

  // =========================================
  // PAGE NUMBERS
  // =========================================

  get pageNumbers(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, index) => index + 1
    );

  }

  // =========================================
  // GO TO PAGE
  // =========================================

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

  }

  // =========================================
  // NEXT PAGE
  // =========================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }

  // =========================================
  // PREVIOUS PAGE
  // =========================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }

  // =========================================
  // DESTROY
  // =========================================

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}