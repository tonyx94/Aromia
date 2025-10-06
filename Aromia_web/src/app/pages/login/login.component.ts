import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { ApiAromia } from '../../services/api.service';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageKey, StorageService } from '../../services/storage.service';
import { IUser } from '../../models/user';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/apis/auth.service';
import { ENDPOINTS } from '../../../environments/endpoints';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToggleButtonModule, 
    CommonModule,
    FormsModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ChipModule,
    ToastModule,
    Toast,
    ButtonModule,
    DialogModule
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private local = inject(StorageService);
  private authService = inject(AuthService);

  loginForm!: FormGroup;
  checked!: any;
  version: any;
  isOpenForgotPassword: boolean = false;
  isLoggingIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiAromia,
    private messageService: MessageService,
    private route: Router
  ) {}

  async ngOnInit() {
    this.version = environment.version;
    
    this.loginForm = this.fb.group({
      email: ['tony18x@gmail.com', Validators.required],
      password: ['123123', Validators.required],
      userType: ['admin', Validators.required],
    });


    try {
      if (await this.authService.isAuthenticated()) {
        this.route.navigateByUrl('/home');
        return;
      }
    } catch (error) {
      console.error('Error verificando autenticación en login:', error);
    }
  }

  login() {
    if (this.loginForm.invalid || this.isLoggingIn) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, userType } = this.loginForm.value;

    this.isLoggingIn = true;


    this.api.post(ENDPOINTS.AUTH.LOGIN, { email, password, userType }).subscribe({
      next: (response) => {
        console.log(response);
        this.route.navigateByUrl('/home');
        if (response && response.access_token) {
          this.local.set(StorageKey.Token, response.access_token);
          this.local.set(StorageKey.User, response.user);
          this.message(`Bienvenido ${response.user.name}`, 'success', "Ingreso Exitoso!");
        
          setTimeout(() => {
            this.route.navigateByUrl('home');
          }, 500);
        }
        // if (response.mustChangePassword) {
        //   this.message(
        //     'Has utilizado una contraseña temporal. Por lo que debe de realizar el cambio de contraseña!', 
        //     'info', 
        //     `Bienvenido ${response.user.name}`
        //   );
        //   this.route.navigateByUrl('/change-password');
        //   return;
        // }
        
        
      }, 
      error: (e) => {
        console.log(e);
        this.message(e.error?.message || 'Error al iniciar sesión', 'error');
        this.isLoggingIn = false;
      },
      complete: () => {
        this.isLoggingIn = false;
      }
    });
  }

  isInvalid(controlName: string): boolean {
    if (!this.loginForm) return false;
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  message(message: string, status: 'error' | 'success' | 'info' | 'warning', title?: string, duration?: number) {
    const summary = 
      status == 'error' ? 'Algo salió mal' :
      status == 'success' ? 'Operación exitosa!' :
      status == 'warning' ? 'Cuidado con esto' :
      status == 'info' ? 'Ten presente lo siguiente' : "";

    this.messageService.add({
      severity: status,
      summary: title || summary.toUpperCase(),
      text: message,
      detail: message,
      life: duration || 5000
    });
  }

  openForgotPassword(is: boolean) {
    this.isOpenForgotPassword = is;
  }
}