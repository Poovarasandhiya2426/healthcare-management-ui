import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap, map } from 'rxjs';

import { Doctor } from '../../models/doctor';
import { ApiResponse } from '../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/doctors';

  private doctorsSubject = new BehaviorSubject<Doctor[]>([]);

  doctors$ = this.doctorsSubject.asObservable();

  constructor() {

    this.loadDoctors();

  }

  loadDoctors(): void {

    this.http
      .get<ApiResponse<Doctor[]>>(this.apiUrl)
      .subscribe({

        next: (response) => {

          this.doctorsSubject.next(response.data);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  addDoctor(doctor: Doctor): Observable<ApiResponse<Doctor>> {

    return this.http
      .post<ApiResponse<Doctor>>(this.apiUrl, doctor)
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Doctor[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.doctorsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  updateDoctor(id: number, doctor: Doctor): Observable<ApiResponse<Doctor>> {

    return this.http
      .put<ApiResponse<Doctor>>(`${this.apiUrl}/${id}`, doctor)
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Doctor[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.doctorsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  deleteDoctor(id: number): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Doctor[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.doctorsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  searchDoctors(keyword: string): Observable<ApiResponse<Doctor[]>> {

  return this.http.get<ApiResponse<Doctor[]>>(
    `${this.apiUrl}/search?keyword=${keyword}`
  );

}

}