import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { InputMaskModule } from 'primeng/inputmask';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { IUser } from '../../../../models/user';
import { AvatarModule } from 'primeng/avatar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ApiAromia } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment';
import { ENDPOINTS } from '../../../../../environments/endpoints';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    Dialog,
    Button,
    Toast,
    AvatarModule,
    MultiSelectModule,
    FormsModule,
    FloatLabel,
    CommonModule,
    TagModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    ChipsModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
    IconFieldModule,
    InputIcon
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private api = inject(ApiAromia);
  private messageService = inject(MessageService);
  public form!: FormGroup;
  public formUpdate!: FormGroup;

  visible: boolean = false;

  users!: IUser[];
  usersFiltered!: IUser[];

  roles: any[] = [
    'Dashboard',
    'Cotizaciones',
    'Tareas',
    'Mantenimiento',
    'Usuarios',
    'Reportes',
  ];

  formSubmitted = false;
  isLoading: boolean = false;

  userSelected!: IUser;

  search_user_text: any



  resetting = false;
  tempPasswordGenerated = false;
  tempPassword = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private confirm: ConfirmationService,
    private toast: MessageService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      position: ['user', Validators.required],
      rol: [[], Validators.required],
      color: ['#222222'],
      emailCompany: [''],
    });

    this.formUpdate = this.fb.group({
      user_id: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      position: ['user', Validators.required],
      rol: [[], Validators.required],
      color: ['#222222'],
      emailCompany: [''],
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  submit(type: 'create' | 'update') {
    console.log(this.form);

    this.isLoading = true;

    if (type == 'create') {
      // this.api.users.createUser(this.form.value).subscribe({
      //   next: (response) => {
      //     this.users = response;
      //     this.isLoading = false;
      //     this.messageService.add({
      //       severity: 'success', 
      //       summary: 'Usuario agregado',
      //       detail: `${this.form.value.name} ${this.form.value.lastname} fue agregado`,
      //     });
      //     this.form.reset();
      //     this.formSubmitted = false;
      //     this.getUsers();
      //   },
      //   error: (e) => {
      //     this.isLoading = false;
      //     console.log(e);
      //   },
      // });
    }

    if (type == 'update') {
      console.log(this.formUpdate.value)
      // this.api.users.update(this.formUpdate.value).subscribe({
      //   next: (response) => {
      //     this.users = response;
      //     this.isLoading = false;
      //     this.visible = false;
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Usuario actualizado',
      //       detail: `${this.formUpdate.value.name} ${this.formUpdate.value.lastname} fue actualizado`,
      //     });
      //     this.formUpdate.reset();
      //     this.formSubmitted = false;
      //     this.getUsers();
      //   },
      //   error: (e) => {
      //     this.isLoading = false; 
      //     console.log(e);
      //   },
      // });
    }
  }

  getUsers() {
    this.api.get(ENDPOINTS.CLIENTS.GET_ALL).subscribe({
      next: (response: any) => {
        this.users = response;
        this.usersFiltered = [...this.users]
        console.log(this.users);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  confirmToggleStatus(user: any) {
    this.confirm.confirm({
      message: `¿Seguro que deseas ${user.status ? 'inactivar' : 'activar'} este usuario?`,
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.isLoading = true;
        // this.api.users
        //   .changeStatus({ 
        //     user_id: user.user_id,
        //     status: !user.status,
        //   })
        //   .subscribe({
        //     next: () => {
        //       this.isLoading = false;
        //       this.toast.add({
        //         severity: 'success',
        //         summary: 'Estado actualizado',
        //         detail: `${user.user} fue ${user.status ? 'inactivado' : 'activado'}`,
        //       });
        //       this.getUsers();
        //     },
        //     error: (err) => {
        //       this.isLoading = false;
        //       this.toast.add({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: err.error?.message || 'No se pudo actualizar',
        //       });
        //     },
        //   });
      },
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  showDialog(is: boolean, user?: IUser) {
    this.visible = is;
    if (user) {
      this.userSelected = user;

      this.formUpdate = this.fb.group({
        user_id: [this.userSelected.user_id, Validators.required],
        name: [this.userSelected.name, Validators.required],
        lastname: [this.userSelected.lastname, Validators.required],
        phone: [this.userSelected.phone, Validators.required],
        position: [this.userSelected.position, Validators.required],
        rol: [this.userSelected.rol, Validators.required],
        color: [this.userSelected.color],
        emailCompany: [this.userSelected.emailCompany],
      });
    }
  }


  getColorForUser(user: any): string {
    const str = user.trim();
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 90;
    const lightness = 60;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getTextColorFromHSL(hslColor: string): string {
    const hsl = hslColor.match(/\d+/g);
    if (!hsl) return '#fff';

    const h = parseInt(hsl[0], 10) / 360;
    const s = parseInt(hsl[1], 10) / 100;
    const l = parseInt(hsl[2], 10) / 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };

    const r = f(0);
    const g = f(8);
    const b = f(4);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? '#000' : '#fff'; // texto negro o blanco
  }
  getLetterName(name: string) {
    return name.split(' ')[0].split('')[0].replace('null', ''); //+name.split(" ")[1].split("")[0]
  }


  filterUser(ev: any) {
    console.log(ev)
    if (this.search_user_text == '') {
      this.usersFiltered = [...this.users]
      return
    }

    this.usersFiltered = this.users.filter((u) =>
      u.name == this.search_user_text ||
      u.lastname == this.search_user_text ||
      u.emailCompany == this.search_user_text
    )
  }


  async resetUserPassword() {
    this.resetting = true;

    // try {
    //   const response = await this.api.users.resetUserPassword(this.userSelected.user_id).toPromise();

    //   if (response.success) {
    //     this.tempPassword = response.data.tempPassword;
    //     this.tempPasswordGenerated = true;

    //     alert('Contraseña temporal generada exitosamente');
    //   } else {
    //     alert('Error: ' + response.message);
    //   }
    // } catch (error) {
    //   alert('Error al generar contraseña temporal');
    //   console.error(error);
    // } finally {
    //   this.resetting = false;
    // }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.tempPassword).then(() => {
      alert('PIN copiado al portapapeles');
    });
  }
}
