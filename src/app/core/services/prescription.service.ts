import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  map
} from 'rxjs';

import { Prescription } from '../../models/prescription';

import { ApiResponse } from '../../models/api-response';


@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {


  // ==========================================
  // HTTP CLIENT
  // ==========================================

  private http = inject(HttpClient);


  // ==========================================
  // API URL
  // ==========================================

  private apiUrl =
    'http://localhost:8080/api/prescriptions';


  // ==========================================
  // PRESCRIPTION SUBJECT
  // ==========================================

  private prescriptionsSubject =
    new BehaviorSubject<Prescription[]>([]);


  prescriptions$ =
    this.prescriptionsSubject.asObservable();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    this.loadPrescriptions();

  }


  // ==========================================
  // GET ALL PRESCRIPTIONS
  // ==========================================

  loadPrescriptions(): void {

    console.log(
      '🔵 Loading all prescriptions...'
    );

    this.http
      .get<ApiResponse<Prescription[]>>(
        this.apiUrl
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Prescription List Response:',
            response
          );

          this.prescriptionsSubject.next(
            response.data || []
          );

        },

        error: (err) => {

          console.error(
            '❌ Prescription List Error:',
            err
          );

        }

      });

  }


  // ==========================================
  // GET PRESCRIPTION BY ID
  // ==========================================

  getPrescriptionById(
    id: number
  ): Observable<ApiResponse<Prescription>> {

    const url =
      `${this.apiUrl}/${id}`;

    console.log(
      '🔎 Getting Prescription By ID:',
      id
    );

    console.log(
      '🌐 Calling API:',
      url
    );

    return this.http
      .get<ApiResponse<Prescription>>(
        url
      );

  }


  // ==========================================
  // ADD PRESCRIPTION
  // ==========================================

  addPrescription(
    prescription: Prescription
  ): Observable<ApiResponse<Prescription>> {

    return this.http
      .post<ApiResponse<Prescription>>(
        this.apiUrl,
        prescription
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Prescription[]>>(
              this.apiUrl
            )
            .pipe(

              tap(result => {

                this.prescriptionsSubject.next(
                  result.data || []
                );

              }),

              map(() => response)

            )

        )

      );

  }


  // ==========================================
  // UPDATE PRESCRIPTION
  // ==========================================

  updatePrescription(
    id: number,
    prescription: Prescription
  ): Observable<ApiResponse<Prescription>> {

    return this.http
      .put<ApiResponse<Prescription>>(
        `${this.apiUrl}/${id}`,
        prescription
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Prescription[]>>(
              this.apiUrl
            )
            .pipe(

              tap(result => {

                this.prescriptionsSubject.next(
                  result.data || []
                );

              }),

              map(() => response)

            )

        )

      );

  }


  // ==========================================
  // DELETE PRESCRIPTION
  // ==========================================

  deletePrescription(
    id: number
  ): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Prescription[]>>(
              this.apiUrl
            )
            .pipe(

              tap(result => {

                this.prescriptionsSubject.next(
                  result.data || []
                );

              }),

              map(() => response)

            )

        )

      );

  }

}