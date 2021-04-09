import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 
import { ITeamWiseLeaveDetails } from '../team-wise-dashboard/team-wise-dashboard.Interface';
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig'
@Injectable()
export class TeamWiseDashboardService{
    headers: Headers;
    options: RequestOptions;
    public APIUrl="http://192.168.1.238/EDSInternalAPI_Reg/api/";
    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }

    getTeamWiseLeaveDetails(EMPCODE:string,Year:string):Observable<ITeamWiseLeaveDetails[]>
    {
       
        return this._http.get(environment.APIUrl + 'Leave/GetTeamWiseEmployeeLeaveDetails?EMPCODE='+ EMPCODE + '&Year=' +Year)
        .map((response: Response) => <ITeamWiseLeaveDetails[]>response.json())
        .do(data => JSON.stringify(data))
        .catch(this.handleError);
    }

    getTeamWiseLeaveDetailsForMonth(EMPCODE:string,Year:string, Month:string):Observable<ITeamWiseLeaveDetails[]>
    {
       
        return this._http.get(environment.APIUrl + 'Leave/GetTeamWiseEmployeeLeaveDetails?EMPCODE='+ EMPCODE + '&Year=' +Year + '&Month=' +Month)
        .map((response: Response) => <ITeamWiseLeaveDetails[]>response.json())
        .do(data => JSON.stringify(data))
        .catch(this.handleError);
    }

    private extractData(res: Response) {
        alert("success");
        let body = res.json();
        return body || {};
      }
    
    
      private handleError(error: Response) {
        console.error(error);
        alert(error);
        return Observable.throw(error.json().error || 'Server error');
      }
}