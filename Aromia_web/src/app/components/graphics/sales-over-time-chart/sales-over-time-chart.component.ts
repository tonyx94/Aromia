import { Component, Input, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-sales-over-time-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, SkeletonModule],
    templateUrl: './sales-over-time-chart.component.html',
    styleUrls: ['./sales-over-time-chart.component.scss']
})
export class SalesOverTimeChartComponent implements OnChanges {
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

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = '#e4e4e7'; // Zinc-200
        const textColorSecondary = '#a1a1aa'; // Zinc-400
        const surfaceBorder = '#3f3f46'; // Zinc-700

        this.chartData = {
            labels: this.data.data.map((d: any) => new Date(d.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Ventas',
                    data: this.data.data.map((d: any) => d.total),
                    fill: true,
                    borderColor: '#8B5CF6', // Violet-500
                    tension: 0.4,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    pointBackgroundColor: '#8B5CF6',
                    pointBorderColor: '#8B5CF6',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#8B5CF6'
                },
                {
                    label: 'Órdenes',
                    data: this.data.data.map((d: any) => d.orderCount),
                    fill: false,
                    borderColor: '#06B6D4', // Cyan-500
                    tension: 0.4,
                    yAxisID: 'y1',
                    pointBackgroundColor: '#06B6D4',
                    pointBorderColor: '#06B6D4',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#06B6D4'
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
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#27272a', // Zinc-800
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
                    type: 'linear',
                    display: true,
                    position: 'left',
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
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        };
    }
}
