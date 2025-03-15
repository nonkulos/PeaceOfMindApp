// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'activities',
    loadChildren: () => import('./pages/activities/activities.page').then(m => m.ActivitiesPage)
  },
  {
    path: 'mental-health',
    loadComponent: () => import('./pages/mental-health/mental-health.page').then(m => m.MentalHealthPage)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'nutrition',
    loadComponent: () => import('./pages/nutrition/nutrition.page').then( m => m.NutritionPage)
  },
  {
    path: 'nutrition',
    loadComponent: () => import('./pages/nutrition/nutrition.page').then(m => m.NutritionPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
