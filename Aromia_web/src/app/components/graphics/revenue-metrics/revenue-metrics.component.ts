import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-revenue-metrics',
    standalone: true,
    imports: [CommonModule, CardModule, SkeletonModule],
    templateUrl: './revenue-metrics.component.html',
    styleUrls: ['./revenue-metrics.component.scss']
})
export class RevenueMetricsComponent implements OnChanges {
    @Input() data: any;
    @Input() loading: boolean = false;

    metrics: any[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) {
            this.processData();
        }
    }

    processData() {
        this.metrics = [
            {
                title: 'Ingresos Totales',
                value: this.formatCurrency(this.data.totalRevenue),
                icon: 'pi pi-dollar',
                color: 'text-green-500',
                bgStyle: { 'background-color': 'rgba(34, 197, 94, 0.15)' }, // green-500 with opacity
                growth: this.data.revenueGrowth
            },
            {
                title: 'Órdenes Totales',
                value: this.data.totalOrders,
                icon: 'pi pi-shopping-cart',
                color: 'text-blue-500',
                bgStyle: { 'background-color': 'rgba(59, 130, 246, 0.15)' } // blue-500 with opacity
            },
            {
                title: 'Ticket Promedio',
                value: this.formatCurrency(this.data.averageOrderValue),
                icon: 'pi pi-chart-line',
                color: 'text-purple-500',
                bgStyle: { 'background-color': 'rgba(168, 85, 247, 0.15)' } // purple-500 with opacity
            },
            {
                title: 'Clientes Activos',
                value: this.data.totalCustomers,
                icon: 'pi pi-users',
                color: 'text-orange-500',
                bgStyle: { 'background-color': 'rgba(249, 115, 22, 0.15)' } // orange-500 with opacity
            }
        ];
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(value);
    }
}
