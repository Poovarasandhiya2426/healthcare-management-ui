import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  map
} from 'rxjs';

import { Patient } from '../../models/patient';
import { ApiResponse } from '../../models/api-response';
import { Page } from '../../models/page';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/patients';

  // ===== BehaviorSubject =====

  private patientsSubject = new BehaviorSubject<Patient[]>([]);

  patients$ = this.patientsSubject.asObservable();

  constructor() {

    this.loadPatients();

  }

  loadPatients(): void {

    this.http
      .get<ApiResponse<Patient[]>>(this.apiUrl)
      .subscribe({

        next: (response) => {

          this.patientsSubject.next(response.data);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  // ===== Pagination =====

  getPatientsWithPagination(
    page: number,
    size: number
  ): Observable<ApiResponse<Page<Patient>>> {

    return this.http.get<ApiResponse<Page<Patient>>>(
      `${this.apiUrl}/page?page=${page}&size=${size}`
    );

  }

  // ===== Search =====

  searchPatients(
    keyword: string
  ): Observable<ApiResponse<Patient[]>> {

    return this.http.get<ApiResponse<Patient[]>>(
      `${this.apiUrl}/search?keyword=${keyword}`
    );

  }

  // ===== Add =====

  addPatient(
    patient: Patient
  ): Observable<ApiResponse<Patient>> {

    return this.http
      .post<ApiResponse<Patient>>(
        this.apiUrl,
        patient
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Patient[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.patientsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  // ===== Update =====

  updatePatient(
    id: number,
    patient: Patient
  ): Observable<ApiResponse<Patient>> {

    return this.http
      .put<ApiResponse<Patient>>(
        `${this.apiUrl}/${id}`,
        patient
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Patient[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.patientsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  // ===== Delete =====

  deletePatient(
    id: number
  ): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Patient[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.patientsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

}