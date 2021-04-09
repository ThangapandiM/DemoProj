import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 
import { ITeamLeaveDetails, ITeamNames } from '../team-dashboard/team-dashboard.Interface';
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig'
@Injectable()
export class TeamDashboardService {
    headers: Headers;
    options: RequestOptions;
    public APIUrl = "http://192.168.1.238/EDSInternalAPI_Reg/api/";
    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }

    getTeamLevelEmployeeLeaveDetails(EMPCODE: string, Year: string, TeamID: String): Observable<ITeamLeaveDetails[]> {
        console.log(environment.APIUrl + 'Leave/GetTeamLevelEmployeeLeaveDetails?EMPCODE=' + EMPCODE + '&Year=' + Year + '&TeamID=' + TeamID);
        return this._http.get(environment.APIUrl + 'Leave/GetTeamLevelEmployeeLeaveDetails?EMPCODE=' + EMPCODE + '&Year=' + Year + '&TeamID=' + TeamID)
            .map((response: Response) => <ITeamLeaveDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    getTeamLevelEmployeeLeaveDetailsForMonth(EMPCODE: string, Year: string, TeamID: String, Month: string): Observable<ITeamLeaveDetails[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetTeamLevelEmployeeLeaveDetails?EMPCODE=' + EMPCODE + '&Year=' + Year + '&TeamID=' + TeamID + '&Month=' + Month)
            .map((response: Response) => <ITeamLeaveDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    getTeamNames(EMPCODE: string): Observable<ITeamNames[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetTeamDetailsByEmpCode?EMPCODE=' + EMPCODE)
            .map((response: Response) => <ITeamNames[]>response.json())
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