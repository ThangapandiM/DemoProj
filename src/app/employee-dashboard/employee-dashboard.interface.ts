export interface IMonthLeaveDetails {
  Months: string,
  CasualLeave: number,
  CompoffLeave: number,
  SickLeave: number,
  Permission: number,
  OtherLeave: number,
  HolidayWork: number;
  ExceptionLeave: number,
  WorkFromHome: number,
  Total: string;
}
export interface IYearLeaveDetails {
  Years: string,
  Month: string,
  CasualLeave: number,
  CompOffLeave: number,
  SickLeave: number,
  Permission: number,
  WeddingLeave: number,
  HolidayWork: number;
  HolidayLeave: number,
  WorkFromHome: number,
  ExtendedHours:number,
  ConsecutiveLeave:number,
  TotalLeave: number
}
export interface IEmployeeDetails {
  EMPID: number,
  EMPCODE: string,
  EMPName: string
}
