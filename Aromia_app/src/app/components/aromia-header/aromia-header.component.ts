import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon, IonMenuButton, IonAvatar, IonChip, IonLabel, IonBadge } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { cartOutline, menu } from 'ionicons/icons';
import { Product } from '../../models/products';
import { StorageKey, StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'aromia-header',
  standalone: true,
  imports: [IonBadge, IonAvatar, IonIcon, IonMenuButton, IonButton],
  templateUrl: './aromia-header.component.html',
  styleUrls: ['./aromia-header.component.scss'],
})
export class AromiaHeaderComponent implements OnInit {
  @Input() products: Product[] = []
  @Output() openCart = new EventEmitter<boolean>();

  constructor(private local: StorageService) { 
    addIcons({menu,cartOutline});
  }
 

  ngOnInit() {}

  //AR-47
  getProductsInCart(): number {
    var sumCantOfEveryProduct = 0
    const productsInCart = this.products.filter(p => p.cant > 0)
    productsInCart.forEach(p => sumCantOfEveryProduct = sumCantOfEveryProduct + p.cant)
    return sumCantOfEveryProduct
  }
  //AR-47
  openCartComponent(is: boolean) {
    this.openCart.emit(is)
  }
}
