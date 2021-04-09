import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 
import { IMonthLeaveDetails, IYearLeaveDetails, IEmployeeDetails } from '../employee-dashboard/employee-dashboard.interface';
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig';
@Injectable()
export class EmployeeDashboardService {

    public MonthLeaveDetails: IMonthLeaveDetails;
    public YearLeaveDetails: IYearLeaveDetails;

    headers: Headers;
    options: RequestOptions;
    //public APIUrl = "http://192.168.1.238/EDSInternalAPI_Reg/api/";

    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }


    getYearLeaveDetails(LoggedCode: string, EMPCODE: string, Year: string): Observable<IYearLeaveDetails[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetEmployeeYearDetails?LoggedInEMPCODE=' + LoggedCode + '&EMPCODE=' + EMPCODE + '&Year=' + Year)
            .map((response: Response) => <IYearLeaveDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getMonthLeaveDetails(EMPCODE: string): Observable<IMonthLeaveDetails[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetEmployeeMonthDetails?EMPCODE=' + EMPCODE)
            .map((response: Response) => <IMonthLeaveDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getEmployeeNameDetails(EMPCODE: string): Observable<IEmployeeDetails[]> {
        return this._http.get(environment.APIUrl + 'Employee/GetTeamwiseEmployeeDetails?EMPCODE=' + EMPCODE)
            .map((response: Response) => <IEmployeeDetails[]>response.json())
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