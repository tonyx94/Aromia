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
  ) {}

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this.addressService.getAddresses().subscribe({
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
      street_address: addr.street_address,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code ?? '',
      country: addr.country ?? '',
      additional_info: addr.additional_info ?? '',
      is_default: !!addr.is_default,
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
            this.addressService.deleteAddress(addr.id).subscribe({
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
    this.addressService.setDefault(addr.id).subscribe({
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
      street_address: value.street_address!,
      city: value.city!,
      state: value.state!,
      postal_code: value.postal_code || undefined,
      country: value.country || undefined,
      additional_info: value.additional_info || undefined,
      is_default: value.is_default || false,
    };

    if (id) {
      // actualizar
      this.addressService.updateAddress(id, payload).subscribe({
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
      this.addressService.addAddress(payload).subscribe({
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