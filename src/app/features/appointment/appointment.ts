import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

import { Appointment } from '../../models/appointment';

import { AppointmentService } from '../../core/services/appointment.service';

import { AddAppointmentComponent } from './add-appointment/add-appointment';


@Component({
  selector: 'app-appointment',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AddAppointmentComponent
  ],

  templateUrl: './appointment.html',

  styleUrl: './appointment.css'
})
export class AppointmentComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // APPOINTMENTS
  // ==========================================

  appointments: Appointment[] = [];

  filteredAppointments: Appointment[] = [];

  paginatedAppointments: Appointment[] = [];


  // ==========================================
  // SELECTED APPOINTMENT
  // ==========================================

  selectedAppointment?: Appointment;


  // ==========================================
  // SEARCH
  // ==========================================

  searchKeyword = '';


  // ==========================================
  // STATUS FILTER
  // ==========================================

  selectedStatus = 'ALL';


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
    private appointmentService: AppointmentService,
    private router: Router
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.subscription =
      this.appointmentService
        .appointments$
        .subscribe({

          next: (data) => {

            this.appointments = [...data];

            this.applyFilters();

            this.checkEditState();

          },

          error: (err) => {

            console.error(
              '❌ Appointment subscription error:',
              err
            );

          }

        });

  }


  // ==========================================
  // EDIT STATE FROM DETAILS PAGE
  // ==========================================

  checkEditState(): void {

    const state = history.state;

    if (state?.editAppointment) {

      this.selectedAppointment = {
        ...state.editAppointment
      };

      window.history.replaceState(
        {},
        document.title,
        window.location.href
      );

    }

  }


  // ==========================================
  // SEARCH + STATUS FILTER
  // ==========================================

  applyFilters(): void {

    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();


    this.filteredAppointments =
      this.appointments.filter(
        (appointment) => {

          const matchesSearch =
            !keyword ||

            String(
              appointment.appointmentId ?? ''
            )
              .toLowerCase()
              .includes(keyword) ||

            (
              appointment.patientName ?? ''
            )
              .toLowerCase()
              .includes(keyword) ||

            (
              appointment.doctorName ?? ''
            )
              .toLowerCase()
              .includes(keyword) ||

            (
              appointment.specialization ?? ''
            )
              .toLowerCase()
              .includes(keyword) ||

            (
              appointment.reason ?? ''
            )
              .toLowerCase()
              .includes(keyword);


          const matchesStatus =
            this.selectedStatus === 'ALL' ||

            appointment.status ===
              this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );


    this.currentPage = 1;

    this.updatePagination();

  }


  // ==========================================
  // SEARCH
  // ==========================================

  searchAppointments(): void {

    this.applyFilters();

  }


  // ==========================================
  // STATUS FILTER
  // ==========================================

  filterByStatus(): void {

    this.applyFilters();

  }


  // ==========================================
  // STATUS COUNT
  // ==========================================

  getStatusCount(status: string): number {

    return this.appointments.filter(
      appointment =>
        appointment.status === status
    ).length;

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

    this.paginatedAppointments =
      this.filteredAppointments.slice(
        startIndex,
        endIndex
      );

  }


  get totalPages(): number {

    return Math.ceil(
      this.filteredAppointments.length /
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
      this.filteredAppointments.length === 0
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
      this.filteredAppointments.length
    );

  }


  // ==========================================
  // VIEW APPOINTMENT
  // ==========================================

  viewAppointment(id: number): void {

    this.router.navigate([
      '/appointments',
      id
    ]);

  }


  // ==========================================
  // EDIT APPOINTMENT
  // ==========================================

  editAppointment(
    appointment: Appointment
  ): void {

    this.selectedAppointment = {
      ...appointment
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // ==========================================
  // DELETE APPOINTMENT
  // ==========================================

  deleteAppointment(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this appointment?'
      );


    if (!confirmed) {
      return;
    }


    this.appointmentService
      .deleteAppointment(id)
      .subscribe({

        next: (response: any) => {

          alert(
            response.message
          );

          this.selectedAppointment =
            undefined;

        },

        error: (err) => {

          console.error(
            '❌ Delete appointment error:',
            err
          );

          alert(
            err.error?.message ||
            'Unable to delete appointment'
          );

        }

      });

  }


  // ==========================================
  // AFTER ADD / UPDATE
  // ==========================================

  onAppointmentAdded(): void {

    this.selectedAppointment =
      undefined;

    this.currentPage = 1;

    this.applyFilters();

  }


  // ==========================================
  // CLEAR SEARCH / FILTER
  // ==========================================

  clearSearch(): void {

    this.searchKeyword = '';

    this.selectedStatus = 'ALL';

    this.applyFilters();

  }


  // ==========================================
  // STATUS CSS CLASS
  // ==========================================

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'BOOKED':
        return 'status-booked';

      case 'PENDING':
        return 'status-pending';

      case 'CANCELLED':
        return 'status-cancelled';

      case 'COMPLETED':
        return 'status-completed';

      default:
        return 'status-default';

    }

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}