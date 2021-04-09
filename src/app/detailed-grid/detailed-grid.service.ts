import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from './../../environments/environment'; 
import { Observable } from 'rxjs/Rx'
import { LeavemanagementserviceConfig } from '../leavemanagement.serviceconfig';
import { IEmpLeaveDetails, IDeleteLeaveDetail, IForgetDetails, ICardDeleteDetail, IStatusTypes, IMasterDetail } from '../detailed-grid/detailed-grid.interface';
import { Options } from 'selenium-webdriver/safari';
@Injectable()
export class EMPDetailedGridDetailService {
    headers: Headers;
    options: RequestOptions;
    // public APIUrl = "http://192.168.1.238/EDSInternalAPI_Reg/api/";
    public EMPLeaveData: any;
    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }
    GetStatusTypes(): Observable<IStatusTypes[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetStatusTypes')
            .map((response: Response) => <IStatusTypes[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    GetEmployeeLeaveDetails(Loggeduser: String, LeaveFromDate: string, LeaveToDate: string, EMPCODE: String, TeamID: string, LeaveTypeID: string, LeaveStatusID: string,From:number,CTO:number): Observable<IMasterDetail> {
        return this._http.get(environment.APIUrl + 'Leave/GetEmployeeLeaveDetailsForDGWithFilterOptions?LoggedInEMPcode=' + Loggeduser + '&FromDate=' + LeaveFromDate + '&ToDate=' + LeaveToDate + '&EMPCODE=' + EMPCODE + '&TeamID=' + TeamID + '&LeaveTypeID=' + LeaveTypeID + '&LeaveStatusID=' + LeaveStatusID+'&From='+From+'&CTO='+CTO)
            .map((response: Response) => <IMasterDetail>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    GetForgetcarddetails(EMPCODE: String): Observable<IForgetDetails[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetForgetcardDetails?EMPCODE=' + EMPCODE)
            .map((response: Response) => <IForgetDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    DeleteLeaveDetail(DeleteLeaveobj: IDeleteLeaveDetail): Observable<any> {
        let body = JSON.stringify(DeleteLeaveobj);
        return this._http
            .post(environment.APIUrl + 'Leave/RemoveLeaveDetail', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    DeleteCardDetail(DeleteCardobj: ICardDeleteDetail): Observable<any> {
        let body = JSON.stringify(DeleteCardobj);
        return this._http
            .post(environment.APIUrl + 'Leave/RemoveForgetcardEntry', body, this.options)
            .map(this.extractData)
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
    GetEmployeeLeaveDtlsExample() {
        // return this._http.get(LeavemanagementserviceConfig.APIUrl + 'Leave/GetEmployeeLeaveDetailsForDGWithFilterOptions?LoggedInEMPcode=' + Loggeduser + '&FromDate=' + LeaveFromDate + '&ToDate=' + LeaveToDate + '&EMPCODE=' + EMPCODE + '&TeamID=' + TeamID + '&LeaveTypeID=' + LeaveTypeID + '&LeaveStatusID=' + LeaveStatusID)
        //     .map((response: Response) => <IMasterDetail>response.json())
        //     .do(data => JSON.stringify(data))
        //     .catch(this.handleError);
        return this._http.get(environment.APIUrl + 'Leave/GetStatusTypes')
            .map((res: Response) => {
                // console.log("GetEmployeeLeaveDtlsExample =>", JSON.stringify(res));
                if (res) {
                    if (res.status === 201) {
                        console.log("result 201=> ", res);
                        console.log("Result 201=> ", [{ status: res.status, json: res }]);
                        return [{ status: res.status, json: res }]
                    }
                    else if (res.status === 200) {
                        console.log("Result 200=> ", [{ status: res.status, statusText: res.statusText, returnvalue: res }]);
                        console.log("returnvalue 200=> ", [{  returnvalue: res }]);
                        return [{ status: res.status, json: res }]
                    }
                }
            }).catch((error: any) => {
                if (error.status < 400 || error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
            })


    }

}