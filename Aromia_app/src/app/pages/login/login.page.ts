import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonInputPasswordToggle, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ENDPOINTS } from '../../../environments/endpoints';
import { AromiaApi } from '../../services/request';
import { StorageKey, StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, IonInput, IonButton, IonContent, IonHeader, CommonModule, FormsModule, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  constructor(private local: StorageService, private api: AromiaApi, private route: Router, private fb: FormBuilder, private toastController: ToastController) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['customer', Validators.required],
    });
  }

  ngOnInit() {
  }

  async login() {
    if (this.form.invalid) {
      const invalidFields = [];
      const controls = this.form.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          let fieldName = name;
          if (name === 'email') fieldName = 'Correo';
          if (name === 'password') fieldName = 'Contraseña';
          invalidFields.push(fieldName);
        }
      }

      const toast = await this.toastController.create({
        message: `Por favor completa los siguientes campos: ${invalidFields.join(', ')}`,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    this.api.post(ENDPOINTS.AUTH.LOGIN, this.form.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);


        this.local.set(StorageKey.Token, response.access_token)
        this.local.set(StorageKey.User, response.user)

        this.route.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Error de inicio de sesión: ' + (error.error?.message || 'Por favor, verifica tus credenciales.'));
      }
    });
  }

  goTo(page: string) {
    this.route.navigate([page]);
  }

}
