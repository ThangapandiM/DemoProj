import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 
import { IEmpLeaveDetails, IEMPLeaveApprovalDetails, IEmployeeDetails, IMasterDetail,IMGAttachment } from '../leaveapproval/leaveapproval.Interface';
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig'
@Injectable()
export class LeaveApprovalService {
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

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  getEmployeeLeaveDetails(Loggeduser: String, LeaveFromDate: string, LeaveToDate: string, EMPCODE: String, TeamID: string, LeaveTypeID: string, LeaveStatusID: string,ShowAll:Number,From:Number,CTO:Number): Observable<IMasterDetail> {
    return this._http.get(environment.APIUrl + 'Leave/GetEmployeeLeaveDetailsForApproval?LoggedInEMPcode=' + Loggeduser + '&FromDate=' + LeaveFromDate + '&ToDate=' + LeaveToDate + '&EMPCODE=' + EMPCODE + '&TeamID=' + TeamID + '&LeaveTypeID=' + LeaveTypeID + '&LeaveStatusID=' + LeaveStatusID+'&ShowALL='+ShowAll+'&From='+From+'&CTO='+CTO)
      .map((response: Response) => <IMasterDetail>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }
  getEmployeeNameDetails(EMPCODE: string): Observable<IEmployeeDetails[]> {
    return this._http.get(environment.APIUrl + 'Employee/GetTeamwiseEmployeeDetails?EMPCODE=' + EMPCODE)
      .map((response: Response) => <IEmployeeDetails[]>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }
  CommitLeave(empObj: IEMPLeaveApprovalDetails): Observable<any> {
    let body = JSON.stringify(empObj);
    return this._http
      .post(environment.APIUrl + 'Leave/CommitLeaveStatus', body, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  CommitAllLeave(empObj: IEMPLeaveApprovalDetails[]): Observable<any[]> {
    let body = JSON.stringify(empObj);
    return this._http
      .post(environment.APIUrl + 'Leave/CommitAllLeaveStatus', body, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  GetemployeeIMG(EMPCODE: string): Observable<any> {
    return this._http.get(environment.APIUrl + 'Leave/GETEmployeeIMG?EMPCODE=' + EMPCODE)
    .map((response: Response) => <any>response.json())
    .do(data => JSON.stringify(data))
    .catch(this.handleError);
  }
}
