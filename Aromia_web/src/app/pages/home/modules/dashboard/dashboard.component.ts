import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { AromiaEarningsCotizacionComponent } from '../../../../components/graphics/aromia-earnings-cotizacion/aromia-earnings-cotizacion.component';
import { AromiaEarningsSellerComponent } from '../../../../components/graphics/aromia-earnings-seller/aromia-earnings-seller.component';
import { AromiaResumeComponent } from '../../../../components/graphics/aromia-resume/aromia-resume.component';
import { AromiaClientsStatsComponent } from '../../../../components/graphics/aromia-clients-stats/aromia-clients-stats.component';
import moment from 'moment';
import { AromiaFacturadosStatsComponent } from '../../../../components/graphics/aromia-facturados-stats/aromia-facturados-stats.component';
import { GraphicsService } from '../../../../services/apis/graphics.service';
import { RevenueMetricsComponent } from '../../../../components/graphics/revenue-metrics/revenue-metrics.component';
import { SalesOverTimeChartComponent } from '../../../../components/graphics/sales-over-time-chart/sales-over-time-chart.component';
import { OrdersStatusChartComponent } from '../../../../components/graphics/orders-status-chart/orders-status-chart.component';
import { TopProductsChartComponent } from '../../../../components/graphics/top-products-chart/top-products-chart.component';
import { CustomerGrowthChartComponent } from '../../../../components/graphics/customer-growth-chart/customer-growth-chart.component';
import { MonthlyRevenueChartComponent } from '../../../../components/graphics/monthly-revenue-chart/monthly-revenue-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    FloatLabel,
    ButtonModule,
    DatePicker,
    CardModule,
    ChartModule,
    FormsModule,
    CommonModule,
    RevenueMetricsComponent,
    SalesOverTimeChartComponent,
    OrdersStatusChartComponent,
    TopProductsChartComponent,
    CustomerGrowthChartComponent,
    MonthlyRevenueChartComponent
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private graphicsService = inject(GraphicsService);

  rangeDates!: Date[];
  datesSelected!: any;

  // Data for charts
  revenueMetrics: any;
  salesOverTime: any;
  ordersByStatus: any;
  topProducts: any;
  customerGrowth: any;
  monthlyComparison: any;

  // Loading states
  loadingMetrics: boolean = false;
  loadingSales: boolean = false;
  loadingOrders: boolean = false;
  loadingProducts: boolean = false;
  loadingCustomers: boolean = false;
  loadingMonthly: boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.rangeDates = [
      new Date(`${moment().year()}-01-01 00:00:00`),
      new Date(`${moment().year()}-12-30 00:00:00`),
    ];

    this.getData();
  }

  getData() {
    if (!this.rangeDates) {
      return;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const data = {
      startDate: formatDate(this.rangeDates[0]),
      endDate: formatDate(this.rangeDates[1])
    };

    this.datesSelected = data;

    this.fetchAllStatistics(data);
  }

  fetchAllStatistics(data: any) {
    this.loadingMetrics = true;
    this.loadingSales = true;
    this.loadingOrders = true;
    this.loadingProducts = true;
    this.loadingCustomers = true;
    this.loadingMonthly = true;

    this.graphicsService.getRevenueMetrics(data).subscribe({
      next: (res) => {
        this.revenueMetrics = res;
        this.loadingMetrics = false;
      },
      error: (err) => {
        console.error('Error fetching revenue metrics', err);
        this.loadingMetrics = false;
      }
    });

    this.graphicsService.getSalesOverTime(data).subscribe({
      next: (res) => {
        this.salesOverTime = res;
        this.loadingSales = false;
      },
      error: (err) => {
        console.error('Error fetching sales over time', err);
        this.loadingSales = false;
      }
    });

    this.graphicsService.getOrdersByStatus(data).subscribe({
      next: (res) => {
        this.ordersByStatus = res;
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error('Error fetching orders by status', err);
        this.loadingOrders = false;
      }
    });

    this.graphicsService.getTopProducts(data).subscribe({
      next: (res) => {
        this.topProducts = res;
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Error fetching top products', err);
        this.loadingProducts = false;
      }
    });

    this.graphicsService.getCustomerGrowth(data).subscribe({
      next: (res) => {
        this.customerGrowth = res;
        this.loadingCustomers = false;
      },
      error: (err) => {
        console.error('Error fetching customer growth', err);
        this.loadingCustomers = false;
      }
    });

    this.graphicsService.getMonthlyComparison(data).subscribe({
      next: (res) => {
        this.monthlyComparison = res;
        this.loadingMonthly = false;
      },
      error: (err) => {
        console.error('Error fetching monthly comparison', err);
        this.loadingMonthly = false;
      }
    });
  }
}
