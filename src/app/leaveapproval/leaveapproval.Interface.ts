export interface IMasterDetail {
    LeaveDetails: IEmpLeaveDetails[];
    TeamDetails: ITeamNames[];
    LeaveTypeDetails: ILeaveType[];
    StatusTypeDetails: IStatusTypes[];
    EmployeeDetails: IEmployeeDetails[];
    Leavecount:IRowcount[];

}
export interface IEMPLeaveApprovalDetails {
    LeaveApproval: boolean;
    LeaveApproveRemarks: string;
    LeaveApprovedBy: number;
    LeaveID: number;
    Status: string;
    Description: string;
    IsException: boolean;
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
export interface IStatusTypes {
    StatusID: number;
    StatusName: string;
    StatusActive: boolean;
    CreatedOn: string;
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
    PermissionsTaken: number;
    TeamID: string;
    TeamName: string;
    LeaveTakenThisMonth: number;
    LeaveTakenThisYear: number;
    CreatedOn: string;
    LeaveApprovedDate: string;
    LeaveApprovedBy: string;
    CreatedBy: string;
    EMPTypeID: number;
    LeaveStatusID: string;
    CanIApprove: boolean;
    PermissionDuration: string;
    Priority: boolean;
    Gender: string;
    AppliedLeaveRemarks:string;
    IsException: boolean;
    InlcudeForException: boolean;
    EMPImgAttachment: String;
    EMPImgName: string;
    EmpRemarks:string;
    EMPType:string;
}
export interface IMGAttachment{
    EMPImgAttachment: String;
} 
export interface IRowcount{
    TCount:number
}