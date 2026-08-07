import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  dashboard?: Dashboard;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (response) => {

          this.dashboard = response.data;

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

}