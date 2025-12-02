import { Component, Input, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-customer-growth-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, SkeletonModule],
    templateUrl: './customer-growth-chart.component.html',
    styleUrls: ['./customer-growth-chart.component.scss']
})
export class CustomerGrowthChartComponent implements OnChanges {
    @Input() data: any;
    @Input() loading: boolean = false;

    chartData: any;
    chartOptions: any;
    platformId = inject(PLATFORM_ID);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) {
            this.initChart();
        }
    }

    initChart() {
        if (!isPlatformBrowser(this.platformId)) return;

        const textColor = '#e4e4e7'; // Zinc-200
        const textColorSecondary = '#a1a1aa'; // Zinc-400
        const surfaceBorder = '#3f3f46'; // Zinc-700

        this.chartData = {
            labels: this.data.data.map((d: any) => new Date(d.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Total Clientes',
                    data: this.data.data.map((d: any) => d.totalCustomers),
                    fill: true,
                    borderColor: '#F59E0B', // Amber-500
                    tension: 0.4,
                    backgroundColor: 'rgba(245, 159, 11, 1)',
                    pointBackgroundColor: '#F59E0B',
                    pointBorderColor: '#F59E0B',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#F59E0B'
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    backgroundColor: '#27272a',
                    titleColor: '#fff',
                    bodyColor: '#e4e4e7',
                    borderColor: '#3f3f46',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
}
