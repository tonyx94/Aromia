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
//AR-47
 modifyCant(product: Product, type: 'add' | 'remove') {
    if(type == 'add') {
      if(product.cant < product.stock_quantity) {
         product.cant = product.cant + 1
      }
    }

    if(type == 'remove') {
      if(product.cant > 0) {
        product.cant = product.cant - 1
      }
    }

    this.products.find((p) => p.id == product.id)?.cant == product.cant
    this.productsFiltered.find((p) => p.id == product.id)?.cant == product.cant

    console.log(this.productsFiltered)
    this.addCart()
 }

 //AR-47
 addCart() {
  const cartProducts = [...this.products.filter(p => p.cant > 0)]
  this.local.set(StorageKey.Cart, cartProducts).then(() => {
    this.setMessage("Productos agregados al carrito", 'success')
  })
 }

//AR-47
 async setMessage(message: string, color: 'success'|'danger'|'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color
    });

    await toast.present();
  }
}
