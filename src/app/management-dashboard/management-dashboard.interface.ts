export class ITeamWiseDetail {
    APM: number;
    CSS_8_0: number;
    DashboardReports: number;
    GDP: number;
    PLS: number;
    Month: number;
    Release: number;
    Support: number;
    Testing: number;
    TotalLeave:number;
    WS1:number;
    WS2:number;
    WS3:number;
    WS4:number;
    Year:number;
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