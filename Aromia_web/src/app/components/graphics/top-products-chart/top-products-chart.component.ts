import { Component, Input, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-top-products-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, SkeletonModule],
    templateUrl: './top-products-chart.component.html',
    styleUrls: ['./top-products-chart.component.scss']
})
export class TopProductsChartComponent implements OnChanges {
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
            labels: this.data.products.map((p: any) => p.productName),
            datasets: [
                {
                    label: 'Unidades Vendidas',
                    backgroundColor: '#08ae9bff',
                    borderColor: '#08ae9bff',
                    data: this.data.products.map((p: any) => p.quantitySold),
                    borderRadius: 4
                }
            ]
        };

        this.chartOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
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
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
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
