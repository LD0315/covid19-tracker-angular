import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/Operators';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-04-2020.csv`;
  private dateWiseDataUrl =`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  constructor(private http : HttpClient) { }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl, { responseType : 'text' })
      .pipe(map(result => {
        let rows = result.split('\n'); // new line
        //console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);  // split with comma
        
        dates.splice(0, 4);
        //console.log('!!!!!!');
        //console.log(dates);
        rows.splice(0, 1);

        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/);
          let con = cols[1]; // country name
          cols.splice(0, 4);
          //console.log("9999999999999999999999999");
          //console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw : DateWiseData = {
              cases : +value ,
              country : con,
              date : new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw)
          })

        })
        console.log("**********************");
        console.log(mainData);

        return mainData;
      }))
  }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType : 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        // remove the header value from data
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);

          let cs = {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10],
          };
          let temp : GlobalDataSummary = raw[cs.country];
          // if there is object
          if(temp){
            temp.active = cs.active + temp.active
            temp.confirmed = cs.confirmed + temp.confirmed
            temp.deaths = cs.deaths + temp.deaths
            temp.recovered = cs.recovered + temp.recovered

            raw[cs.country] = temp;
            // no object
          }else{
            raw[cs.country] = cs;
          }
          
          // data.push()
          // console.log(cols);
        })
         // console.log(raw);
        return <GlobalDataSummary[]>Object.values(raw); 
      })
    )
  }
}
