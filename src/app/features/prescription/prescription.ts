import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Prescription } from '../../models/prescription';
import { PrescriptionService } from '../../core/services/prescription.service';
import { AddPrescriptionComponent } from './add-prescription/add-prescription';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [
    CommonModule,
    AddPrescriptionComponent
  ],
  templateUrl: './prescription.html',
  styleUrl: './prescription.css'
})
export class PrescriptionComponent implements OnInit, OnDestroy {

  prescriptions: Prescription[] = [];

  selectedPrescription?: Prescription;

  private subscription?: Subscription;

  constructor(
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.prescriptionService.prescriptions$.subscribe({

        next: (data) => {

          this.prescriptions = [...data];

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  editPrescription(
    prescription: Prescription
  ): void {

    this.selectedPrescription = {
      ...prescription
    };

  }

  deletePrescription(id: number): void {

    if (!confirm(
      'Are you sure you want to delete this prescription?'
    )) {
      return;
    }

    this.prescriptionService
      .deletePrescription(id)
      .subscribe({

        next: (response: any) => {

          alert(response.message);

          this.selectedPrescription = undefined;

        },

        error: (err) => {

          console.error(err);

          alert(
            err.error?.message ||
            'Unable to delete prescription'
          );

        }

      });

  }

  onPrescriptionAdded(): void {

    this.selectedPrescription = undefined;

  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}