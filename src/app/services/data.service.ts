// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {BehaviorSubject, delay, Observable, of} from 'rxjs';
import { Activity } from '../models/activity';
import { MentalCheckIn } from '../models/mental-check-in';
import { v4 as uuidv4 } from 'uuid';
import {NutritionEntry} from "../models/nutrition-entry";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  private mentalCheckInsSubject = new BehaviorSubject<MentalCheckIn[]>([]);
  private storageReady = false;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    await this.loadActivities();
    await this.loadMentalCheckIns();
  }

  // Activities
  async loadActivities() {
    if (!this.storageReady) await this.initStorage();
    const activities = await this.storage.get('activities') || [];
    this.activitiesSubject.next(activities);
  }

  getActivities(): Observable<Activity[]> {
    return this.activitiesSubject.asObservable();
  }

  async addActivity(activity: Omit<Activity, 'id'>) {
    const newActivity: Activity = {
      ...activity,
      id: uuidv4()
    };

    const activities = [...this.activitiesSubject.value, newActivity];
    await this.storage.set('activities', activities);
    this.activitiesSubject.next(activities);
  }

  // Mental Check-ins
  async loadMentalCheckIns() {
    if (!this.storageReady) await this.initStorage();
    const checkIns = await this.storage.get('mentalCheckIns') || [];
    this.mentalCheckInsSubject.next(checkIns);
  }

  getMentalCheckIns(): Observable<MentalCheckIn[]> {
    return this.mentalCheckInsSubject.asObservable();
  }

  async addMentalCheckIn(checkIn: Omit<MentalCheckIn, 'id'>) {
    const newCheckIn: MentalCheckIn = {
      ...checkIn,
      id: uuidv4()
    };

    const checkIns = [...this.mentalCheckInsSubject.value, newCheckIn];
    await this.storage.set('mentalCheckIns', checkIns);
    this.mentalCheckInsSubject.next(checkIns);
  }

  // Update src/app/services/data.service.ts to include this method
  async addNutritionEntry(entry: NutritionEntry): Promise<Observable<any>> {
    // If using a mock service for now
    return of({ success: true }).pipe(delay(500));

    // If using HTTP client to a backend
    // return this.http.post<any>(`${this.apiUrl}/nutrition`, entry);
  }
}
