import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
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

@Component({
  selector: 'app-dashboard',
  imports: [AromiaFacturadosStatsComponent, AromiaClientsStatsComponent, AromiaResumeComponent, FloatLabel, ButtonModule, DatePicker, CardModule, ChartModule, FormsModule, CommonModule, AromiaEarningsCotizacionComponent, AromiaEarningsSellerComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  rangeDates!: Date[];
 
  datesSelected!: any;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.rangeDates = [
      new Date(`${moment().year()}-01-01 00:00:00`),
      new Date(`${moment().year()}-12-30 00:00:00`),
    ];

    this.getData()
  }

  getData() {
    if(!this.rangeDates) {
      return
    }  

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

 
    const data = {
      startDate: formatDate(this.rangeDates[0]),
      endDate: formatDate(this.rangeDates[1])
    };

    this.datesSelected = data
  }

}
