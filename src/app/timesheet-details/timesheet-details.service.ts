import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import{ITimesheetDetails} from './Timesheetdetails.interface'
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig'
import { environment } from './../../environments/environment'; 
@Injectable()
export class TimesheetdetailService {
    headers: Headers;
    options: RequestOptions;
    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }
    public getJSON(): Observable<any> {
        return this._http.get("./assets/Timesheetdata.Json")
        .map((response: Response) => <any[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    getTimesheetdetails(Month:string,Year:string,FromDate:string,ToDate:string,EMPID:string): Observable<ITimesheetDetails[]> {
        return this._http.get(environment.APIUrl+"Timesheet/GetTimesheetSummary?Month="+Month+"&Year="+Year+"&FromDate="+FromDate+"&ToDate="+ToDate+"&EMPID="+EMPID)
            .map((response: Response) => <ITimesheetDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }


    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
  
    
}