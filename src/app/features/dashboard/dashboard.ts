import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';

import {
  ChartData,
  ChartOptions
} from 'chart.js';

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
export class DashboardComponent implements OnInit, AfterViewInit {

  dashboard?: Dashboard;

  // =========================
  // Constructor
  // =========================

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // Bar Chart Data
  // =========================

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


  // =========================
  // Bar Chart Options
  // =========================

  barChartOptions: ChartOptions<'bar'> = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 500
    },

    plugins: {

      legend: {
        display: true
      }

    },

    scales: {

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0
        }
      }

    }

  };


  // =========================
  // Doughnut Chart Data
  // =========================

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


  // =========================
  // Doughnut Chart Options
  // =========================

  doughnutChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 500
    },

    plugins: {

      legend: {
        display: true,
        position: 'bottom'
      }

    }

  };


  // =========================
  // Component Init
  // =========================

  ngOnInit(): void {

    console.log('🚀 Dashboard Component Loaded');

    this.loadDashboard();

  }


  // =========================
  // After View Init
  // =========================

  ngAfterViewInit(): void {

    console.log('📊 Dashboard View Initialized');

  }


  // =========================
  // Load Dashboard
  // =========================

  loadDashboard(): void {

    console.log('📡 Calling Dashboard API...');

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (response) => {

          console.log(
            '📊 DASHBOARD RESPONSE:',
            response
          );


          console.log(
            '👥 Patients:',
            response.data.totalPatients
          );


          console.log(
            '👨‍⚕️ Doctors:',
            response.data.totalDoctors
          );


          console.log(
            '📅 Appointments:',
            response.data.totalAppointments
          );


          console.log(
            '💰 Revenue:',
            response.data.totalRevenue
          );


          // =========================
          // Store Dashboard Data
          // =========================

          this.dashboard = response.data;


          console.log(
            '📦 Dashboard Object:',
            this.dashboard
          );


          // =========================
          // Update Charts
          // =========================

          this.updateCharts();


          // =========================
          // Force UI Update
          // =========================

          this.cdr.detectChanges();


          console.log(
            '🔄 Change Detection Triggered'
          );

        },


        error: (err) => {

          console.error(
            '❌ Dashboard API Error:',
            err
          );

        }

      });

  }


  // =========================
  // Update Charts
  // =========================

  updateCharts(): void {

    if (!this.dashboard) {

      console.log(
        '⚠️ Dashboard data is undefined'
      );

      return;

    }


    const patients =
      this.dashboard.totalPatients ?? 0;

    const doctors =
      this.dashboard.totalDoctors ?? 0;

    const appointments =
      this.dashboard.totalAppointments ?? 0;


    console.log(
      '📈 Updating Charts:',
      {
        patients,
        doctors,
        appointments
      }
    );


    // =========================
    // BAR CHART
    // =========================

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


    // =========================
    // DOUGHNUT CHART
    // =========================

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


    console.log(
      '📊 Bar Chart Data:',
      this.barChartData
    );


    console.log(
      '🍩 Doughnut Chart Data:',
      this.doughnutChartData
    );


    console.log(
      '✅ Charts Updated Successfully'
    );

  }

}