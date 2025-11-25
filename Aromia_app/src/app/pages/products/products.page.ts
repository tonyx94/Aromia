import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonThumbnail, IonSearchbar, IonModal, IonButtons, IonButton, IonIcon, IonBadge, IonFooter, ToastController } from '@ionic/angular/standalone';
<<<<<<< HEAD
import { AromiaApi } from 'src/app/services/request';
=======
>>>>>>> tony
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
<<<<<<< HEAD
import { closeOutline,addOutline, removeOutline } from 'ionicons/icons';
import { AromiaCartComponent } from '../../components/aromia-cart/aromia-cart.component';
=======
import { closeOutline, addOutline, removeOutline } from 'ionicons/icons';
import { ENDPOINTS } from '../../../environments/endpoints';
import { AromiaCartComponent } from '../../components/aromia-cart/aromia-cart.component';
import { AromiaHeaderComponent } from '../../components/aromia-header/aromia-header.component';
import { Product } from '../../models/products';
import { AromiaApi } from '../../services/request';
>>>>>>> tony
import { StorageService, StorageKey } from '../../services/storage.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonFooter, IonBadge, IonIcon, IonButton, IonModal, IonSearchbar, IonItem, IonList, IonContent, IonHeader, CommonModule, FormsModule, AromiaHeaderComponent, IonThumbnail, IonToolbar, IonButtons, AromiaCartComponent]
})
export class ProductsPage implements OnInit {

<<<<<<< HEAD
  constructor(private api: AromiaApi,private local: StorageService, private toastController: ToastController, private route: Router) {
=======
  constructor(private api: AromiaApi, private local: StorageService, private toastController: ToastController, private route: Router) {
>>>>>>> tony
    addIcons({closeOutline,removeOutline,addOutline});
  }

  products: Product[] = [];
  productsFiltered: Product[] = [];
  productSelected!: Product;
  isProductDetailOpen: boolean = false;
  isCartOpen: boolean = false;

  isCartOpen: boolean = false;


  //AR-48
  ngOnInit() {
    this.api.get<Product[]>(ENDPOINTS.PRODUCTS.GET_ALL).subscribe((products) => {
      products.forEach((product: Product) => product.cant = 0);
      console.log('Productos obtenidos:', products);
<<<<<<< HEAD
      this.products = [...products];
      this.productsFiltered = [...products];

       this.local.get<Product[]>(StorageKey.Cart).then((c) => {
        if(c) {
          this.setCartInProducts(c)
        }
      })
=======

      this.products = [...products];
      this.productsFiltered = [...products];

      this.local.get<Product[]>(StorageKey.Cart).then((c) => {
        if(c) {
          this.setCartInProducts(c)
        }
      })
    });
  }

  //AR-48
  setCartInProducts(c: Product[]) {
    c.forEach(item => {
      const product = this.products.find(p => p.id === item.id);
      const productFiltered = this.productsFiltered.find(p => p.id === item.id);
      if (product) {
        product.cant = item.cant;
      }
      if (productFiltered) {
        productFiltered.cant = item.cant;
      }
>>>>>>> tony
    });
  }

  setCartInProducts(c: Product[]) {
    c.forEach(item => {
      const product = this.products.find((p:Product) => p.id === item.id);
      const productFiltered = this.productsFiltered.find((p: Product) => p.id === item.id);
      if (product) {
        product.cant = item.cant;
      }
      if (productFiltered) {
        productFiltered.cant = item.cant;
      }
    });
  }

  setOpenProductDetail(isOpen: boolean, product?: Product) {
    this.isProductDetailOpen = isOpen;
    if(isOpen && product) {
      this.productSelected = product;
    }
    
  }

  setOpenCart(isOpen: any) {
<<<<<<< HEAD
    this.isCartOpen = isOpen;
  }
=======
    this.isCartOpen = isOpen;
  }
>>>>>>> tony

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.productsFiltered = this.products.filter((p: Product) => p.name.toLowerCase().includes(query));
  }
//AR-47
 modifyCant(product: Product, type: 'add' | 'remove') {
    if(type == 'add') {
      if(product.cant < product.stock_quantity) {
         product.cant = product.cant + 1
      }
    }

<<<<<<< HEAD
=======
  //AR-47
 modifyCant(product: Product, type: 'add' | 'remove') {
    if(type == 'add') {
      if(product.cant < product.stock_quantity) {
         product.cant = product.cant + 1
      }
    }

>>>>>>> tony
    if(type == 'remove') {
      if(product.cant > 0) {
        product.cant = product.cant - 1
      }
    }

<<<<<<< HEAD
    this.products.find((p:Product) => p.id == product.id)?.cant == product.cant
    this.productsFiltered.find((p:Product) => p.id == product.id)?.cant == product.cant
=======
    this.products.find((p) => p.id == product.id)?.cant == product.cant
    this.productsFiltered.find((p) => p.id == product.id)?.cant == product.cant
>>>>>>> tony

    console.log(this.productsFiltered)
    this.addCart()
 }

 //AR-47
 addCart() {
  const cartProducts = [...this.products.filter(p => p.cant > 0)]
<<<<<<< HEAD
  this.local.set<Product[]>(StorageKey.Cart, cartProducts).then(() => {
=======
  this.local.set(StorageKey.Cart, cartProducts).then(() => {
>>>>>>> tony
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
<<<<<<< HEAD
  }
=======
  }

>>>>>>> tony
}
