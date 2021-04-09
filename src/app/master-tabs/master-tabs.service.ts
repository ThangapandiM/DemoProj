import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { ImasterTabs } from '../master-tabs/master-tabs.Interface';
import { environment } from './../../environments/environment'; 
@Injectable()
export class MasterTabsService {
    public mastersdata: any;
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


    // GetMasterTabDetails(EMPCode): Observable<ImasterTabs[]> {
    //     
    //     return this._http.get(environment.APIUrl + 'Employee/GetMenuDetailsByEmpcode?EMPCODE=' + EMPCode)
    //         // .map((response: Response) => <ImasterTabs[]>response.json())
    //         .map((response: Response) => <ImasterTabs[]>response.json())
    //         .do(data => JSON.stringify(data))
    //         .catch(this.handleError);
    // }

    GetMasterTabDetails(EMPCode): Observable<ImasterTabs[]> {
   
           return this._http.get(environment.APIUrl + 'Employee/GetMenuDetailsByEmpcode?EMPCODE=' + EMPCode)
           .map((response: Response) => <ImasterTabs[]>response.json())
           .do(data => JSON.stringify(data))
           .catch(this.handleError);
       }


    public GetMasterTabDtls(EMPCode) {
        return this._http.get(environment.APIUrl + 'Employee/GetMenuDetailsByEmpcode?EMPCODE=' + EMPCode).toPromise().
            catch(e => {
                console.log("error happend", e);
            });
    }

    private handleError(error: Response) {
        console.error(error);
        alert(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private extractData(res: Response) {
        alert("success");
        let body = res.json();
        return body || {};
    }

}