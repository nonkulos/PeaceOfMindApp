// src/app/pages/mental-health/mental-health.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { MentalCheckIn } from '../../models/mental-check-in';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mental-health',
  templateUrl: './mental-health.page.html',
  styleUrls: ['./mental-health.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MentalHealthPage implements OnInit {
  checkInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
    private navController: NavController
  ) {
    this.checkInForm = this.fb.group({
      date: [new Date().toISOString(), Validators.required],
      overallMood: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      stressLevel: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      sleepQuality: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      notes: ['']
    });
  }

  ngOnInit() {}

  async saveCheckIn() {
    if (this.checkInForm.valid) {
      const checkIn: MentalCheckIn = this.checkInForm.value;

      this.dataService.addMentalCheckIn(checkIn).subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'Mental check-in saved successfully!',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.navController.navigateBack('/dashboard');
        },
        error: async (error) => {
          const toast = await this.toastController.create({
            message: 'Error saving check-in: ' + error,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
    }
  }
}
