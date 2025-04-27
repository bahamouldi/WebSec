import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ScanFormComponent } from './scan/scan-form/scan-form.component';
import { ScanProgressComponent } from './scan/scan-progress/scan-progress.component';
import { ReportViewComponent } from './scan/report-view/report-view.component';
import { StatsViewComponent } from './stats/stats-view/stats-view.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { UserScansComponent } from './admin/user-scans/user-scans.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'admin/users/:userId/scans', component: UserScansComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'scan', component: ScanFormComponent, canActivate: [AuthGuard] },
  { path: 'scan/progress/:scanId', component: ScanProgressComponent, canActivate: [AuthGuard] },
  { path: 'report-view/:scanId', component: ReportViewComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsViewComponent, canActivate: [AuthGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];