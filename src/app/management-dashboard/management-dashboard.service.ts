import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment'; 
import {ITeamWiseDetail,IEmpLeaveDetails } from '../management-dashboard/management-dashboard.interface';
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig';
@Injectable()
export class ManagementDashboardService {
    headers: Headers;
    options: RequestOptions;
    public APIUrl = "http://192.168.1.238/EDSInternalAPI_Reg/api/";
    public ITeamWiseDetail:ITeamWiseDetail;
    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }
    GetEmployeeLeaveyearwise(EMPCODE: string,Year:string): Observable<ITeamWiseDetail[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetEmployeeLeaveyearwise?LoggedInEMPCODE=' + EMPCODE +'&Year='+Year)
            .map((response: Response) => <ITeamWiseDetail[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
  
      getEmployeeLeaveDetails(EMPCode: String,status :string ): Observable<IEmpLeaveDetails[]> {
        return this._http.get(environment.APIUrl + 'leave/GetEmployeeLeaveDetails?EMPCode=' + EMPCode + "&status="+status)
          .map((response: Response) => <IEmpLeaveDetails[]>response.json())
          .do(data => JSON.stringify(data))
          .catch(this.handleError);
      }

}