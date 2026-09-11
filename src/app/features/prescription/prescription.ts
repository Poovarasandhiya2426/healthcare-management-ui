import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

import { Prescription } from '../../models/prescription';

import { PrescriptionService } from '../../core/services/prescription.service';

import { AddPrescriptionComponent }
  from './add-prescription/add-prescription';


@Component({
  selector: 'app-prescription',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AddPrescriptionComponent
  ],

  templateUrl: './prescription.html',

  styleUrl: './prescription.css'
})
export class PrescriptionComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // PRESCRIPTIONS
  // ==========================================

  prescriptions: Prescription[] = [];

  filteredPrescriptions: Prescription[] = [];

  paginatedPrescriptions: Prescription[] = [];


  // ==========================================
  // SELECTED PRESCRIPTION
  // ==========================================

  selectedPrescription?: Prescription;


  // ==========================================
  // SEARCH
  // ==========================================

  searchKeyword = '';


  // ==========================================
  // PAGINATION
  // ==========================================

  currentPage = 1;

  pageSize = 5;


  // ==========================================
  // SUBSCRIPTION
  // ==========================================

  private subscription?: Subscription;


  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    this.subscription =
      this.prescriptionService
        .prescriptions$
        .subscribe({

          next: (data) => {

            this.prescriptions = [...data];

            this.applyFilters();

          },

          error: (err) => {

            console.error(
              '❌ Prescription subscription error:',
              err
            );

          }

        });

  }


  // ==========================================
  // SEARCH
  // ==========================================

  searchPrescriptions(): void {

    this.applyFilters();

  }


  // ==========================================
  // FILTER
  // ==========================================

  applyFilters(): void {

    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();


    this.filteredPrescriptions =
      this.prescriptions.filter(
        (prescription) => {

          if (!keyword) {

            return true;

          }


          return (

            String(
              prescription.prescriptionId ?? ''
            )
              .toLowerCase()
              .includes(keyword)


            ||

            (
              prescription.patientName ?? ''
            )
              .toLowerCase()
              .includes(keyword)


            ||

            (
              prescription.doctorName ?? ''
            )
              .toLowerCase()
              .includes(keyword)


            ||

            (
              prescription.medicineName ?? ''
            )
              .toLowerCase()
              .includes(keyword)


            ||

            (
              prescription.dosage ?? ''
            )
              .toLowerCase()
              .includes(keyword)


            ||

            (
              prescription.frequency ?? ''
            )
              .toLowerCase()
              .includes(keyword)

          );

        }
      );


    this.currentPage = 1;

    this.updatePagination();

  }


  // ==========================================
  // PAGINATION
  // ==========================================

  updatePagination(): void {

    const startIndex =
      (this.currentPage - 1)
      * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;


    this.paginatedPrescriptions =
      this.filteredPrescriptions.slice(
        startIndex,
        endIndex
      );

  }


  get totalPages(): number {

    return Math.ceil(
      this.filteredPrescriptions.length /
      this.pageSize
    );

  }


  get pageNumbers(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },

      (_, index) =>
        index + 1

    );

  }


  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;

    this.updatePagination();

  }


  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }


  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.updatePagination();

    }

  }


  get showingStart(): number {

    if (
      this.filteredPrescriptions.length === 0
    ) {

      return 0;

    }


    return (
      (this.currentPage - 1)
      * this.pageSize
    ) + 1;

  }


  get showingEnd(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredPrescriptions.length
    );

  }


  // ==========================================
  // EDIT
  // ==========================================

  editPrescription(
    prescription: Prescription
  ): void {

    this.selectedPrescription = {
      ...prescription
    };


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // ==========================================
  // DELETE
  // ==========================================

  deletePrescription(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this prescription?'
      );


    if (!confirmed) {

      return;

    }


    this.prescriptionService
      .deletePrescription(id)
      .subscribe({

        next: (response: any) => {

          alert(
            response.message
          );

          this.selectedPrescription =
            undefined;

        },

        error: (err) => {

          console.error(
            '❌ Delete prescription error:',
            err
          );


          alert(
            err.error?.message ||
            'Unable to delete prescription'
          );

        }

      });

  }


  // ==========================================
  // AFTER ADD / UPDATE
  // ==========================================

  onPrescriptionAdded(): void {

    this.selectedPrescription =
      undefined;

    this.currentPage = 1;

    this.applyFilters();

  }


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {

    this.searchKeyword = '';

    this.currentPage = 1;

    this.applyFilters();

  }


  // ==========================================
  // VIEW PRESCRIPTION
  // ==========================================

  viewPrescription(
    id: number
  ): void {

    this.router.navigate([
      '/prescriptions',
      id
    ]);

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

  get uniqueMedicineCount(): number {

  return new Set(
    this.prescriptions.map(
      prescription => prescription.medicineName
    )
  ).size;

}


get uniquePatientCount(): number {

  return new Set(
    this.prescriptions
      .map(prescription => prescription.patientId)
      .filter(id => id !== undefined)
  ).size;

}


get uniqueDoctorCount(): number {

  return new Set(
    this.prescriptions
      .map(prescription => prescription.doctorId)
      .filter(id => id !== undefined)
  ).size;

}

}