import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { addIcons } from 'ionicons';
import { locateOutline, heart, heartOutline } from 'ionicons/icons';
import { AddressService } from '../../../services/adress.service';
import { OrdersService } from '../../../services/orders.service';
import { Address } from '../../../models/adress';
import { AromiaApi } from 'src/app/services/request';
import { ENDPOINTS } from 'src/environments/endpoints';
import { StorageKey, StorageService } from 'src/app/services/storage.service';
import { Customer } from 'src/app/models/customer';

// Leaflet will use default marker icons from CDN


interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class ConfirmationPage implements OnInit {
  map!: L.Map;
  marker!: L.Marker;
  selectedAddress: string = '';
  selectedCoordinates = { lat: 0, lng: 0 };
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  savedAddressId: number | null = null;
  isFavorite: boolean = false;
  addressDetails = {
    city: 'San José',
    state: 'San José',
    country: 'Costa Rica'
  };

  user!: Customer

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private addressService: AddressService,
    private ordersService: OrdersService,
    private api: AromiaApi,
    private local: StorageService
  ) {
    addIcons({ locateOutline, heart, heartOutline });
  }

  ngOnInit() {
    this.getUserData();
  }

  ionViewDidEnter() {
    this.initMap();
  }

  getUserData() {
    this.local.get<Customer>(StorageKey.User).then((user) => {
      if (user) {
        this.user = user
      }

    })
  }

  ionViewWillLeave() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    setTimeout(() => {
      const defaultLat = 9.949513;
      const defaultLng = -84.096651;

      this.map = L.map('map', {
        center: [defaultLat, defaultLng],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.map);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin"></div>',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
      });

      this.marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: customIcon
      }).addTo(this.map);

      this.marker.on('dragend', () => {
        this.onMarkerDragEnd();
      });

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.moveMarker(e.latlng.lat, e.latlng.lng);
      });

      this.map.whenReady(() => {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      });

      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);

      setTimeout(() => {
        this.map.invalidateSize();
      }, 500);

      this.getCurrentLocation();
    }, 100);
  }

  async getCurrentLocation() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo ubicación...',
      duration: 10000
    });
    await loading.present();

    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      this.map.setView([lat, lng], 16);
      this.marker.setLatLng([lat, lng]);

      this.selectedCoordinates = { lat, lng };
      await this.reverseGeocode(lat, lng);

      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.error('Error getting location:', error);

      const alert = await this.alertController.create({
        header: 'Error de Ubicación',
        message: 'No se pudo obtener tu ubicación. Por favor, busca tu dirección manualmente o verifica los permisos de ubicación.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  moveMarker(lat: number, lng: number) {
    this.marker.setLatLng([lat, lng]);
    this.selectedCoordinates = { lat, lng };
    this.reverseGeocode(lat, lng);
  }

  onMarkerDragEnd() {
    const position = this.marker.getLatLng();
    this.selectedCoordinates = { lat: position.lat, lng: position.lng };
    this.reverseGeocode(position.lat, position.lng);
  }

  async reverseGeocode(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        this.selectedAddress = data.display_name;
        // Store structured address data for later use
        this.addressDetails = {
          city: data.address?.city || data.address?.town || data.address?.village || 'San José',
          state: data.address?.state || 'San José',
          country: data.address?.country || 'Costa Rica'
        };
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      this.selectedAddress = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  }

  async onSearchInput(event: any) {
    const query = event.target.value;

    if (!query || query.length < 3) {
      this.searchResults = [];
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      this.searchResults = await response.json();
    } catch (error) {
      console.error('Error searching address:', error);
      this.searchResults = [];
    }
  }

  onSearchClear() {
    this.searchResults = [];
    this.searchQuery = '';
  }

  selectSearchResult(result: SearchResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    this.map.setView([lat, lng], 16);
    this.marker.setLatLng([lat, lng]);

    this.selectedAddress = result.display_name;
    this.selectedCoordinates = { lat, lng };

    this.searchResults = [];
    this.searchQuery = '';
  }

  async addFavoriteDirection() {
    if (!this.selectedAddress) {
      const toast = await this.toastController.create({
        message: 'Por favor, selecciona una dirección primero.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // Ensure user is loaded
    if (!this.user || !this.user.id) {
      const toast = await this.toastController.create({
        message: 'Error: Usuario no identificado. Por favor, inicia sesión nuevamente.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    console.log('addFavoriteDirection - User ID:', this.user.id);

    const loading = await this.loadingController.create({
      message: 'Guardando dirección favorita...'
    });
    await loading.present();

    try {
      // Save the address if not already saved
      await this.saveAddressIfNeeded();

      // Set as default/favorite
      if (this.savedAddressId) {
        console.log('Setting default - User ID:', this.user.id, 'Address ID:', this.savedAddressId);
        await this.addressService.setDefault(this.user.id, this.savedAddressId).toPromise();
        this.isFavorite = true;

        await loading.dismiss();

        const toast = await this.toastController.create({
          message: '¡Dirección guardada como favorita!',
          duration: 2000,
          color: 'success',
          icon: 'heart'
        });
        await toast.present();
      } else {
        await loading.dismiss();
        throw new Error('No se pudo guardar la dirección');
      }
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving favorite address:', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo guardar la dirección favorita. Por favor, intenta de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async confirmAddress() {
    if (!this.selectedAddress) {
      const alert = await this.alertController.create({
        header: 'Dirección Requerida',
        message: 'Por favor, selecciona una dirección de entrega.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Dirección',
      message: '¿Deseas confirmar esta dirección y crear tu orden?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: async () => {
            await this.createOrder();
          }
        }
      ]
    });
    await alert.present();
  }

  private async createOrder() {
    const loading = await this.loadingController.create({
      message: 'Creando orden...'
    });
    await loading.present();

    try {
      // Get cart from localStorage
      const cartItems = await this.local.get<any[]>('cart');

      // Validate cart is not empty
      if (!cartItems || cartItems.length === 0) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Carrito Vacío',
          message: 'No tienes productos en tu carrito. Agrega productos antes de crear una orden.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Calculate totals from cart items
      const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.cant), 0);
      const shippingCost = 1000; // Fixed shipping cost
      const taxRate = 0.13; // 13% tax
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount + shippingCost;

      // Save address if not already saved
      await this.saveAddressIfNeeded();

      // Create order with the saved address and cart data
      if (this.savedAddressId) {
        const orderData = {
          order_number: this.generateOrderNumber(),
          customer_id: this.user.id,
          address_id: this.savedAddressId,
          status_id: 1,
          subtotal: subtotal,
          tax_amount: taxAmount,
          shipping_cost: shippingCost,
          discount_amount: 0,
          total_amount: totalAmount,
          notes: 'Orden creada desde la app movil',
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.cant,
            unit_price: parseFloat(item.price),
            total: parseFloat(item.price) * item.cant
          }))
        };

        const order = await this.ordersService.createOrder(orderData).toPromise();

        await loading.dismiss();

        const successAlert = await this.alertController.create({
          header: '¡Orden Creada!',
          message: `Tu orden #${orderData.order_number} ha sido creada exitosamente.`,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.local.remove(StorageKey.Cart)
                this.router.navigate(['/home']);
              }
            }
          ]
        });
        await successAlert.present();
      } else {
        await loading.dismiss();
        throw new Error('No se pudo guardar la dirección');
      }
    } catch (error) {
      await loading.dismiss();
      console.error('Error creating order:', error);

      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo crear la orden. Por favor, intenta de nuevo.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  private async saveAddressIfNeeded(): Promise<void> {
    if (this.savedAddressId) {
      return; // Address already saved
    }

    if (!this.user || !this.user.id) {
      throw new Error('Usuario no identificado');
    }

    const addressData: Address = {
      alias: 'Dirección de entrega',
      streetAddress: this.selectedAddress,
      city: this.addressDetails.city,
      state: this.addressDetails.state,
      country: this.addressDetails.country,
      additionalInfo: `Lat: ${this.selectedCoordinates.lat.toFixed(6)}, Lng: ${this.selectedCoordinates.lng.toFixed(6)}`,
      isDefault: false
    };

    console.log('saveAddressIfNeeded - User ID:', this.user.id);
    console.log('saveAddressIfNeeded - Address Data:', addressData);

    const savedAddress = await this.addressService.addAddress(this.user.id, addressData).toPromise();
    console.log('saveAddressIfNeeded - Saved Address:', savedAddress);
    this.savedAddressId = savedAddress?.id || null;
  }



  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}-${random}`;
  }
}
