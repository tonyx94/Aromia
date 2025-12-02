import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageKey, StorageService } from '../../services/storage.service';
import { IUser } from '../../models/user';
import { ApiAromia } from '../../services/api.service';

@Component({
  selector: 'aromia-sidebar',
  imports: [ButtonModule, AvatarModule, AvatarGroupModule, DividerModule, TooltipModule, PopoverModule, ToggleButtonModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './aromia-sidebar.component.html',
  styleUrl: './aromia-sidebar.component.scss'
})
export class AromiaSidebarComponent implements OnInit {
  private route = inject(Router)
  private api = inject(ApiAromia)
  private local = inject(StorageService)

  checked!: any;

  buttons = [
    { name: "Dashboard", reference: "dashboard", navigate: 'dashboard', icon: 'pi pi-th-large', selected: false, active: true },
    { name: "Pedidos", reference: "pedidos", navigate: 'pedidos', icon: 'pi pi-file-edit', selected: false, active: true },
    { name: "Productos", reference: "productos", navigate: 'products', icon: 'pi pi-apple', selected: false, active: true },
    { name: "Clientes", reference: "clientes", navigate: 'clients', icon: 'pi pi-users', selected: false, active: true },
    { name: "Usuarios", reference: "usuarios", navigate: 'users', icon: 'pi pi-user', selected: false, active: true },

  ]


  user!: IUser

  ngOnInit(): void {
    this.local.get<IUser>(StorageKey.User).then((u) => {
      if (!u) return
      this.user = u

      // this.user.rol.map((b) => b.toLowerCase())
      // this.activateButtons()
    })


  }

  activateButtons() {
    this.buttons.map((b) =>
      this.user.rol.includes(b.name) ? b.active = true : b.active = false
    )

    const buttons = [...this.buttons]

    const btnActive = buttons.filter((b) => b.active)

    if (btnActive[0]) {
      this.navigate(btnActive[0]);
    }
  }

  toggleDarkMode(ev: any) {
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('my-app-dark');
    }
  }

  navigate(button: any) {
    this.buttons.forEach((b) => b == button ? b.selected = true : b.selected = false)
    this.local.set(StorageKey.CurrentModule, button.navigate)
    this.route.navigateByUrl(`/home/${button.navigate}`)
  }

  getStatusButton(status: boolean) {
    return status ? undefined : 'text'
  }

  getColorForUser(user: any): string {
    const str = user.trim();
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 90; // menor saturación = más suave
    const lightness = 60; // menos luz = más oscuro

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getTextColorFromHSL(hslColor: string): string {
    // Convertir HSL a RGB para evaluar brillo y contrastar
    const hsl = hslColor.match(/\d+/g);
    if (!hsl) return '#fff';

    const h = parseInt(hsl[0], 10) / 360;
    const s = parseInt(hsl[1], 10) / 100;
    const l = parseInt(hsl[2], 10) / 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };

    const r = f(0);
    const g = f(8);
    const b = f(4);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? '#000' : '#fff'; // texto negro o blanco
  }
  getLetterName(name: string) {
    return name.split(' ')[0].split('')[0].replace('null', ''); //+name.split(" ")[1].split("")[0]
  }

  signup() {
    this.local.removeAll().then(() => {
      this.route.navigate(['login'])
    })
  }
}
