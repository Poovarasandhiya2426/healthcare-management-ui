import { Routes } from '@angular/router';

import { MainLayoutComponent } from './core/layout/main-layout/main-layout';

import { LoginComponent } from './features/auth/login/login';

import { DashboardComponent } from './features/dashboard/dashboard';

import { PatientComponent } from './features/patient/patient';

import { DoctorComponent } from './features/doctor/doctor';
import { DoctorDetailsComponent } from './features/doctor/doctor-details/doctor-details';

import { AppointmentComponent } from './features/appointment/appointment';
import { AppointmentDetailsComponent } from './features/appointment/appointment-details/appointment-details';

import { PrescriptionComponent } from './features/prescription/prescription';

import { MedicalRecordComponent } from './features/medical-record/medical-record';

import { BillingComponent } from './features/billing/billing';

import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [

  // ==========================================
  // LOGIN PAGE - PUBLIC
  // ==========================================

  {
    path: 'login',
    component: LoginComponent
  },


  // ==========================================
  // MAIN APPLICATION - PROTECTED
  // ==========================================

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],

    children: [

      // ========================================
      // DASHBOARD
      // ========================================

      {
        path: '',
        component: DashboardComponent
      },


      // ========================================
      // PATIENT ROUTES
      // ========================================

      {
        path: 'patients',
        component: PatientComponent
      },


      // ========================================
      // DOCTOR ROUTES
      // ========================================

      {
        path: 'doctors',

        children: [

          // Doctor List
          {
            path: '',
            component: DoctorComponent
          },

          // Doctor Details
          {
            path: ':id',
            component: DoctorDetailsComponent
          }

        ]
      },


      // ========================================
      // APPOINTMENT ROUTES
      // ========================================

      {
        path: 'appointments',

        children: [

          // Appointment List
          {
            path: '',
            component: AppointmentComponent
          },

          // Appointment Details
          {
            path: ':id',
            component: AppointmentDetailsComponent
          }

        ]
      },


      // ========================================
      // PRESCRIPTION ROUTES
      // ========================================

      {
        path: 'prescriptions',
        component: PrescriptionComponent
      },


      // ========================================
      // MEDICAL RECORD ROUTES
      // ========================================

      {
        path: 'medical-records',
        component: MedicalRecordComponent
      },


      // ========================================
      // BILLING ROUTES
      // ========================================

      {
        path: 'billings',
        component: BillingComponent
      }

    ]
  }

];