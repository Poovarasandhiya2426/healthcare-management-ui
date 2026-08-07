import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/api-response';
import { Dashboard } from '../../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/dashboard';

  getDashboard(): Observable<ApiResponse<Dashboard>> {

    return this.http.get<ApiResponse<Dashboard>>(this.apiUrl);

  }

}