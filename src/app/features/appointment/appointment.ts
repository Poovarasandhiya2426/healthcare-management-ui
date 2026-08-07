import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../core/services/appointment.service';
import { AddAppointmentComponent } from './add-appointment/add-appointment';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    AddAppointmentComponent
  ],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css'
})
export class AppointmentComponent implements OnInit, OnDestroy {

  appointments: Appointment[] = [];

  selectedAppointment?: Appointment;

  private subscription?: Subscription;

  constructor(
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.appointmentService.appointments$.subscribe({

        next: (data) => {

          this.appointments = [...data];

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  editAppointment(appointment: Appointment): void {

    this.selectedAppointment = { ...appointment };

  }

  deleteAppointment(id: number): void {

    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    this.appointmentService
      .deleteAppointment(id)
      .subscribe({

        next: (response: any) => {

          alert(response.message);

          this.selectedAppointment = undefined;

        },

        error: (err) => {

          console.error(err);

          alert(err.error?.message || 'Unable to delete appointment');

        }

      });

  }

  onAppointmentAdded(): void {

    this.selectedAppointment = undefined;

  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }

}