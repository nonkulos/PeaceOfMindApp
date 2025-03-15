// src/app/models/nutrition-entry.ts
export interface NutritionEntry {
  id?: string;
  mealType: string;
  title: string;
  date: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  water?: number;
  notes?: string;
  icon?: string;
}
