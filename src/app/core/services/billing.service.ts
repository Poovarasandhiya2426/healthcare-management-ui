import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap, map } from 'rxjs';

import { Billing } from '../../models/billing';
import { ApiResponse } from '../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/billings';

  private billingsSubject =
    new BehaviorSubject<Billing[]>([]);

  billings$ =
    this.billingsSubject.asObservable();

  constructor() {

    this.loadBillings();

  }

  loadBillings(): void {

    this.http
      .get<ApiResponse<Billing[]>>(this.apiUrl)
      .subscribe({

        next: (response) => {

          this.billingsSubject.next(response.data);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  addBilling(
    billing: Billing
  ): Observable<ApiResponse<Billing>> {

    return this.http
      .post<ApiResponse<Billing>>(
        this.apiUrl,
        billing
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Billing[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.billingsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  updateBilling(
    id: number,
    billing: Billing
  ): Observable<ApiResponse<Billing>> {

    return this.http
      .put<ApiResponse<Billing>>(
        `${this.apiUrl}/${id}`,
        billing
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Billing[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.billingsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

  deleteBilling(
    id: number
  ): Observable<ApiResponse<any>> {

    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        switchMap(response =>

          this.http
            .get<ApiResponse<Billing[]>>(this.apiUrl)
            .pipe(

              tap(result => {

                this.billingsSubject.next(result.data);

              }),

              map(() => response)

            )

        )

      );

  }

}