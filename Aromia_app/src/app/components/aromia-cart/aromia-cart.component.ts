import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from '../../models/products';
import { StorageService, StorageKey } from '../../services/storage.service';
import { IonList, IonItem, IonThumbnail, IonBadge, IonFooter, IonContent, IonButton, IonIcon, IonText } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AromiaApi } from 'src/app/services/request';
import { ENDPOINTS } from 'src/environments/endpoints';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';



@Component({
  selector: 'aromia-cart',
  standalone: true,
  imports: [IonText, IonIcon, IonFooter, IonContent, IonButton, IonBadge, IonItem, IonList, IonThumbnail, IonBadge, CommonModule, FormsModule],
  templateUrl: './aromia-cart.component.html',
  styleUrls: ['./aromia-cart.component.scss'],
})
export class AromiaCartComponent implements OnInit, AfterViewInit {
  @Output() ready = new EventEmitter<boolean>()

  cart: Product[] = [];
  activeProducts: Product[] = [];
  discountAmount: number = 0;

  constructor(private local: StorageService, private route: Router, private api: AromiaApi) {
    addIcons({ trashOutline });
  }

  ngAfterViewInit(): void {
    this.validateCart();
  }

  validateCart() {
    this.local.get<Product[]>(StorageKey.Cart).then((c) => {
      if (c) {
        this.cart = c;
        this.checkProductsAvailability();
      }
    });
  }

  checkProductsAvailability() {
    this.api.get<Product[]>(ENDPOINTS.PRODUCTS.GET_ACTIVE).subscribe((activeProducts) => {
      this.activeProducts = activeProducts;
    });
  }

  isAvailable(product: Product): boolean {
    if (this.activeProducts.length === 0) return true;
    return this.activeProducts.some(p => p.id === product.id);
  }

  get hasUnavailableProducts(): boolean {
    if (this.activeProducts.length === 0) return false;
    return this.cart.some(p => !this.isAvailable(p));
  }

  removeProduct(product: Product) {
    this.cart = this.cart.filter(p => p.id !== product.id);
    this.local.set(StorageKey.Cart, this.cart);
  }


  ngOnInit() { }

  goToCheckout() {
    this.ready.emit(true)
    setTimeout(() => {
      this.route.navigate(['checkout'])
    }, 100);

  }

  getSubtotal(): number {
    return this.cart.reduce((sum, p) => {
      const price = p.price;
      return sum + price * p.cant;
    }, 0);
  }

  getTaxes(): number {
    const subtotal = this.getSubtotal();
    return subtotal * 0.13; // 13% de IVA
  }

  getDiscount(): number {
    return this.discountAmount;
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const taxes = this.getTaxes();
    const discount = this.getDiscount();
    return subtotal + taxes - discount;
  }



}
