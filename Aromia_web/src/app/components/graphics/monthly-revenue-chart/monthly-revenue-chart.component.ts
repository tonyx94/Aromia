import { Component, Input, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-monthly-revenue-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, SkeletonModule],
    templateUrl: './monthly-revenue-chart.component.html',
    styleUrls: ['./monthly-revenue-chart.component.scss']
})
export class MonthlyRevenueChartComponent implements OnChanges {
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
            labels: this.data.data.map((d: any) => d.month),
            datasets: [
                {
                    label: 'Ingresos Mensuales',
                    backgroundColor: '#068ed2ff', // Emerald-500
                    borderColor: '#068ed2ff',
                    data: this.data.data.map((d: any) => d.revenue),
                    borderRadius: 4
                }
            ]
        };

        this.chartOptions = {
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
                    borderWidth: 1,
                    callbacks: {
                        label: function (context: any) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
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
                        color: textColorSecondary,
                        callback: function (value: any) {
                            return '₡' + value;
                        }
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
