import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from './../../environments/environment'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import{LeavemanagementserviceConfig} from '../leavemanagement.serviceconfig'

@Injectable()
export class UserService  {

  isAuthenticated = false;
  public Logindata:any;
  public EMPCode:any;
  public EMPEmailID:any;
  public EMPID:any;
  public EMPTypeID:any;
  public EMPUserName:any;
  public EMPPassword:any;
  public EMPName:any;
  public Hierarchy:any;
  public EMPTeam:any;
  public Gender:any;
  headers: Headers;
  options: RequestOptions;
  public APIUrl="http://192.168.1.238/EDSInternalAPI_Reg/api/";


  constructor(private http: Http,
  private router: Router) {
    this.headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    this.options = new RequestOptions({ headers: this.headers });
}

GetLogin(Uname:string,Pwrd:string)
{
    return new Promise(resolve => {
        
        this.http.get(environment.APIUrl + 'Employee/Login?EMail=' + Uname + '&Password=' + Pwrd)

            .map(res => res.json())
            .subscribe(data => {
              
                this.Logindata = data;
               resolve(this.Logindata)
            })
    })
}

signIn(empCode : number, empId: number, userName:string, EmailID:string,Pwrd:string,EMPName:string,EMPTypeID:number, TeamName:string,Gender:string,Hierarchy:string)  {
    this.EMPCode=empCode;
    this.EMPID=empId;
    this.EMPUserName=userName;
    this.EMPEmailID=EmailID;  
    this.EMPPassword=Pwrd;
    this.isAuthenticated = true;
    this.EMPName=EMPName;
    this.EMPTypeID=EMPTypeID;
    this.EMPTeam = TeamName;
    this.Gender=Gender;
    this.Hierarchy=Hierarchy;
  }

  signOut(): Observable<any> {
      this.isAuthenticated = false;
      this.EMPCode="";
      this.EMPID="";
      this.EMPUserName="";
      this.EMPEmailID="";  
      this.EMPPassword="";
      this.EMPTypeID="";
      this.EMPTeam = "";
      this.router.navigate(['/signin']);
      return Observable.of({});
  }

}