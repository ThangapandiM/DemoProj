export interface ITimesheetMasterdetails{
  emplyeedetails:IEmployeeDetails;
  ITimesheetdetails:ITimesheetdetails[];
}
export interface Isubmitdata {
  From: string;
  To: string;
  Project: string;
  Tracker: string;
  Actvity: string;
  Summary: string;
}
export interface ITimesheetdetails {
  WorkEntryID: number;
  Activity:string;
  ActivityID:Number;
  Selected: boolean;
  PunchID: string;
  TeamName: string;
  DeviceID: Number;
  UserID: string;
  UserName: string;
  LogDate: Date;
  InTime: any;
  OutTime: any;
  InTimeDisplay:string;
  OutTimeDisplay:string;
  LogMinutes: Number;
  ProjectDescription:string;
  ProjectID:Number;
  WorkEntryMinutes: Number;
  Region:string;
  RegionID:Number;
  TaskSummary:string;
  WorkModule:string;
  ModuleID:Number;
  Status: string;
  LogHours: string;
  HallName: string;
  Door: string;
  WorkLocation: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
  IsEditable:Boolean;
  editpermission:Boolean;
  maticon:string;
  tooltipcopy:string;
  TrackerNo:string;
  
}
export interface IPunchtime {
  WorkEntryID: number;
  Activity:string;
  ActivityID:Number;
  Selected: boolean;
  PunchID: string;
  TeamName: string;
  DeviceID: Number;
  UserID: string;
  UserName: string;
  LogDate: Date;
  InTime: any;
  OutTime: any;
  InTimeDisplay:string;
  OutTimeDisplay:string;
  ProjectDescription:string;
  ProjectID:Number;
  LogMinutes: Number;
  WorkEntryMinutes: Number;
  Region:string;
  RegionID:Number;
  TaskSummary:string;
  WorkModule:string;
  ModuleID:Number;
  Status: string;
  LogHours: string;
  HallName: string;
  Door: string;
  WorkLocation: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
  IsEditable:Boolean;
  editpermission:Boolean;
  maticon:string;
  tooltipcopy:string;
  TrackerNo:string;
  
  
}
export interface Isavedata {
  WorkEntryID: number;
  EmployeeID: number;
  PunchID: string;
  PunchDate: Date;
  PunchInTime: Date;
  PunchOutTime:Date;
  WorkDate:Date;
  FromTime:Date;
  ToTime:Date;
  ProjectID:Number;
  ModuleID:Number;
  SprintNo:string;
  TrackerNo:string;
  ActivityID:Number;
  TaskSummary:string;
  RegionID:Number;
  Remarks:string;
  WorkLocation:string;
  CreateBy:string;
  CreatedDate:Date;
  ModifiedBy:string;
  ModifiedDate:Date;
  Status:string;
  TaskStatusID:number;

}
export interface ICopydata {
  WorkEntryID: number;
  EmployeeID: number;
  PunchID: string;
  PunchDate: Date;
  PunchInTime: Date;
  PunchOutTime:Date;
  WorkDate:Date;
  FromTime:Date;
  ToTime:Date;
  ProjectID:number;
  ModuleID:number;
  SprintNo:string;
  TrackerNo:string;
  ActivityID:number;
  TaskSummary:string;
  RegionID:number;
  Remarks:string;
  WorkLocation:string;
  CreateBy:string;
  CreatedDate:Date;
  ModifiedBy:string;
  ModifiedDate:Date;
  Status:string;
  ProjectDescription:string;
  Activity:string;
  WorkModule:string;
  Region:string;

}
export interface IMasterdetails{
  MasterType:string;
  Code:Number;
  Description:string;
 SlNo:Number;
 IsActive:Boolean;

}
export interface IEmployeeDetails{
  EmpName:string;
  TeamName:string;
  FromTime:Date;
  ToTime:Date;
  RequiredWorkingHours:string;
  RequiredInHours:string;
  WorkingHours:string;
  BreakHours:string;
  HasReqWorkingHours:string;
  HasReqTotalWorkingHours:string;
  TotalEmpWorking:string;
  IsTimeSheetCompleted:string;
  EnableEditing:Boolean;
}