import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonMenuButton, IonAvatar, IonChip, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'aromia-header',
  standalone: true,
  imports: [IonAvatar, IonIcon, IonMenuButton],
  templateUrl: './aromia-header.component.html',
  styleUrls: ['./aromia-header.component.scss'],
})
export class AromiaHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
