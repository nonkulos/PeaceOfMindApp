// src/app/pages/activities/activities.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { Activity } from '../../models/activity';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ActivitiesPage implements OnInit {
  activityForm: FormGroup;
  activityTypes = [
    { value: 'run', label: 'Running', icon: 'walk-outline' },
    { value: 'cycling', label: 'Cycling', icon: 'bicycle-outline' },
    { value: 'swim', label: 'Swimming', icon: 'water-outline' },
    { value: 'strength', label: 'Strength Training', icon: 'barbell-outline' },
    { value: 'team', label: 'Team Practice', icon: 'people-outline' },
    { value: 'other', label: 'Other', icon: 'fitness-outline' }
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
    private navController: NavController
  ) {
    this.activityForm = this.fb.group({
      type: ['run', Validators.required],
      title: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      intensity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      notes: ['']
    });
  }

  ngOnInit() {}

  async saveActivity() {
    if (this.activityForm.valid) {
      const activity: Activity = {
        ...this.activityForm.value,
        icon: this.getIconForActivityType(this.activityForm.value.type)
      };

      this.dataService.addActivity(activity).subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'Activity saved successfully!',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.navController.navigateBack('/dashboard');
        },
        error: async (error) => {
          const toast = await this.toastController.create({
            message: 'Error saving activity: ' + error,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
    }
  }

  getIconForActivityType(type: string): string {
    const activityType = this.activityTypes.find(a => a.value === type);
    return activityType ? activityType.icon : 'fitness-outline';
  }
}
