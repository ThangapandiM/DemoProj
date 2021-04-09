import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 

import { ITeamLeaveDetails, ITeamNames } from '../team-dashboard/team-dashboard.Interface';
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig'
import{ITimesheetdetails,Isavedata,IMasterdetails,ITimesheetMasterdetails} from './Timesheet.interface'
@Injectable()
export class TimesheetentryService {
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
    getUserTimesheetdetails(UserID:Number,LogDate:string): Observable<ITimesheetMasterdetails> {
        return this._http.get(environment.APIUrl+"Timesheet/GetDetailsforTimesheetApplication?UserID="+UserID+"&LogDate="+LogDate)
            .map((response: Response) => <ITimesheetMasterdetails>response.json())
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
    Savetimesheetdetails(empObj: Isavedata): Observable<any> {
        let body = JSON.stringify(empObj);
        return this._http
          .post(environment.APIUrl+ 'Timesheet/SaveWorkEntryDetails', body, this.options)
          .map(this.extractData)
          .catch(this.handleError);
      }
 
      Updatetimesheetdetails(empObj: Isavedata): Observable<any> {
        let body = JSON.stringify(empObj);
        return this._http
          .post(environment.APIUrl+ 'Timesheet/UpdateWorkEntryDetails', body, this.options)
          .map(this.extractData)
          .catch(this.handleError);
      }

      getMasterdata(MasterID:string):Observable<IMasterdetails[]>{
        return this._http.get(environment.APIUrl+"Timesheet/GetMasterDataforTimesheetApplication?MasterType="+MasterID)
        .map((response: Response) => <IMasterdetails[]>response.json())
        .do(data => JSON.stringify(data))
        .catch(this.handleError);
      }
}