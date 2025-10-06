import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@primeng/themes';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private config: PrimeNG) {}
  // ngOnInit() {
  //   // Solo ejecuta en el navegador, no en el servidor
  //   if (typeof window !== 'undefined') {
  //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //     console.log(prefersDark)
  //     if (prefersDark) {
  //       document.body.classList.add('my-app-light');
  //     } else {
  //       document.body.classList.remove('my-app-dark');
  //     }
  //   }
  // }

  ngOnInit() {
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Elimina ambas clases antes de aplicar
    document.body.classList.remove('my-app-dark', 'my-app-light');
    document.body.classList.add(prefersDark ? 'my-app-dark' : 'my-app-light');
  }
}
}