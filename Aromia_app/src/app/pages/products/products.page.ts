import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonThumbnail, IonSearchbar, IonModal, IonButtons, IonButton, IonIcon, IonBadge, IonFooter, ToastController } from '@ionic/angular/standalone';
import { AromiaApi } from 'src/app/services/request';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/environments/endpoints';
import { AromiaHeaderComponent } from 'src/app/components/aromia-header/aromia-header.component';
import { Product } from 'src/app/models/products';
import { addIcons } from 'ionicons';
import { closeOutline,addOutline, removeOutline } from 'ionicons/icons';
import { AromiaCartComponent } from '../../components/aromia-cart/aromia-cart.component';
import { StorageService, StorageKey } from '../../services/storage.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonFooter, IonBadge, IonIcon, IonButton, IonModal, IonSearchbar, IonItem, IonList, IonContent, IonHeader, CommonModule, FormsModule, AromiaHeaderComponent, IonThumbnail, IonToolbar, IonButtons, AromiaCartComponent]
})
export class ProductsPage implements OnInit {

  constructor(private api: AromiaApi,private local: StorageService, private toastController: ToastController, private route: Router) {
    addIcons({closeOutline,removeOutline,addOutline});
  }


  products: Product[] = [];
  productsFiltered: Product[] = [];
  productSelected!: Product;
  isProductDetailOpen: boolean = false;
  isCartOpen: boolean = false;

  ngOnInit() {
    this.api.get<Product[]>(ENDPOINTS.PRODUCTS.GET_ALL).subscribe((products) => {
      products.forEach((product: Product) => product.cant = 0);
      console.log('Productos obtenidos:', products);
      this.products = [...products];
      this.productsFiltered = [...products];

       this.local.get<Product[]>(StorageKey.Cart).then((c) => {
        if(c) {
          this.setCartInProducts(c)
        }
      })
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
    this.isCartOpen = isOpen;
  }

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

    if(type == 'remove') {
      if(product.cant > 0) {
        product.cant = product.cant - 1
      }
    }

    this.products.find((p:Product) => p.id == product.id)?.cant == product.cant
    this.productsFiltered.find((p:Product) => p.id == product.id)?.cant == product.cant

    console.log(this.productsFiltered)
    this.addCart()
 }

 //AR-47
 addCart() {
  const cartProducts = [...this.products.filter(p => p.cant > 0)]
  this.local.set<Product[]>(StorageKey.Cart, cartProducts).then(() => {
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
