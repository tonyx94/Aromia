import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ENDPOINTS } from '../../../environments/endpoints';
import { AromiaApi } from '../../services/request';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, IonInput, IonButton, IonContent, IonHeader,CommonModule, FormsModule, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  constructor(private api: AromiaApi, private route: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
        email: ['tony18x@gmail.com', Validators.email],
        password: ['123123', [Validators.required, Validators.minLength(6)]],
        userType: ['customer', Validators.required],
      }); 
  }

  ngOnInit() {
  }

  login() {

    this.api.post(ENDPOINTS.AUTH.LOGIN, this.form.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Guardar el token en el almacenamiento local o en un servicio de autenticación
        localStorage.setItem('token', response.access_token);
        // Redirigir al usuario a la página principal u otra página protegida
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
