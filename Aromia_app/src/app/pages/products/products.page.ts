import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonThumbnail, IonSearchbar, IonModal, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AromiaApi } from 'src/app/services/request';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/environments/endpoints';
import { AromiaHeaderComponent } from 'src/app/components/aromia-header/aromia-header.component';
import { Product } from 'src/app/models/products';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonModal, IonSearchbar, IonItem, IonList, IonContent, IonHeader, CommonModule, FormsModule, AromiaHeaderComponent, IonThumbnail, IonToolbar]
})
export class ProductsPage implements OnInit {

  constructor(private api: AromiaApi, private route: Router) {
    addIcons({closeOutline});
  }


  products: Product[] = [];
  productsFiltered: Product[] = [];
  productSelected!: Product;
  isProductDetailOpen: boolean = false;

  ngOnInit() {
    this.api.get<Product[]>(ENDPOINTS.PRODUCTS.GET_ALL).subscribe((products) => {
      console.log('Productos obtenidos:', products);
      this.products = products;
      this.productsFiltered = [...products];
    });
  }

  setOpenProductDetail(isOpen: boolean, product?: Product) {
    this.isProductDetailOpen = isOpen;
    if(isOpen && product) {
      this.productSelected = product;
    }
    
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.productsFiltered = this.products.filter((p) => p.name.toLowerCase().includes(query));
  }

}
