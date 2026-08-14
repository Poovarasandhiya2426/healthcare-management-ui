import { Routes } from '@angular/router';

import { MainLayoutComponent } from './core/layout/main-layout/main-layout';

import { LoginComponent } from './features/auth/login/login';

import { DashboardComponent } from './features/dashboard/dashboard';
import { PatientComponent } from './features/patient/patient';
import { DoctorComponent } from './features/doctor/doctor';
import { AppointmentComponent } from './features/appointment/appointment';
import { PrescriptionComponent } from './features/prescription/prescription';
import { MedicalRecordComponent } from './features/medical-record/medical-record';
import { BillingComponent } from './features/billing/billing';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // Login Page - Public
  {
    path: 'login',
    component: LoginComponent
  },

  // Main Application - Protected
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],

    children: [

      {
        path: '',
        component: DashboardComponent
      },

      {
        path: 'patients',
        component: PatientComponent
      },

      {
        path: 'doctors',
        component: DoctorComponent
      },

      {
        path: 'appointments',
        component: AppointmentComponent
      },

      {
        path: 'prescriptions',
        component: PrescriptionComponent
      },

      {
        path: 'medical-records',
        component: MedicalRecordComponent
      },

      {
        path: 'billings',
        component: BillingComponent
      }

    ]
  }

];