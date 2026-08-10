import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  dashboard?: Dashboard;

  constructor(
    private dashboardService: DashboardService
  ) {}

  // Bar Chart
  barChartData: ChartData<'bar'> = {
    labels: [
      'Patients',
      'Doctors',
      'Appointments'
    ],
    datasets: [
      {
        label: 'Total Count',
        data: [0, 0, 0]
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Doughnut Chart
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [
      'Patients',
      'Doctors',
      'Appointments'
    ],
    datasets: [
      {
        data: [0, 0, 0]
      }
    ]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (response) => {

          this.dashboard = response.data;

          this.updateCharts();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  updateCharts(): void {

    if (!this.dashboard) {
      return;
    }

    const patients = this.dashboard.totalPatients ?? 0;
    const doctors = this.dashboard.totalDoctors ?? 0;
    const appointments = this.dashboard.totalAppointments ?? 0;

    // Update Bar Chart
    this.barChartData = {
      labels: [
        'Patients',
        'Doctors',
        'Appointments'
      ],
      datasets: [
        {
          label: 'Total Count',
          data: [
            patients,
            doctors,
            appointments
          ]
        }
      ]
    };

    // Update Doughnut Chart
    this.doughnutChartData = {
      labels: [
        'Patients',
        'Doctors',
        'Appointments'
      ],
      datasets: [
        {
          data: [
            patients,
            doctors,
            appointments
          ]
        }
      ]
    };

  }

}