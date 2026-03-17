import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonInput, IonButton, IonInputPasswordToggle, IonIcon, ToastController } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle } from 'ionicons/icons';
import { ENDPOINTS } from '../../../environments/endpoints';
import { AromiaApi } from '../../services/request';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonButton, IonInput, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInputPasswordToggle, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  form!: FormGroup;

  constructor(private api: AromiaApi, private fb: FormBuilder, private toastController: ToastController) {
    addIcons({ logoGoogle, logoFacebook });

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: [null, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      dateOfBirth: [new Date(), Validators.required],
    });
  }





  ngOnInit() {
    this.api.get(ENDPOINTS.USERS.GET_ALL).subscribe(data => {
      console.log(data);
    });
  }

  async register() {
    console.log('Register user');
    console.log(this.form.value);

    if (this.form.invalid) {
      const invalidFields = [];
      const controls = this.form.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          let fieldName = name;
          switch (name) {
            case 'firstName': fieldName = 'Nombre'; break;
            case 'lastName': fieldName = 'Apellido'; break;
            case 'phone': fieldName = 'Teléfono (8 dígitos)'; break;
            case 'email': fieldName = 'Correo'; break;
            case 'password': fieldName = 'Contraseña'; break;
            case 'confirmPassword': fieldName = 'Confirmar Contraseña'; break;
            case 'dateOfBirth': fieldName = 'Fecha de nacimiento'; break;
          }
          invalidFields.push(fieldName);
        }
      }

      const toast = await this.toastController.create({
        message: `Corregir campos: ${invalidFields.join(', ')}`,
        duration: 4000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const { confirmPassword, ...user } = this.form.value;

    this.api.post(ENDPOINTS.USERS.CREATE, user).subscribe({
      next: (data) => {
        console.log('User created', data);
        alert('Usuario registrado con éxito');
        this.form.reset();
      },
      error: (error) => {
        console.error('Error creating user', error);
        alert('Error al registrar el usuario');
      }
    });
  }
}
