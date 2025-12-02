import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  AlertController,
  ToastController,
} from '@ionic/angular';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Address } from 'src/app/models/adress';
import { AddressService } from 'src/app/services/adress.service';


@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {
  addresses: Address[] = [];
  loading = false;
  customerId: number = 0;

  // El mismo formulario sirve para crear y editar
  form = this.fb.group({
    id: [null as number | null],
    alias: ['', Validators.required],
    street_address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postal_code: [''],
    country: [''],
    additional_info: [''],
    is_default: [false],
  });

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { }

  async ngOnInit() {
    // Retrieve customerId from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.customerId = user.id;
    }
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this.addressService.getAddresses(this.customerId).subscribe({
      next: (list) => {
        this.addresses = list;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        const toast = await this.toastCtrl.create({
          message: 'Error al cargar direcciones.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  newAddress() {
    this.form.reset({
      id: null,
      alias: '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      additional_info: '',
      is_default: false,
    });
  }

  editAddress(addr: Address) {
    this.form.setValue({
      id: addr.id ?? null,
      alias: addr.alias,
      street_address: addr.streetAddress,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postalCode ?? '',
      country: addr.country ?? '',
      additional_info: addr.additionalInfo ?? '',
      is_default: !!addr.isDefault,
    });
  }

  async deleteAddress(addr: Address) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar dirección',
      message: `¿Seguro que quieres eliminar "${addr.alias}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (!addr.id) return;
            this.addressService.deleteAddress(this.customerId, addr.id).subscribe({
              next: async () => {
                this.loadAddresses();
                const toast = await this.toastCtrl.create({
                  message: 'Dirección eliminada.',
                  duration: 2000,
                  color: 'success',
                });
                await toast.present();
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  setAsDefault(addr: Address) {
    if (!addr.id) return;
    this.addressService.setDefault(this.customerId, addr.id).subscribe({
      next: async () => {
        this.loadAddresses();
        const toast = await this.toastCtrl.create({
          message: 'Dirección marcada como predeterminada.',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
      },
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const id = value.id;

    const payload: Address = {
      alias: value.alias!,
      streetAddress: value.street_address!,
      city: value.city!,
      state: value.state!,
      postalCode: value.postal_code || undefined,
      country: value.country || undefined,
      additionalInfo: value.additional_info || undefined,
      isDefault: value.is_default || false,
    };

    if (id) {
      // actualizar
      this.addressService.updateAddress(this.customerId, id, payload).subscribe({
        next: async () => {
          this.loadAddresses();
          const toast = await this.toastCtrl.create({
            message: 'Dirección actualizada.',
            duration: 2000,
            color: 'success',
          });
          await toast.present();
        },
      });
    } else {
      // crear nueva
      this.addressService.addAddress(this.customerId, payload).subscribe({
        next: async () => {
          this.loadAddresses();
          this.newAddress();
          const toast = await this.toastCtrl.create({
            message: 'Dirección agregada.',
            duration: 2000,
            color: 'success',
          });
          await toast.present();
        },
      });
    }
  }
}