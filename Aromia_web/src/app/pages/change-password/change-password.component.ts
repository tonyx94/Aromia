import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';

import { Password } from 'primeng/password';
import { Card } from 'primeng/card';
import { StorageKey, StorageService } from '../../services/storage.service';
import { IUser } from '../../models/user';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiAromia } from '../../services/api.service';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule, Button, ReactiveFormsModule, Password, Card],
  providers: [MessageService],
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

  private local = inject(StorageService)

  changePasswordForm: FormGroup;
  loading = false;
  emailSent = false;

  user!: IUser

  constructor(
    private fb: FormBuilder,
    private api: ApiAromia,
    private messageService: MessageService,
    private route: Router
  ) {
    this.changePasswordForm = this.fb.group({
      new_password: ['', [Validators.required]],
      current_password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.local.get<IUser>(StorageKey.User).then((user) => {
      if(user) {
        this.user = user
      }
    })
  }
  
  onSubmit() {
    
     const { current_password, new_password } = this.changePasswordForm.value;

     if(!new_password || !current_password) {
      this.message('Tienes que ingresar ambas contraseñas para proceder con el cambio!', 'info', `Importante ${this.user.name}`)
      return
     }

    // this.api.users.forceChangePassword(this.user.user_id, current_password, new_password ).subscribe({
    //   next: (response) => {
    //     console.log(response)
    //     if(response) {
    //       this.message(response.message, 'success', `Muy bien ${this.user.name}!`)
    //       this.route.navigateByUrl('/home')
    //     }

    //     if(response) {
    //       this.message(response.message, 'error', `Ops!`)
    //     }
        
    //   },
    //   error: (error) => {
    //     console.error(error)
    //     this.message(error.error.message, 'error', `Ops!`)
    //   }
    // })

  }


  isInvalid(controlName: string): boolean {
    const control = this.changePasswordForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  message(message: string, status: 'error' | 'success' | 'info' | 'warning', title?: string, duration?: number) {
      const summary = 
        status == 'error'? 'Algo salió mal' :
        status == 'success'? 'Operación exitosa!' :
        status == 'warning'? 'Cuidado con esto':
        status == 'info'? 'Ten presente lo siguiente' : ""
  
      const options: ToastMessageOptions = {}
  
      this.messageService.add({
        severity: status,
        summary: title || summary.toLocaleUpperCase(),
        text: message,
        detail: message,
        life: 5000
      });
    }
}
