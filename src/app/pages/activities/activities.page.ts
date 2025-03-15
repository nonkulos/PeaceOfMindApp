// src/app/pages/activities/activities.page.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastController, NavController, IonicModule} from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { Activity } from '../../models/activity';
import { CommonModule } from '@angular/common';
import {error} from "@angular/compiler-cli/src/transformers/util";

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
export class ActivitiesPage  {
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

  async saveActivity() {
    if (this.activityForm.valid) {
      const activity: Activity = {
        ...this.activityForm.value,
        icon: this.getIconForActivityType(this.activityForm.value.type)
      };

      try {
        await this.dataService.addActivity(activity);
        const toast = await this.toastController.create({
          message: 'Activity saved successfully!',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.navController.navigateBack('/dashboard');
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error saving activity: ' + error,
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    }
  }

  getIconForActivityType(type: string): string {
    const activityType = this.activityTypes.find(a => a.value === type);
    return activityType ? activityType.icon : 'fitness-outline';
  }


}
