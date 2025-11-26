import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonChip, IonFooter } from '@ionic/angular/standalone';
import { AromiaHeaderComponent } from '../../components/aromia-header/aromia-header.component';
import { AromiaApi } from '../../services/request';
import { ENDPOINTS } from 'src/environments/endpoints';
import { Product } from 'src/app/models/products';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFooter, IonChip, IonLabel, IonItem, IonButton, IonHeader, IonContent, AromiaHeaderComponent],
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

  constructor(private api: AromiaApi, private route: Router) { }

  ngOnInit() {
    this.getProducts();
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
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

  getProducts() {
    this.api.get(ENDPOINTS.PRODUCTS.GET_ALL).subscribe({
      next: (products) => {
        this.products = products;
        this.setRecommendedProducts();
      },
      error: (e) => {
        console.log(e)
      }
    })
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
}
