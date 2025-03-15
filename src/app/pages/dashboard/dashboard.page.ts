// src/app/pages/dashboard/dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Activity } from '../../models/activity';
import { MentalCheckIn } from '../../models/mental-check-in';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class DashboardPage implements OnInit {
  activities$: Observable<Activity[]>;
  mentalCheckIns$: Observable<MentalCheckIn[]>;
  recentActivities: Activity[] = [];
  mentalHealthStats = {
    overallMood: 0,
    stressLevel: 0,
    sleepQuality: 0
  };

  constructor(private dataService: DataService) {
    this.activities$ = this.dataService.getActivities();
    this.mentalCheckIns$ = this.dataService.getMentalCheckIns();
  }

  ngOnInit() {
    // Get recent activities
    this.activities$.subscribe(activities => {
      this.recentActivities = activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });

    // Calculate mental health averages
    this.mentalCheckIns$.subscribe(checkIns => {
      if (checkIns.length > 0) {
        // Get last 7 days of check-ins
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentCheckIns = checkIns.filter(
          c => new Date(c.date) >= sevenDaysAgo
        );

        if (recentCheckIns.length > 0) {
          this.mentalHealthStats = {
            overallMood: this.calculateAverage(recentCheckIns, 'overallMood'),
            stressLevel: this.calculateAverage(recentCheckIns, 'stressLevel'),
            sleepQuality: this.calculateAverage(recentCheckIns, 'sleepQuality')
          };
        }
      }
    });
  }

  calculateAverage(checkIns: MentalCheckIn[], property: keyof MentalCheckIn): number {
    const sum = checkIns.reduce((acc, curr) => acc + Number(curr[property]), 0);
    return Math.round((sum / checkIns.length) * 10) / 10;
  }

  getActivityIcon(activity: Activity): string {
    const icons: {[key: string]: string} = {
      'running': 'walk-outline',
      'cycling': 'bicycle-outline',
      'swimming': 'water-outline',
      'gym': 'barbell-outline',
      'yoga': 'body-outline',
      'other': 'fitness-outline'
    };
    return icons[activity.type] || 'fitness-outline';
  }
}
