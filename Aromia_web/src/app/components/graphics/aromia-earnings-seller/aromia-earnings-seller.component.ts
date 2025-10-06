import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ApiAromia } from '../../../services/api.service';


@Component({
  selector: 'aromia-earnings-seller',
  imports: [ ButtonModule,  CardModule, ChartModule, FormsModule, CommonModule],
  standalone: true,
  templateUrl: './aromia-earnings-seller.component.html',
  styleUrl: './aromia-earnings-seller.component.scss'
})
export class AromiaEarningsSellerComponent implements OnInit {
@Input() rangeDates: any

 private api = inject(ApiAromia)
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
 

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getData()
  }

  getData() {
    if(!this.rangeDates) {
      return
    }  

    // this.api.graphics.getIngresosPorUsuario(this.rangeDates).subscribe({
    //   next: (response) => {
    //     this.setChart(response)
    //   },
    //   error: (e) => {
    //     console.log(e)
    //   }
    // })
  }

  setChart(data: any) {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.data = data;

            this.options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    tooltip: {
                        mode: 'index', 
                        intersect: false
                    },
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                    y: {
                        stacked: true,
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
            this.cd.markForCheck()
        }
    }
}
