import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { IEmployeeCalenderDetails } from '../calender-dashboard/calender-dashboard.interface'
import { EmployeeCalenderService } from '../calender-dashboard/calender-dashboard.service'
import { UserService } from '../users/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { HolidayListComponent } from '../holiday-list/holiday-list.component'
import { DatePipe } from '@angular/common';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'calender-dashboard',
  templateUrl: './calender-dashboard.component.html',
  styleUrls: ['./calender-dashboard.component.scss'],
  providers: [DatePipe]
})

export class CalenderDashboardComponent implements OnInit, OnChanges {
  @Input() SelectedEmpCode: string
  @Input() CurrentYear: string
  view: string = 'month';
  viewDate = new Date();
  
  IsEmployee: string = ""
  LoggedinEmpCode: string = "1259"
  today: Date = new Date();
  public CurrentMonth = new Date().getMonth();
  formedDate : string;
 

  public EmployeeCalenderDetails: IEmployeeCalenderDetails[];
  public activeDayIsOpen = false;
  constructor(public employeeCalenderService: EmployeeCalenderService,
    public userService: UserService,
    public dialog: MatDialog,private datePipe: DatePipe ) {
    this.LoggedinEmpCode = this.userService.EMPCode
    if (this.SelectedEmpCode != "0")
      this.IsEmployee = "True"
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['SelectedEmpCode']) {

      this.GetEmployeeCalenderDetails()

    }
debugger;
    if(changes['CurrentYear'])
      {
        let m_Month:number=this.CurrentMonth + 1
        this.formedDate  ="1/"+ m_Month +"/" + this.CurrentYear
        //this.viewDate = new Date(this.formedDate)
        
      }

     
  }

  ngOnInit() {
    this.GetEmployeeCalenderDetails()
  }


  getCssClass(Employee) {


    if (Employee.LeaveType == "Casual Leave")
      return "CasualLeave"
    else if (Employee.LeaveType == "Sick Leave")
      return "SickLeave"
    else if (Employee.LeaveType == "Wedding Leave")
      return "WeddingLeave"
    else if (Employee.LeaveType == "Holiday Leave")
      return "HolidayLeave"
    else if (Employee.LeaveType == "Comp Off Leave")
      return "CompOffLeave"
    else if (Employee.LeaveType == "Holiday Work")
      return "HolidayWork"
    else if (Employee.LeaveType == "Work From Home")
      return "WorkFromHome"
  }

  GetEmployeeCalenderDetails() {
    // this.employeeCalenderService.getEmployeeLeaveforCalender(,'1112')
    this.employeeCalenderService.getEmployeeLeaveforCalender(this.LoggedinEmpCode, this.SelectedEmpCode)
      .subscribe((data: IEmployeeCalenderDetails[]) => {
        this.EmployeeCalenderDetails = data;
      })
  }
  GetEmployeeCalenderDetailsFromChild(EmpCode)
  {
   
    this.SelectedEmpCode = EmpCode
  
    this.employeeCalenderService.getEmployeeLeaveforCalender(this.LoggedinEmpCode,  this.SelectedEmpCode)
      .subscribe((data: IEmployeeCalenderDetails[]) => {
        this.EmployeeCalenderDetails = data;
      })
  }

 
  openHolidayListDialoque() {
   
    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.height = '500px';
    dialogConfig.width = '700px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.data={Viewdate:this.viewDate}
    this.dialog.open(HolidayListComponent, dialogConfig);
   
    // let dialogRef = this.dialog.open(HolidayListComponent, {
    //   width: '600px',
    //   data: ''
    // });

  }

}
