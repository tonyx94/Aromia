import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ApiAromia } from '../../../../services/api.service';
import { ENDPOINTS } from '../../../../../environments/endpoints';
import { FloatLabel } from "primeng/floatlabel";
import { CheckboxModule } from 'primeng/checkbox';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

export interface IProduct {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
  is_active?: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule,
    Dialog,
    ButtonModule,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUpload,
    DropdownModule,
    Tag,
    FormsModule,
    InputTextModule,
    FormsModule,
    InputNumber,
    IconFieldModule,
    InputIconModule,
    FloatLabel,
    ReactiveFormsModule,
    CheckboxModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productDialog: boolean = false;

  products!: IProduct[];
  product!: IProduct;
  selectedProducts!: IProduct[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  productForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private api: ApiAromia,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock_quantity: [0, [Validators.min(0)]],
      min_stock_level: [0, [Validators.min(0)]],
      image_url: [''],
      is_active: [true],
      created_at: [null],
      updated_at: [null],
      categoryId: [null],
    });
  }

  exportCSV(ev: any) {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.getProductsList();
  }

  getProductsList() {
    this.api.get(ENDPOINTS.PRODUCTS.GET_ALL).subscribe({
      next: (response) => {
        console.log('GET ALL Products ', response)
        this.products = response;
        this.cd.markForCheck();
      }
    })

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' },
    ];

    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  openNew() {

    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: IProduct) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Estas seguro de querer eliminar este producto?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Eliminar',
      },
      accept: () => {
        this.products = this.products.filter(
          (val) => !this.selectedProducts?.includes(val),
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: IProduct) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: any) {
    if (status === 0) {
      return 'danger';
    }
    else if (status > 0 && status <= 20) {
      return 'warning';
    }
    else {
      return 'success';
    }
  }

  saveProduct() {
    this.submitted = true;

    if (this.productForm.valid) {
      console.log('Producto guardado:', this.productForm.value);
      this.api.post(ENDPOINTS.PRODUCTS.CREATE, this.productForm.value).subscribe({
        next: (response) => {
          console.log(response)
          this.getProductsList()
        }
      })

    } else {
      this.productForm.markAllAsTouched();

      const invalidFields = [];
      const controls = this.productForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          let fieldName = name;
          switch (name) {
            case 'name': fieldName = 'Nombre'; break;
            case 'price': fieldName = 'Precio'; break;
            case 'stock_quantity': fieldName = 'Cantidad'; break;
            // Add others if strictly required
          }
          if (controls[name].errors?.['required']) { // check if it's actually required
            invalidFields.push(fieldName);
          }
        }
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Campos requeridos',
        detail: `Por favor completa: ${invalidFields.join(', ')}`,
        life: 3000
      });
    }
  }



  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  onStatusFilterChange(status: 'all' | 'active' | 'inactive') {
    this.statusFilter = status;
    this.dt.filter(status === 'all' ? null : (status === 'active'), 'is_active', 'equals');
  }

  toggleStatus(product: IProduct) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas ${product.is_active ? 'desactivar' : 'activar'} este producto?`,
      header: 'Confirmar cambio de estado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const newStatus = !product.is_active;
        // Optimistic update
        product.is_active = newStatus;

        this.api.patch(`${ENDPOINTS.PRODUCTS.GET_ALL}/${product.id}`, { is_active: newStatus }).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: `Producto ${newStatus ? 'activado' : 'desactivado'} correctamente`,
              life: 3000,
            });
          },
          error: (err) => {
            // Revert
            product.is_active = !newStatus;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el estado',
              life: 3000,
            });
          }
        });
      }
    });
  }
}
