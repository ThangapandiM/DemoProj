import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { environment } from './../../environments/environment'; 
import { LeavemanagementserviceConfig } from '../leavemanagement.serviceconfig';
import { IEmployeeList } from "./employeelist.interface";

@Injectable()
export class EmployeeListService {

  constructor(private _http: Http) { }



  GetAllEmployeeLists() {
    return this._http.get(environment.APIUrl + 'Employee/GetAllEmployeeList')
      .map((response: Response) => <IEmployeeList[]>response.json())
      .do(data => JSON.stringify(data))
      .catch(this.HandleError);
  }


  private HandleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
