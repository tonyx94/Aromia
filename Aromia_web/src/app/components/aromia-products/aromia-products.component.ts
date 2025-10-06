import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ApiAromia} from '../../services/api.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'aromia-products',
  imports: [ButtonModule, AutoCompleteModule, FormsModule],
  standalone: true,
  templateUrl: './aromia-products.component.html',
  styleUrl: './aromia-products.component.scss',
})
export class AromiaProductsComponent implements OnInit {
  @Output() ready = new EventEmitter<boolean>();

  private api = inject(ApiAromia);
  private messageService = inject(MessageService);

  products!: { name: string }[];

  product_name: string = '';
  selectedProduct: any;
  filteredProducts: any[] = [];

  isLoading: boolean = false
  errorMessage!: string

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true
    // this.api.products.getProducts().subscribe({
    //   next: (response) => {
    //     this.isLoading = false
    //     this.products = response;
    //   },
    //   error: (e) => {
    //     this.isLoading = false
    //     this.message(e.error.message, 'error');
    //   },
    // });
  }

  addProduct() {
    this.errorMessage = ""
    this.isLoading = true
    // this.api.products.createProduct({ name: this.product_name }).subscribe({
    //   next: (response) => {
    //     this.isLoading = false
    //     console.log(response);
    //     this.product_name = '';
    //     this.getProducts();
    //     this.message('Se agrego correctamente el producto', 'success');
    //     this.ready.emit(true);
    //   },
    //   error: (e) => {
    //     this.isLoading = false
    //     this.errorMessage = e.error.message
    //     console.log(e.error)
    //     this.message(e.error.message, 'error');
    //   },
    // });
  }

  filterProducts(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.products as any[]).length; i++) {
      let country = (this.products as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredProducts = filtered;
  }

  message(
    message: string,
    status: 'error' | 'success' | 'info' | 'warning',
    title?: string,
  ) {
    const summary =
      status == 'error'
        ? 'Algo salió mal'
        : status == 'success'
          ? 'Operación exitosa!'
          : status == 'warning'
            ? 'Cuidado con esto'
            : status == 'info'
              ? 'Ten presente lo siguiente'
              : '';

    this.messageService.add({
      severity: status,
      summary: title || summary.toLocaleUpperCase(),
      text: message,
      detail: message,
      life: 5000
    });
  }
}
