import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import moment from 'moment';
import { ChartModule } from 'primeng/chart';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ApiAromia } from '../../../services/api.service';

@Component({
  selector: 'aromia-clients-stats',
  imports: [ChartModule, CommonModule, FormsModule, TagModule],
  standalone: true,
  templateUrl: './aromia-clients-stats.component.html',
  styleUrl: './aromia-clients-stats.component.scss',
})
export class AromiaClientsStatsComponent implements OnInit {
  private api = inject(ApiAromia);
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  rangeDates!: Date[];
  stats!: any

  constructor(private cd: ChangeDetectorRef) {}

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
      endDate: formatDate(this.rangeDates[1]),
    };

    // this.api.graphics.getClientsStats(data).subscribe({
    //   next: (response) => {
    //     console.log('Clients Stats', response);
    //     this.stats = response
    //     this.setChart(response); 
    //   },
    //   error: (e) => {
    //     console.log(e);
    //   },
    // });
  }

  setChart(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color',
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color',
      );

      this.data = data.detalle

      this.options = {
        label: false,
        responsive: false,
        maintainAspectRatio: false,
        width: 100,
        height: 100,
        plugins: {
          legend: {
            display: false,
     

          },
        },
        scales: {
          x: {
            display: false,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          y: {
            display: false,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
