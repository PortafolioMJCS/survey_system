import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';
import { CollaboratorDashboard } from './dashboard/collaborator-dashboard/collaborator-dashboard';

import { collaboratorGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'collaborator-dashboard', component: CollaboratorDashboard, canActivate: [collaboratorGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
