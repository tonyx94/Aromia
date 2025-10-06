import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ApiAromia} from '../../services/api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { IUser } from '../../models/user';
import { StorageKey, StorageService } from '../../services/storage.service';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'aromia-clients',
  imports: [MessageModule, ButtonModule, DividerModule, InputTextModule, ReactiveFormsModule, SelectModule, FormsModule, FloatLabelModule, CommonModule],
  standalone: true,
  providers: [MessageService], 
  templateUrl: './aromia-clients.component.html',
  styleUrl: './aromia-clients.component.scss'
})
export class AromiaClientsComponent implements OnInit {

  @Output() ready = new EventEmitter<boolean>();

  private api = inject(ApiAromia);
  private local = inject(StorageService);
  private messageService = inject(MessageService);

  formClient: FormGroup | undefined;

  register_type = [
  { name: 'Cliente Físico', value: 'fisico' },
  { name: 'Empresa', value: 'empresa' }
];

companies: any[] = []
selectedCompany: any
user!: IUser

isLoading: boolean = false

messageError!: any;

  ngOnInit(): void {
    this.local.get<IUser>(StorageKey.User).then((user) => {
      if(!user) return;
      this.user = user
    })
   this.getCompanies()
    this.formClient = new FormGroup({
      type: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      identity: new FormControl(null, Validators.required),
      company: new FormControl(null, Validators.required),
      user_id: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  getCompanies() {
    //  this.api.clients.getCompanies().subscribe({
    //   next:(response) => {
    //     this.companies = response
    //   },
    //   error:(e) => {
    //     this.message(e.error.message, 'error')
    //   }
    //  })
  }

   message(message: string, status: 'error' | 'success' | 'info' | 'warning', title?: string) {
    const summary =
      status == 'error'
        ? 'Algo salió mal'
        : status == 'success'
          ? 'Operación exitosa!'
          : status == 'warning'
            ? 'Cuidado con esto'
            : status == 'info'
              ? 'Ten presente lo siguiente'
              : '';

    this.messageService.add({
      severity: status,
      summary: title || summary.toLocaleUpperCase(),
      text: message,
      detail: message,
      life: 5000
    });
  }


  addClient() {
    if (!this.formClient) {
      alert('Formulario no válido');
      return;
    }

    this.messageError = "";
    this.formClient?.disable();
    this.isLoading = true

      this.formClient.value.user_id = this.user.user_id;

      // this.api.clients.createClient(this.formClient.value).subscribe({
      //   next: (response) => {
      //     this.ready.emit(true)
      //     this.isLoading = false
      //     console.log(response)
      //     this.formClient?.reset()
      //     this.formClient?.enable()
      //     this.message("Se guardo correctamente el cliente", 'error')
      //   },
      //   error: (e) => {
      //     this.isLoading = false
      //     this.formClient?.enable()
      //     this.messageError = e.error.message
      //     this.message(e.error.message, 'error')
      //   }
      // })
  }

    addCompany() {
      this.messageError = ""
      this.formClient?.disable()
      this.isLoading = true
      if (this.formClient) {
      this.formClient.value.user_id = this.user.user_id;
      console.log(this.formClient.value);
    }
      // this.api.clients.createCompanies(this.formClient?.value).subscribe({
      //   next: (response) => {
      //     this.ready.emit(true)
      //     this.isLoading = false
      //     console.log(response)
      //     this.formClient?.reset()
      //     this.formClient?.enable()
      //     this.message("Se guardo correctamente el cliente", 'error')
      //   },
      //   error: (e) => {
      //     console.log(e.error.message)
      //     this.isLoading = false
      //     this.formClient?.enable()
      //     this.messageError = e.error.message
      //     this.message(e.error.message, 'error')
      //     console.error(e)
      //   }
      // })
  }

}
