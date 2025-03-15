// src/app/app.component.ts
import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonicModule,
    RouterLink
  ]
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'Activities', url: '/activities', icon: 'bicycle' },
    { title: 'Mental Health', url: '/mental-health', icon: 'heart' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  // In your app.component.ts file
  labels: string[] = ['Family', 'Friends', 'Work', 'Notes', 'Reminders'];

  constructor() {}
}
