import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  Prescription
} from '../../../models/prescription';

import {
  PrescriptionService
} from '../../../core/services/prescription.service';


@Component({
  selector: 'app-prescription-details',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './prescription-details.html',

  styleUrl: './prescription-details.css'
})
export class PrescriptionDetailsComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // PRESCRIPTION
  // ==========================================

  prescription?: Prescription;


  // ==========================================
  // LOADING
  // ==========================================

  isLoading = true;


  // ==========================================
  // ERROR
  // ==========================================

  errorMessage = '';


  // ==========================================
  // PRESCRIPTION ID
  // ==========================================

  prescriptionId = 0;


  // ==========================================
  // SUBSCRIPTION
  // ==========================================

  private subscription?: Subscription;


  // ==========================================
  // SERVICES
  // ==========================================

  private prescriptionService =
    inject(PrescriptionService);

  private route =
    inject(ActivatedRoute);

  private router =
    inject(Router);


  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    console.log(
      '🚀 Prescription Details Page Started'
    );


    const idParam =
      this.route.snapshot.paramMap.get('id');


    console.log(
      '📌 URL ID:',
      idParam
    );


    if (!idParam) {

      this.isLoading = false;

      this.errorMessage =
        'Prescription ID not found.';

      return;

    }


    const id =
      Number(idParam);


    if (
      isNaN(id) ||
      id <= 0
    ) {

      this.isLoading = false;

      this.errorMessage =
        'Invalid prescription ID.';

      return;

    }


    this.prescriptionId = id;


    console.log(
      '🔎 Searching Prescription ID:',
      id
    );


    this.loadPrescription(id);

  }


  // ==========================================
  // LOAD PRESCRIPTION
  // ==========================================

  loadPrescription(
    id: number
  ): void {

    this.isLoading = true;

    this.errorMessage = '';


    /*
     * We use the prescription list already
     * maintained by PrescriptionService.
     *
     * This avoids depending only on
     * getPrescriptionById().
     */

    this.subscription =
      this.prescriptionService
        .prescriptions$
        .subscribe({

          next: (
            prescriptions: Prescription[]
          ) => {

            console.log(
              '📦 Prescription List:',
              prescriptions
            );


            console.log(
              '🔍 Looking for ID:',
              id
            );


            const foundPrescription =
              prescriptions.find(
                (
                  prescription: Prescription
                ) =>
                  Number(
                    prescription.prescriptionId
                  ) === id
              );


            if (foundPrescription) {

              console.log(
                '✅ Prescription Found:',
                foundPrescription
              );


              this.prescription =
                foundPrescription;


              this.isLoading = false;

              this.errorMessage = '';


              return;

            }


            /*
             * If the BehaviorSubject is empty,
             * load the prescriptions from backend.
             */

            if (
              prescriptions.length === 0
            ) {

              console.log(
                '🔄 Prescription list empty. Loading from backend...'
              );


              this.prescriptionService
                .loadPrescriptions();


              return;

            }


            /*
             * List has data but requested ID
             * does not exist.
             */

            console.warn(
              '⚠️ Prescription not found:',
              id
            );


            this.isLoading = false;

            this.errorMessage =
              `Prescription #${id} not found.`;

          },

          error: (
            err: any
          ) => {

            console.error(
              '❌ Prescription List Error:',
              err
            );


            this.isLoading = false;

            this.errorMessage =
              err?.error?.message ||
              err?.message ||
              'Unable to load prescription details.';

          }

        });

  }


  // ==========================================
  // BACK
  // ==========================================

  goBack(): void {

    this.router.navigate([
      '/prescriptions'
    ]);

  }


  // ==========================================
  // EDIT PRESCRIPTION
  // ==========================================

  editPrescription(): void {

    if (!this.prescription) {

      return;

    }


    console.log(
      '✏️ Editing Prescription:',
      this.prescription
    );


    this.router.navigate([
      '/prescriptions'
    ]);

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}