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

import { Billing } from '../../../models/billing';
import { Patient } from '../../../models/patient';

import { BillingService } from '../../../core/services/billing.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-add-billing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-billing.html',
  styleUrl: './add-billing.css'
})
export class AddBillingComponent implements OnChanges {

  @Input()
  selectedBilling?: Billing;

  @Output()
  billingAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private billingService = inject(BillingService);

  private patientService = inject(PatientService);

  patients: Patient[] = [];

  isEditMode = false;

  billingForm = this.fb.group({

    patientId: [0, Validators.required],

    consultationFee: [0, Validators.required],

    medicineCharge: [0, Validators.required],

    labCharge: [0, Validators.required],

    otherCharge: [0, Validators.required],

    paymentStatus: ['', Validators.required],

    paymentMethod: ['', Validators.required],

    billDate: ['', Validators.required]

  });

  constructor() {

    this.patientService.patients$
      .subscribe(data => {

        this.patients = data;

      });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedBilling'] && this.selectedBilling) {

      this.isEditMode = true;

      this.billingForm.patchValue({

        patientId: this.selectedBilling.patientId,

        consultationFee: this.selectedBilling.consultationFee,

        medicineCharge: this.selectedBilling.medicineCharge,

        labCharge: this.selectedBilling.labCharge,

        otherCharge: this.selectedBilling.otherCharge,

        paymentStatus: this.selectedBilling.paymentStatus,

        paymentMethod: this.selectedBilling.paymentMethod,

        billDate: this.selectedBilling.billDate

      });

    }

  }

  saveBilling(): void {

    if (this.billingForm.invalid) {

      return;

    }

    if (this.isEditMode && this.selectedBilling?.billId) {

      this.billingService
        .updateBilling(
          this.selectedBilling.billId,
          this.billingForm.value as Billing
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.billingForm.reset({

              patientId: 0

            });

            this.isEditMode = false;

            this.billingAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Update Failed');

          }

        });

    } else {

      this.billingService
        .addBilling(
          this.billingForm.value as Billing
        )
        .subscribe({

          next: (response: any) => {

            alert(response.message);

            this.billingForm.reset({

              patientId: 0

            });

            this.billingAdded.emit();

          },

          error: (err) => {

            console.error(err);

            alert(err.error?.message || 'Save Failed');

          }

        });

    }

  }

}