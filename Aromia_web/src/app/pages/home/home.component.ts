import { Component, inject, OnInit } from '@angular/core';
import { AromiaSidebarComponent } from '../../components/aromia-sidebar/aromia-sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StorageKey, StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  imports: [AromiaSidebarComponent, RouterModule, ButtonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private local = inject(StorageService);
  private route = inject(Router);

  sidebarVisible = false;

  ngOnInit(): void {
    // this.local.get(StorageKey.User)
    //   .then((user) => {
    //     if (!user) {
    //       this.route.navigateByUrl('/login');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error al obtener usuario:', error);
    //     this.route.navigateByUrl('/login');
    //   });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}