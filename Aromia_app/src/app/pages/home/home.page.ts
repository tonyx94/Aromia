import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonChip, IonFooter, IonModal, IonButtons } from '@ionic/angular/standalone';
import { AromiaHeaderComponent } from '../../components/aromia-header/aromia-header.component';
import { AromiaApi } from '../../services/request';
import { ENDPOINTS } from 'src/environments/endpoints';
import { Product } from 'src/app/models/products';
import { StorageKey, StorageService } from 'src/app/services/storage.service';
import { AromiaCartComponent } from 'src/app/components/aromia-cart/aromia-cart.component';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/models/order';
import { DatePipe, CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFooter, IonChip, IonLabel, IonItem, IonButton, IonHeader, IonContent, AromiaHeaderComponent, IonModal, IonButtons, AromiaCartComponent, IonToolbar, DatePipe, CurrencyPipe],
})
export class HomePage implements OnInit, OnDestroy {
  products: Product[] = [];
  recommendedProducts: Product[] = [];

  banners: any[] = [
    { img: 'https://images.pexels.com/photos/3679973/pexels-photo-3679973.jpeg', logo: '../../../assets/aromia_logos/logo_white.svg', title: "Momento Dulce, Activado", subtitle: "Ordená tu favorito en un toque." },
    { img: 'https://images.pexels.com/photos/11272702/pexels-photo-11272702.jpeg', logo: '../../../assets/aromia_logos/logo_white.svg', title: "Frescuras de Escalante", subtitle: "Ingredientes top. Nada de cuentos." },
    { img: 'https://images.pexels.com/photos/5150204/pexels-photo-5150204.jpeg', logo: '../../../assets/aromia_logos/logo_white.svg', title: "Porque Sí, Te Lo Merecés", subtitle: "Un antojo no se discute. Se pide." },
    { img: 'https://images.pexels.com/photos/4311542/pexels-photo-4311542.jpeg', logo: '../../../assets/aromia_logos/logo_white.svg', title: "El Postre que No Sabías Que Necesitabas", subtitle: "Fresas, uvas y crema… punto." },
  ];
  currentBannerIndex: number = 0;
  private intervalId: any;
  isCartOpen: any;

  orders: Order[] = [];

  constructor(
    private api: AromiaApi,
    private route: Router,
    private local: StorageService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.startCarousel();
  }

  ionViewDidEnter() {
    this.getProducts();
    this.getOrders();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  async getOrders() {
    const user = await this.local.get<any>(StorageKey.User);
    const customerId = user?.id;

    this.ordersService.getMyOrders(customerId).subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders fetched:', orders);
      },
      error: (e) => {
        console.error('Error fetching orders', e);
      }
    });
  }

  getProducts() {
    this.api.get(ENDPOINTS.PRODUCTS.GET_ALL).subscribe({
      next: (products) => {
        products.forEach((product: Product) => product.cant = 0);

        this.products = products;
        this.setRecommendedProducts();

        this.local.get<Product[]>(StorageKey.Cart).then((c) => {
          if (c) {
            this.setCartInProducts(c)
          }
        })
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  setCartInProducts(c: Product[]) {
    c.forEach(item => {
      const product = this.products.find((p: Product) => p.id === item.id);
      const productFiltered = this.products.find((p: Product) => p.id === item.id);
      if (product) {
        product.cant = item.cant;
      }
      if (productFiltered) {
        productFiltered.cant = item.cant;
      }
    });
  }

  setOpenCart(isOpen: any) {
    this.isCartOpen = isOpen;
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextBanner();
    }, 8000);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextBanner() {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  goToBanner(index: number) {
    this.currentBannerIndex = index;
    this.stopCarousel();
    this.startCarousel();
  }

  setRecommendedProducts() {
    const shuffled = [...this.products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.recommendedProducts = shuffled.slice(0, 5);
  }

  goTo() {
    this.route.navigate(['/products']);
  }

  goToOrder(orderId: number) {
    this.route.navigate(['/orders', orderId]);
  }

  getOrderProgress(status: any): number {
    console.log(status)
    const statusLower = status.name.toLowerCase();
    if (['pendiente', 'pending', 'confirmed'].includes(statusLower)) {
      return 1;
    } else if (['en proceso', 'processing', 'preparing'].includes(statusLower)) {
      return 2;
    } else if (['en camino', 'shipped', 'delivered'].includes(statusLower)) {
      return 3;
    } else if (['entregando', 'shipped', 'delivered'].includes(statusLower)) {
      return 4;
    } else if (['finalizado', 'shipped', 'delivered'].includes(statusLower)) {
      return 5;
    }
    return 1; // Default to 1
  }
}
