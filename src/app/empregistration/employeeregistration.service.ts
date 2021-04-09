import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 
import { IEmployeeTypes, ITeam, IRole, IEmployer, IEmployee } from '../empregistration/employee.Interface';
import { LeavemanagementserviceConfig } from '../leavemanagement.serviceconfig';


@Injectable()
export class EmployeeRegistrationService {
  public EmployeeDetails: any;
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


  SaveEmployee(empObj: IEmployee): Observable<any> {
    debugger;
    let body = JSON.stringify(empObj);

    return this._http.post(environment.APIUrl + '/Employee/Registration', body, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
 

  getEmployeeTypes(): Observable<IEmployeeTypes> {
    return this._http.get(environment.APIUrl + '/Employee/GetEmployeeTypes')
      .map((response: Response) => <IEmployeeTypes>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }


  getAllTeams(): Observable<ITeam> {
    return this._http.get(environment.APIUrl + '/Employee/GetTeams')
      .map((response: Response) => <ITeam>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.handleError);
  }

  getRoles(): Observable<IRole> {
    return this._http.get(environment.APIUrl + '/Employee/GetRoles')
      .map((response: Response) => <IRole>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.handleError)
  }


  getEmployers(): Observable<IEmployer> {
    return this._http.get(environment.APIUrl + '/Employee/GetEmployers')
      .map((response: Response) => <IEmployer>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.handleError)
  }

  getEmployeeDetails(Uname: String, Pwrd: string) {
    return this._http.get(environment.APIUrl + 'Employee/Login?EMail=' + Uname + '&Password=' + Pwrd)
      .map((response: Response) => <IEmployee>response.json())
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
