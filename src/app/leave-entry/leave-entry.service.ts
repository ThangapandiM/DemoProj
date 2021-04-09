import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment'; 
import { ILeaveDetail, ISaveattachment, ILeaveType, IEmployeeDetails, IForgetCardDeatails, IForgetCardResult, IHolidayWorkDetails, IWorkLocation, IWorkType } from '../leave-entry/Leave-entry.Interface';
import { LeavemanagementserviceConfig } from '../leavemanagement.serviceconfig';
@Injectable()
export class LeaveEntryService {
    headers: Headers;
    options: RequestOptions;
    public APIUrl1 = "http://localhost/EDSInternalService/api/";

    constructor(private _http: Http) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        this.options = new RequestOptions({ headers: this.headers });
    }

    SaveLeaveDetail(Leaveobj: ILeaveDetail): Observable<any> {
        
        let body = JSON.stringify(Leaveobj);
        return this._http
            .post(environment.APIUrl + 'Leave/CommitLeaveDetails', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    SaveAttachmc(AttachmentMc: ISaveattachment): Observable<any> {
        
        let body = JSON.stringify(AttachmentMc);
        alert(body);
        return this._http
            .post(environment.APIUrl + 'Leave/CommitAttachementDetails', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    GetLeaveTypes(EMPCODE: string): Observable<ILeaveType[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetLeaveTypes?EMPCODE=' + EMPCODE)
            .map((response: Response) => <ILeaveType[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }

    getEmployeeNameDetails(EMPCODE: string): Observable<IEmployeeDetails[]> {
        debugger;
        return this._http.get(environment.APIUrl + 'Employee/GetTeamwiseEmployeeDetails?EMPCODE=' + EMPCODE)
            .map((response: Response) => <IEmployeeDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    CommitForgetcardDeatail(CardObj: IForgetCardDeatails): Observable<any>{
        let body = JSON.stringify(CardObj);
        return this._http
            .post(environment.APIUrl + 'Leave/ForgetCardDetail', body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    GetHolidayWorkDetails(EMPCODE: string, Fromdate: string): Observable<IHolidayWorkDetails[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetHolidayWork?EMPCODE=' + EMPCODE + '&LeaveDate=' + Fromdate)
            .map((response: Response) => <IHolidayWorkDetails[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    GetWorkLocation(): Observable<IWorkLocation[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetWorkLocation')
            .map((response: Response) => <IWorkLocation[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    GetWorkTypes(): Observable<IWorkType[]> {
        return this._http.get(environment.APIUrl + 'Leave/GetWorkTypes')
            .map((response: Response) => <IWorkType[]>response.json())
            .do(data => JSON.stringify(data))
            .catch(this.handleError);
    }
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    UpdateMCAttachment(AttachmentMc: ISaveattachment): Observable<any> {
        try {
            let body = JSON.stringify(AttachmentMc);
            // console.log("URL =>",LeavemanagementserviceConfig.APIUrl + 'Employee/Attachment');
            // console.log("Body",body);
            return this._http.post(environment.APIUrl + 'Employee/Attachment', body, this.options)
                .map(this.extractData)
                .catch(this.handleError);

        } catch (error) {

        }
    }


}
