import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MedicalRecord } from '../../models/medical-record';
import { MedicalRecordService } from '../../core/services/medical-record.service';
import { AddMedicalRecordComponent } from './add-medical-record/add-medical-record';

@Component({
  selector: 'app-medical-record',
  standalone: true,
  imports: [
    CommonModule,
    AddMedicalRecordComponent
  ],
  templateUrl: './medical-record.html',
  styleUrl: './medical-record.css'
})
export class MedicalRecordComponent implements OnInit, OnDestroy {

  records: MedicalRecord[] = [];

  selectedRecord?: MedicalRecord;

  private subscription?: Subscription;

  constructor(
    private medicalRecordService: MedicalRecordService
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.medicalRecordService.records$.subscribe({

        next: (data) => {

          this.records = [...data];

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  editRecord(record: MedicalRecord): void {

    this.selectedRecord = { ...record };

  }

  deleteRecord(id: number): void {

    if (!confirm('Are you sure you want to delete this medical record?')) {
      return;
    }

    this.medicalRecordService
      .deleteMedicalRecord(id)
      .subscribe({

        next: (response: any) => {

          alert(response.message);

          this.selectedRecord = undefined;

        },

        error: (err) => {

          console.error(err);

          alert(err.error?.message || 'Unable to delete medical record');

        }

      });

  }

  onRecordAdded(): void {

    this.selectedRecord = undefined;

  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}