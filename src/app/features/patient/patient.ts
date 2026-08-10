import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';

import { Patient } from '../../models/patient';
import { PatientService } from '../../core/services/patient.service';
import { AddPatientComponent } from './add-patient/add-patient';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddPatientComponent
  ],
  templateUrl: './patient.html',
  styleUrl: './patient.css'
})
export class PatientComponent implements OnInit {

  patients: Patient[] = [];

  selectedPatient?: Patient;

  searchKeyword = '';

  currentPage = 0;

  pageSize = 10;

  totalPages = 0;

  totalElements = 0;

  constructor(
    private patientService: PatientService
  ) {}

  ngOnInit(): void {

    this.loadPatientPage(0);

  }

  loadPatientPage(page: number): void {

    this.patientService
      .getPatientsWithPagination(page, this.pageSize)
      .subscribe({

        next: (response) => {

          this.patients = response.data.content;

          this.currentPage = response.data.number;

          this.totalPages = response.data.totalPages;

          this.totalElements = response.data.totalElements;

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  nextPage(): void {

    if (this.currentPage >= this.totalPages - 1) {
      return;
    }

    const page = this.currentPage + 1;

    this.loadPatientPage(page);

  }

  previousPage(): void {

    if (this.currentPage <= 0) {
      return;
    }

    const page = this.currentPage - 1;

    this.loadPatientPage(page);

  }

  searchPatients(): void {

    if (this.searchKeyword.trim() === '') {

      this.loadPatientPage(0);

      return;

    }

    this.patientService
      .searchPatients(this.searchKeyword)
      .subscribe({

        next: (response) => {

          this.patients = response.data;

          this.currentPage = 0;

          this.totalPages = 1;

          this.totalElements = response.data.length;

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  editPatient(patient: Patient): void {

    this.selectedPatient = { ...patient };

  }

  deletePatient(id: number): void {

    if (!confirm('Are you sure you want to delete this patient?')) {

      return;

    }

    this.patientService
      .deletePatient(id)
      .subscribe({

        next: (response: any) => {

          alert(response.message);

          this.selectedPatient = undefined;

          if (this.currentPage > 0 && this.patients.length === 1) {

            this.loadPatientPage(this.currentPage - 1);

          } else {

            this.loadPatientPage(this.currentPage);

          }

        },

        error: (err) => {

          console.error(err);

          alert('Unable to delete patient');

        }

      });

  }

  onPatientAdded(): void {

    this.selectedPatient = undefined;

    this.loadPatientPage(this.currentPage);

  }

  // ==========================================
  // EXPORT PATIENTS TO EXCEL
  // ==========================================

  exportPatientsToExcel(): void {

    if (this.patients.length === 0) {

      alert('No patient data available to export.');

      return;

    }

    const excelData = this.patients.map(patient => ({

      'Patient ID': patient.patientId,

      'First Name': patient.firstName,

      'Last Name': patient.lastName,

      'Age': patient.age,

      'Gender': patient.gender,

      'Mobile Number': patient.mobileNumber,

      'Email': patient.email,

      'Blood Group': patient.bloodGroup,

      'Date of Birth': patient.dateOfBirth,

      'Address': patient.address

    }));

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Patients'
    );

    XLSX.writeFile(
      workbook,
      'patients.xlsx'
    );

  }

}