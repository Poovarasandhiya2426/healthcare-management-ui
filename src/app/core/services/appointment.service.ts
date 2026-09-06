import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  map
} from 'rxjs';

import { Appointment } from '../../models/appointment';
import { ApiResponse } from '../../models/api-response';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:8080/api/appointments';


  private appointmentsSubject =
    new BehaviorSubject<Appointment[]>([]);


  appointments$ =
    this.appointmentsSubject.asObservable();


  constructor() {

    this.loadAppointments();

  }


  // ==========================================
  // GET ALL APPOINTMENTS
  // ==========================================

  loadAppointments(): void {

    this.http
      .get<ApiResponse<Appointment[]>>(
        this.apiUrl
      )
      .subscribe({

        next: (
          response: ApiResponse<Appointment[]>
        ) => {

          this.appointmentsSubject.next(
            response.data
          );

        },

        error: (err: any) => {

          console.error(
            '❌ Failed to load appointments:',
            err
          );

        }

      });

  }


  // ==========================================
  // GET APPOINTMENT BY ID
  // ==========================================

  getAppointmentById(
    id: number
  ): Observable<ApiResponse<Appointment>> {

    return this.http.get<
      ApiResponse<Appointment>
    >(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // ADD APPOINTMENT
  // ==========================================

  addAppointment(
    appointment: Appointment
  ): Observable<ApiResponse<Appointment>> {

    return this.http
      .post<ApiResponse<Appointment>>(
        this.apiUrl,
        appointment
      )
      .pipe(

        switchMap(
          (
            response: ApiResponse<Appointment>
          ) =>

            this.http
              .get<ApiResponse<Appointment[]>>(
                this.apiUrl
              )
              .pipe(

                tap(
                  (
                    result: ApiResponse<Appointment[]>
                  ) => {

                    this.appointmentsSubject.next(
                      result.data
                    );

                  }
                ),

                map(
                  () => response
                )

              )

        )

      );

  }


  // ==========================================
  // UPDATE APPOINTMENT
  // ==========================================

  updateAppointment(
    id: number,
    appointment: Appointment
  ): Observable<ApiResponse<Appointment>> {

    return this.http
      .put<ApiResponse<Appointment>>(
        `${this.apiUrl}/${id}`,
        appointment
      )
      .pipe(

        switchMap(
          (
            response: ApiResponse<Appointment>
          ) =>

            this.http
              .get<ApiResponse<Appointment[]>>(
                this.apiUrl
              )
              .pipe(

                tap(
                  (
                    result: ApiResponse<Appointment[]>
                  ) => {

                    this.appointmentsSubject.next(
                      result.data
                    );

                  }
                ),

                map(
                  () => response
                )

              )

        )

      );

  }


  // ==========================================
  // DELETE APPOINTMENT
  // ==========================================

  deleteAppointment(
    id: number
  ): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        switchMap(
          (
            response: ApiResponse<any>
          ) =>

            this.http
              .get<ApiResponse<Appointment[]>>(
                this.apiUrl
              )
              .pipe(

                tap(
                  (
                    result: ApiResponse<Appointment[]>
                  ) => {

                    this.appointmentsSubject.next(
                      result.data
                    );

                  }
                ),

                map(
                  () => response
                )

              )

        )

      );

  }

}