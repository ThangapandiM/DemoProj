export class ILeaveDetail {
  EMPCODE: string;
  LeaveTypeID: string;
  LeaveFromDate: string;
  LeaveToDate: string;
  LeaveStatusID: number;
  LeaveRemarks: string;
  LeaveApproval: boolean;
  LeaveApproveRemarks: string;
  LeaveApprovedBy: string;
  CreatedBy: string;
  HolidayWorkID: string;
  IsPartial: boolean;
  WorkLocationID: string;
  ExtendedWorkID: string;
}
export class ILeaveType {
  LeaveTypeID: number;
  LeaveType: string;
  IsActive: boolean;
  createdOn: string;
}
export class IWorkType {
  LeaveTypeID: number;
  LeaveType: string;
  IsActive: boolean;
  createdOn: string;
}
export interface ILeaveResult {
  Status: string;
  Description: string;
  LeaveID: string;
}
export interface IEmployeeDetails {
  EMPID: number,
  EMPCODE: string,
  EMPName: string
  Gender: string
}
export interface IForgetCardDeatails {
  EMPCODE: string,
  CardID: string,
  Remarks: string,
  Date: string
}
export interface IForgetCardResult {
  Status: string;
  Description: string;
  CardID: string;
}

export interface IHolidayWorkDetails {
  LeavetypeID: string;
  LeaveID: string;
  HolidayWorkDate: string;
  HalfDayFlag: string;
  WorkReason: string;
}
export interface IExtendedWorkDetails {
  LeavetypeID: string;
  LeaveID: string;
  HolidayWorkDate: string;
  HalfDayFlag: string;
  Description: string;
}
export interface IWorkLocation {
  LocationID: string;
  LocationType: string;
}
export interface IAttachmentMc {
  Attachments: string;
  Description: String;
  FileType: String;
  FileName: string;
  Typename: String;
  Type: String;
}
export interface ISaveattachment {
  LeaveID: string;
  FileType: String;
  FileName: string;
  Attachments: string;
  CreatedBy: string;
}