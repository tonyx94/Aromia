import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAromia } from '../../../../services/api.service';
import { ENDPOINTS } from '../../../../../environments/endpoints';
import { Customer } from '../../../../interfaces/order.interface';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  clients$!: Observable<Customer[]>;
  filteredClients$!: Observable<Customer[]>;
  selectedClient: Customer | null = null;
  loading = true;
  error: string | null = null;

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm = '';

  constructor(private api: ApiAromia) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = null;

    this.clients$ = this.api.get<Customer[]>(ENDPOINTS.CLIENTS.GET_ALL).pipe(
      map((clients) => {
        console.log('Clients loaded:', clients);
        this.loading = false;
        return clients;
      }),
      catchError((error) => {
        this.loading = false;
        this.error = 'Error al cargar los clientes. Por favor, intenta de nuevo.';
        console.error('Error loading clients:', error);
        return of([]);
      })
    );

    // Subscribe to trigger the API call immediately
    this.clients$.subscribe();

    this.filteredClients$ = combineLatest([
      this.clients$,
      this.searchTermSubject
    ]).pipe(
      map(([clients, searchTerm]) => {
        if (!searchTerm.trim()) {
          return clients;
        }

        const term = searchTerm.toLowerCase();
        return clients.filter(client =>
          client.firstName.toLowerCase().includes(term) ||
          client.lastName.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.toLowerCase().includes(term)
        );
      })
    );
  }

  selectClient(client: Customer) {
    this.selectedClient = client;
  }

  onSearchChange(term: string) {
    this.searchTermSubject.next(term);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchTermSubject.next('');
  }
}
