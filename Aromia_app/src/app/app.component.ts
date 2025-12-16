import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locateOutline, location } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    // Register all icons used in the app
    addIcons({
      'locate-outline': locateOutline,
      'location': location
    });

    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Configure status bar
    try {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.show();
    } catch (error) {
      console.log('StatusBar not available:', error);
    }
  }
}
