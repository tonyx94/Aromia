import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { AromiaHeaderComponent } from 'src/app/components/aromia-header/aromia-header.component';
import { AromiaApi } from 'src/app/services/request';
import { ENDPOINTS } from 'src/environments/endpoints';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonContent, AromiaHeaderComponent],
})
export class HomePage implements OnInit {
  constructor(private api: AromiaApi, private route: Router) {}

  ngOnInit() {
  
  }

  goTo() {
    this.route.navigate(['/products']);
  }
}
