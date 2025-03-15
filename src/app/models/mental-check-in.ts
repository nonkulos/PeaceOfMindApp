// src/app/models/mental-check-in.ts
export interface MentalCheckIn {
  id: string;
  date: Date;
  overallMood: number;
  stressLevel: number;
  sleepQuality: number;
  motivation: number;
  anxietyLevel?: number;
  focusRating?: number;
  notes?: string;
  tags?: string[];
}
