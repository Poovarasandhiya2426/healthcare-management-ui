import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Billing } from '../../models/billing';
import { BillingService } from '../../core/services/billing.service';
import { AddBillingComponent } from './add-billing/add-billing';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    AddBillingComponent
  ],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class BillingComponent implements OnInit, OnDestroy {

  billings: Billing[] = [];

  selectedBilling?: Billing;

  private subscription?: Subscription;

  constructor(
    private billingService: BillingService
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.billingService.billings$.subscribe({

        next: (data) => {

          this.billings = [...data];

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  editBilling(billing: Billing): void {

    this.selectedBilling = { ...billing };

  }

  deleteBilling(id: number): void {

    if (!confirm('Are you sure you want to delete this bill?')) {
      return;
    }

    this.billingService
      .deleteBilling(id)
      .subscribe({

        next: (response: any) => {

          alert(response.message);

          this.selectedBilling = undefined;

        },

        error: (err) => {

          console.error(err);

          alert(err.error?.message || 'Unable to delete bill');

        }

      });

  }

  onBillingAdded(): void {

    this.selectedBilling = undefined;

  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}