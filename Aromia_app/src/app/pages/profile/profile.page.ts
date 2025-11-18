import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  loading = false;

  form = this.fb.group({
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone: [''],
    date_of_birth: [''], // por ahora como input type="date"
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (customer: Customer) => {
        this.loading = false;
        this.form.patchValue(customer);
      },
      error: async () => {
        this.loading = false;
        const toast = await this.toastCtrl.create({
          message: 'Error al cargar tus datos.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  async onSave() {
    if (this.form.invalid) return;

    this.loading = true;
    // no enviamos email porque normalmente no se edita
    const { email, ...data } = this.form.getRawValue();
    

    
  }
}