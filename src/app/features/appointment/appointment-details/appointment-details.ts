import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Appointment } from '../../../models/appointment';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css'
})
export class AppointmentDetailsComponent implements OnInit {

  appointment?: Appointment;

  isLoading = true;

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private appointmentService = inject(AppointmentService);

  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {

    const appointmentId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    console.log(
      '🔍 Appointment ID:',
      appointmentId
    );

    if (!appointmentId) {

      console.error(
        '❌ Invalid Appointment ID'
      );

      this.isLoading = false;

      this.cdr.detectChanges();

      return;
    }

    this.loadAppointment(appointmentId);
  }


  loadAppointment(id: number): void {

    console.log(
      '📡 Calling Appointment API:',
      `http://localhost:8080/api/appointments/${id}`
    );

    this.isLoading = true;

    this.appointmentService
      .getAppointmentById(id)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Appointment API Response:',
            response
          );

          console.log(
            '📋 Appointment Data:',
            response.data
          );

          this.appointment = response.data;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            '❌ Appointment API Error:',
            err
          );

          this.isLoading = false;

          this.cdr.detectChanges();
        }

      });
  }


  editAppointment(): void {

    if (!this.appointment?.appointmentId) {

      console.error(
        '❌ Appointment ID not available'
      );

      return;
    }

    console.log(
      '✏️ Editing Appointment:',
      this.appointment
    );

    this.router.navigate(
      ['/appointments'],
      {
        state: {
          editAppointment: this.appointment
        }
      }
    );
  }


  goBack(): void {

    this.router.navigate([
      '/appointments'
    ]);
  }


  getStatusClass(status?: string): string {

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

}