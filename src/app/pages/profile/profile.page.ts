// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  profileImage = 'assets/default-avatar.png';
  isEditing = false;

  sportsList = [
    'Basketball', 'Soccer', 'Swimming', 'Running', 'Tennis',
    'Volleyball', 'Cycling', 'Triathlon', 'CrossFit', 'Weightlifting',
    'Track & Field', 'Rugby', 'Baseball', 'Hockey', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
    private navController: NavController,
    private alertController: AlertController
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: [''],
      sport: ['', Validators.required],
      team: [''],
      height: ['', [Validators.min(0)]],
      weight: ['', [Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      emergencyContact: [''],
      emergencyPhone: [''],
      medicalNotes: [''],
      goals: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.dataService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        if (profile) {
          this.profileForm.patchValue(profile);
          this.profileForm.patchValue(profile);
          if ('profileImage' in profile && profile.profileImage) {
            // this.profileImage = profile.profileImage;
          }
          this.profileForm.disable(); // Initially display in read-only mode
        }
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      const profileData = {
        ...this.profileForm.value,
        profileImage: this.profileImage
      };

      (await this.dataService.updateUserProfile(profileData)).subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'Profile updated successfully!',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.isEditing = false;
          this.profileForm.disable();
        },
        error: async (error: any) => {
          const toast = await this.toastController.create({
            message: 'Error updating profile: ' + error,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
    } else {
      const invalidFields: string[] = [];
      Object.keys(this.profileForm.controls).forEach(key => {
        if (this.profileForm.get(key)?.invalid) {
          invalidFields.push(key.replace(/([A-Z])/g, ' $1').toLowerCase());
        }
      });

      const alert = await this.alertController.create({
        header: 'Invalid Form',
        message: `Please check the following fields: ${invalidFields.join(', ')}`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async changeProfileImage() {
    // In a real app, this would open a file picker or camera
    const alert = await this.alertController.create({
      header: 'Change Profile Picture',
      message: 'This would normally open your device camera or gallery',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sample Image',
          handler: () => {
            // Just setting a different sample image for demo purposes
            const images = [
              'assets/athlete-1.png',
              'assets/athlete-2.png',
              'assets/default-avatar.png'
            ];
            const currentIndex = images.indexOf(this.profileImage);
            const nextIndex = (currentIndex + 1) % images.length;
            this.profileImage = images[nextIndex];
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Log Out',
          handler: () => {
            // Handle logout logic
            this.dataService.logout().subscribe({
              next: () => {
                this.navController.navigateRoot('/login');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
