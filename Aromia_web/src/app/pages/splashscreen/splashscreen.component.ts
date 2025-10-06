import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageKey, StorageService } from '../../services/storage.service';

import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IUser } from '../../models/user';
import { ApiAromia } from '../../services/api.service';


@Component({
  selector: 'app-splashscreen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [MessageService],
  templateUrl: './splashscreen.component.html',
  styleUrl: './splashscreen.component.scss'
})
export class SplashscreenComponent implements OnInit {

   private local = inject(StorageService);
  version: any

  constructor(
    private api: ApiAromia,
    private messageService: MessageService,
    private route: Router

  ) {}
 
  ngOnInit() {
    this.version = environment.version

    this.local.get<IUser>(StorageKey.User).then(user => {
      if (user) {
        this.message(`Bienvenido ${user.name}`, 'success', "Ingreso Exitoso!")
        setTimeout(() => {
          this.route.navigateByUrl('/home')
        }, 2000);
        
      }
    });
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
