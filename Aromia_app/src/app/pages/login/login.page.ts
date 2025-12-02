import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonInputPasswordToggle } from '@ionic/angular/standalone';
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
  constructor(private local: StorageService, private api: AromiaApi, private route: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['customer', Validators.required],
    });
  }

  ngOnInit() {
  }

  login() {

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
