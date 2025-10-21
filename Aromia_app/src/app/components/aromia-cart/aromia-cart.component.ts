import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from '../../models/products';
import { StorageService, StorageKey } from '../../services/storage.service';
import { IonList, IonItem, IonThumbnail, IonBadge } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'aromia-cart',
  standalone: true,
  imports: [IonBadge, IonItem, IonList, IonThumbnail, IonBadge, CommonModule, FormsModule],
  templateUrl: './aromia-cart.component.html',
  styleUrls: ['./aromia-cart.component.scss'],
})
export class AromiaCartComponent  implements OnInit, AfterViewInit {

  cart: Product[] = [];
  discountAmount: number = 0; 

  constructor(private local: StorageService) { }

  ngAfterViewInit(): void {
    this.local.get<Product[]>(StorageKey.Cart).then((c) => {
      if(c) {
        this.cart = c
        console.log("Products in Cart: ", c)
      }
    })
  }


  ngOnInit() {}


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
