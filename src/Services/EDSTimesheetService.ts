import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
@Injectable()

export class EDSTimesheetAPI{
    public Logindata:any;
    headers: Headers;
    options: RequestOptions;
    public APIUrl="http://192.168.1.100/EDSInternalAPI_Reg/api/";

    constructor(private http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }

    GetLogin(Uname:string,Pwrd:string)
    {
        return new Promise(resolve => {
            this.http.get(this.APIUrl + 'Employee/Login?EMail=' + Uname + '&Password=' + Pwrd)

                .map(res => res.json())
                .subscribe(data => {
                    this.Logindata = data;
                    resolve(this.Logindata)
                })
        })
    }

}
