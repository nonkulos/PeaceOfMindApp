// src/app/models/activity.ts
export interface Activity {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  date: Date;
  category: string;
  intensity?: number;
  notes?: string;
}
