// src/app/pages/nutrition/nutrition.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { NutritionEntry } from '../../models/nutrition-entry';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NutritionPage implements OnInit {
  nutritionForm: FormGroup;
  mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' },
    { value: 'lunch', label: 'Lunch', icon: 'restaurant-outline' },
    { value: 'dinner', label: 'Dinner', icon: 'moon-outline' },
    { value: 'snack', label: 'Snack', icon: 'nutrition-outline' },
    { value: 'hydration', label: 'Hydration', icon: 'water-outline' }
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
    private navController: NavController
  ) {
    this.nutritionForm = this.fb.group({
      mealType: ['breakfast', Validators.required],
      title: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      calories: ['', [Validators.min(0)]],
      protein: ['', [Validators.min(0)]],
      carbs: ['', [Validators.min(0)]],
      fats: ['', [Validators.min(0)]],
      water: ['', [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit() {
    // Conditionally require calories based on meal type
    this.nutritionForm.get('mealType')?.valueChanges.subscribe(mealType => {
      const caloriesControl = this.nutritionForm.get('calories');
      const waterControl = this.nutritionForm.get('water');

      if (mealType === 'hydration') {
        caloriesControl?.clearValidators();
        waterControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        caloriesControl?.setValidators([Validators.required, Validators.min(0)]);
        waterControl?.clearValidators();
      }

      caloriesControl?.updateValueAndValidity();
      waterControl?.updateValueAndValidity();
    });
  }

  async saveNutritionEntry() {
    if (this.nutritionForm.valid) {
      const nutritionEntry: NutritionEntry = {
        ...this.nutritionForm.value,
        icon: this.getIconForMealType(this.nutritionForm.value.mealType)
      };

      this.dataService.addNutritionEntry(nutritionEntry).subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'Nutrition entry saved successfully!',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.navController.navigateBack('/dashboard');
        },
        error: async (error) => {
          const toast = await this.toastController.create({
            message: 'Error saving entry: ' + error,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
    }
  }

  getIconForMealType(type: string): string {
    const mealType = this.mealTypes.find(m => m.value === type);
    return mealType ? mealType.icon : 'restaurant-outline';
  }

  isHydration() {
    return this.nutritionForm.get('mealType')?.value === 'hydration';
  }
}
