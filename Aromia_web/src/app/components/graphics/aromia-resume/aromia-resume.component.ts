import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MeterGroup } from 'primeng/metergroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import moment from 'moment';
import { ApiAromia } from '../../../services/api.service';

@Component({
  selector: 'aromia-resume',
  imports: [CardModule, MeterGroup, CommonModule, FormsModule, ButtonModule],
  standalone: true,
  templateUrl: './aromia-resume.component.html',
  styleUrl: './aromia-resume.component.scss'
})
export class AromiaResumeComponent implements OnInit {
 private api = inject(ApiAromia)
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  rangeDates!: Date[];
  
  response!: {
    total: any,
    percentage: any, 
    values:  { label: any, color1: any, color2: any, value: any, icon: any, amount: any } [] 
  }

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
  
      // this.api.graphics.getResume(data).subscribe({
      //   next: (response) => {
      //     this.setChart(response) 
      //   },
      //   error: (e) => {
      //     console.log(e)
      //   }
      // })
    }

    setChart(data: any) {
        this.response = data
    }
   
}
