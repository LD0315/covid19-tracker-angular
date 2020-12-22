import { GlobalDataSummary } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[];

  constructor(private dataService : DataServiceService) { }

  ngOnInit(): void {

    this.dataService.getGlobalData()
    .subscribe(
      {
        next : (result) => {
          console.log(result);
          this.globalData = result;
          result.forEach(cs => {
            if(!Number.isNaN(cs.confirmed)) {
              this.totalActive+=cs.active
              this.totalConfirmed+=cs.confirmed
              this.totalDeaths+=cs.confirmed
              this.totalRecovered+=cs.recovered
            }
          })
        }
      }
    )
  }

}
