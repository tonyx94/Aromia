import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon, IonMenuButton, IonAvatar, IonChip, IonLabel, IonBadge, IonModal, IonHeader, IonToolbar, IonButtons, IonContent, IonFooter } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { cartOutline, menu } from 'ionicons/icons';
import { Product } from '../../models/products';
import { StorageKey, StorageService } from 'src/app/services/storage.service';
import { ProfilePage } from 'src/app/pages/profile/profile.page';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'aromia-header',
  standalone: true,
  imports: [IonContent, IonButtons, IonToolbar, IonHeader, IonModal, IonAvatar, IonIcon, IonMenuButton, IonButton, IonBadge, ProfilePage],
  templateUrl: './aromia-header.component.html',
  styleUrls: ['./aromia-header.component.scss'],
})
export class AromiaHeaderComponent implements OnInit {
  @Input() products: Product[] = []
  @Output() openCart = new EventEmitter<boolean>();

  isProfileOpen: boolean = false
  user?: Customer
  constructor(private local: StorageService) {
    addIcons({ menu, cartOutline });
  }

  ngOnInit() {
    this.getUserData()
  }

  getUserData() {
    this.local.get<Customer>(StorageKey.User).then((user) => {
      if (user) this.user = user;
    })
  }

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

  openProfile(ev: boolean) {
    this.isProfileOpen = ev
  }

}
