import { Component, Input, OnChanges, SimpleChanges, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-orders-status-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, SkeletonModule],
    templateUrl: './orders-status-chart.component.html',
    styleUrls: ['./orders-status-chart.component.scss']
})
export class OrdersStatusChartComponent implements OnChanges {
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

        // Vibrant palette for status
        const vibrantColors = [
            '#ffa200ff', // Pink-400
            '#0e8fc2ff', // Violet-400
            '#8a3ce8ff', // Emerald-400
            '#37e646ff', // Blue-400
            '#ed5555ff', // Amber-400
            '#1f9672ff'  // Red-400
        ];

        this.chartData = {
            labels: this.data.data.map((d: any) => d.statusName),
            datasets: [
                {
                    data: this.data.data.map((d: any) => d.count),
                    backgroundColor: vibrantColors,
                    hoverBackgroundColor: vibrantColors,
                    borderColor: '#18181b', // Match background
                    borderWidth: 2
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true
                    },
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: '#27272a',
                    titleColor: '#fff',
                    bodyColor: '#e4e4e7',
                    borderColor: '#3f3f46',
                    borderWidth: 1
                }
            },
            cutout: '60%'
        };
    }
}
