import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonButton,
    IonButtons,
    ModalController
} from '@ionic/angular/standalone';
import { Address } from '../../../../models/adress';
import { addIcons } from 'ionicons';
import { heart, location, close } from 'ionicons/icons';

@Component({
    selector: 'app-favorites-modal',
    templateUrl: './favorites-modal.component.html',
    styleUrls: ['./favorites-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonIcon,
        IonBadge,
        IonButton,
        IonButtons
    ]
})
export class FavoritesModalComponent {
    @Input() addresses: Address[] = [];

    constructor(private modalController: ModalController) {
        addIcons({ heart, location, close });
    }

    selectAddress(address: Address) {
        this.modalController.dismiss({
            selectedAddress: address
        });
    }

    close() {
        this.modalController.dismiss();
    }
}
