// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'Activities', url: '/activities', icon: 'bicycle' },
    { title: 'Mental Health', url: '/mental-health', icon: 'heart' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  constructor() {}
}
