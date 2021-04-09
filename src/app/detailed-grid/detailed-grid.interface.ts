export interface IMasterDetail{
    LeaveDetails:IEmpLeaveDetails[];
    TeamDetails:ITeamNames[];
    LeaveTypeDetails:ILeaveType[];
    StatusTypeDetails:IStatusTypes[];
    EmployeeDetails:IEmployeeDetails[];
    Leavecount:IRowcount[];
}
export interface IEmpLeaveDetails {
    LeaveID: number;
    EMPCODE: string;
    EMPName: string;
    LeaveFromDate: string;
    LeaveToDate: string;
    LeaveRemarks: String;
    LeaveTypeID: string;
    LeaveType: string;
    LeaveStatus: string;
    NoofdaysApplied: number;
    PermissionsTaken: string;
    TeamID:string;
    TeamName: string;
    LeaveTakenThisMonth: number;
    LeaveTakenThisYear: number;
    CreatedOn: string;
    LeaveApprovedDate: string;
    LeaveApprovedBy: string;
    CreatedBy: string;
    EMPTypeID: number;
    LeaveStatusID: string;
}
export class ILeaveType {
    LeaveTypeID: number;
    LeaveType: string;
    IsActive: boolean;
    createdOn: string;
  }
  export interface IEmployeeDetails {
    EMPID: number,
    EMPCODE: string,
    EMPName: string,
    TeamID: string,
    TeamName: string;
}
export interface ITeamNames {
    TeamName: string;
    TeamID: string;
}
export interface IDeleteLeaveDetail {
    LeaveID: number;
    EMPCODE: number;
    Remarks: string;
    Flag: boolean;
}
export interface IDeleteResult {
    Status: string;
    Description: string;
    LeaveID: number;
}
export interface IForgetDetails {
    UniqueID: string;
    EMPName: string;
    CardNo: string;
    Date: string;
    Remarks: string;
}
export interface ICardDeleteDetail {
    UniqueID: string;
}
export interface ICardDeleteResult {
    Status: string;
    Description: string;
}
export interface IStatusTypes {
    StatusID: number;
    StatusName: string;
    StatusActive: boolean;
    CreatedOn: string;
}
export interface IRowcount{
    TCount:number
}