// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { Activity } from '../models/activity';
import { MentalCheckIn } from '../models/mental-check-in';
import { NutritionEntry } from "../models/nutrition-entry";
import { UserProfile } from "../models/user-profile";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  private mentalCheckInsSubject = new BehaviorSubject<MentalCheckIn[]>([]);
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  private storageReady = false;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    await this.loadActivities();
    await this.loadMentalCheckIns();
    await this.loadUserProfile();
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
    return of({ success: true }).pipe(delay(300));
  }

  // Nutrition Entries
  addNutritionEntry(entry: NutritionEntry): Observable<any> {
    // Mock implementation
    return of({ success: true }).pipe(delay(500));
  }

  // User Profile
  async loadUserProfile() {
    if (!this.storageReady) await this.initStorage();
    const profile = await this.storage.get('userProfile');
    this.userProfileSubject.next(profile);
  }

  getUserProfile(): Observable<UserProfile> {
    // If stored profile exists, return it
    if (this.userProfileSubject.value) {
      return of(this.userProfileSubject.value).pipe(delay(300));
    }

    // Otherwise return mock data
    const mockProfile: UserProfile = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      gender: 'male',
      sport: 'Basketball',
      team: 'Team A',
      height: 180,
      weight: 75,
      email: 'john.doe@example.com',
      phone: '1234567890',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '0987654321',
      medicalNotes: 'None',
      goals: 'Stay fit and improve performance',
      profileImage: 'assets/default-avatar.png'
    };

    return of(mockProfile).pipe(delay(500));
  }

  updateUserProfile(profile: UserProfile): Observable<any> {
    (async () => {
      await this.storage.set('userProfile', profile);
      this.userProfileSubject.next(profile);
    })();
    return of({ success: true }).pipe(delay(500));
  }

  logout(): Observable<any> {
    // Clear user data or authentication tokens as needed
    return of({ success: true }).pipe(delay(300));
  }
}
