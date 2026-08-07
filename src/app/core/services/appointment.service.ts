import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap, map } from 'rxjs';

import { Appointment } from '../../models/appointment';
import { ApiResponse } from '../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/appointments';

  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  appointments$ = this.appointmentsSubject.asObservable();

  constructor() {

    this.loadAppointments();

  }

  loadAppointments(): void {

    this.http
      .get<ApiResponse<Appointment[]>>(this.apiUrl)
      .subscribe({

        next: (response) => {

          this.appointmentsSubject.next(response.data);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  addAppointment(appointment: Appointment): Observable<ApiResponse<Appointment>> {

    return this.http
      .post<ApiResponse<Appointment>>(this.apiUrl, appointment)
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Appointment[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.appointmentsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  updateAppointment(id: number, appointment: Appointment): Observable<ApiResponse<Appointment>> {

    return this.http
      .put<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`, appointment)
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Appointment[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.appointmentsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  deleteAppointment(id: number): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Appointment[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.appointmentsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

}