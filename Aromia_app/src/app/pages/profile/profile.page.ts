import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { Customer } from '../../models/customer';
import { StorageKey, StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'aromia-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  loading = false;

  form = this.fb.group({
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: [''],
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastCtrl: ToastController,
    private local: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.local.get<Customer>(StorageKey.User).then((u) => {
      if (u) {
        this.form.setValue({
          email: u.email,
          name: u.name,
          phone: u.phone || ''
        });
      }
    }).finally(() => {
      this.loading = false;
    });
  }

  async onSave() {
    if (this.form.invalid) return;

    this.loading = true;
    // no enviamos email porque normalmente no se edita
    const { email, ...data } = this.form.getRawValue();



  }

  async onLogout() {
    try {
      await this.local.removeAll();

      const toast = await this.toastCtrl.create({
        message: 'Sesión cerrada exitosamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al cerrar sesión',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}