import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap, map } from 'rxjs';

import { MedicalRecord } from '../../models/medical-record';
import { ApiResponse } from '../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/medical-records';

  private recordsSubject =
    new BehaviorSubject<MedicalRecord[]>([]);

  records$ =
    this.recordsSubject.asObservable();

  constructor() {

    this.loadMedicalRecords();

  }

  loadMedicalRecords(): void {

    this.http
      .get<ApiResponse<MedicalRecord[]>>(this.apiUrl)
      .subscribe({

        next: (response) => {

          this.recordsSubject.next(response.data);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  addMedicalRecord(
    record: MedicalRecord
  ): Observable<ApiResponse<MedicalRecord>> {

    return this.http
      .post<ApiResponse<MedicalRecord>>(
        this.apiUrl,
        record
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<MedicalRecord[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.recordsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  updateMedicalRecord(
    id: number,
    record: MedicalRecord
  ): Observable<ApiResponse<MedicalRecord>> {

    return this.http
      .put<ApiResponse<MedicalRecord>>(
        `${this.apiUrl}/${id}`,
        record
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<MedicalRecord[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.recordsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  deleteMedicalRecord(
    id: number
  ): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<MedicalRecord[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.recordsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

}