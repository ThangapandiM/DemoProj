import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from './../../environments/environment'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'

import { IHolidayList  } from '../holiday-list/holiday-list.interface'
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig';
@Injectable()
export class HolidayListService {
    headers: Headers;
    options: RequestOptions;
 // public APIUrl = "http://192.168.1.238/EDSInternalAPI_Reg/api/";   
   constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }
 
    public getHolidayListforthisYear(Year: string): Observable<IHolidayList[]> {
        return this._http.get(environment.APIUrl + 'Employee/GetHolidayList?Year=' + Year  )
            .map((response: Response) => <IHolidayList[]>response.json())
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