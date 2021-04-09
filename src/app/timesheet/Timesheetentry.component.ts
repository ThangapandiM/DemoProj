import { Component, Renderer, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { getLocaleDateFormat, DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, fadeInContent } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawerToggleResult } from '@angular/material';
import { TimesheetentryService } from './Timesheetentry.service'
import { A11yModule } from '@angular/cdk/a11y';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ITimesheetdetails, IPunchtime, Isubmitdata, Isavedata, IMasterdetails, IEmployeeDetails, ITimesheetMasterdetails, ICopydata } from './Timesheet.interface'
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../users/user.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-timesheet-entry',
  templateUrl: './Timesheetentry.html',
  styleUrls: ['./Timesheetenrty.css'],
  providers: [DatePipe]
})

export class Timesheetcomponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  Changeddate: IPunchtime;
  Timesheetdata: ITimesheetdetails[];
  TimesheetMasterdetails: ITimesheetMasterdetails;
  EmployeeDetails: IEmployeeDetails;
  panelOpenState = false;
  public TeamNameArray = new Array();
  displayedColumns = ['savedRcd', 'InTime', 'OutTime', 'Status', 'ProjectDescription', 'WorkModule', 'TrackerNo', 'Activity', 'Region', 'Editbutton', 'copy'];
  displayeddetailcolumn = ['From', 'To', 'Project', 'Tracker', 'Actvity', 'Summary']
  datasource = new MatTableDataSource();
  detaildatasource = new MatTableDataSource();
  public TSData = new Array();
  public statndardTo: number = 0;
  public Todate: number;
  public AOutTime: string;
  public empName: string;
  view: string = 'month';
  viewDate = new Date();
  Selectdate = new Date();
  currentdate = new Date();
  public activeDayIsOpen = false;
  public Fromtime: string;
  public Totime: string;
  public project: string;
  public Tracker: string;
  public Activity: string;
  public Summary: string;
  public submitdata: Isavedata;
  public submitdatalist = new Array();
  public UserID: Number = 30;
  public Logdate = new Date();
  public ChangedTotime = new Date();
  public errorMessage: string;
  public Username: string;
  public PBINO: string;
  public maticon: string;
  public RegionId: string;
  public ProjectID: string;
  public TrackerID: string;
  public ModuleID: string;
  public status: string;
  public ActivityID: string;
  public SummaryId: string;
  public Taskstatusid: string;

  public modulemodel: string = "";
  public hideevent: Boolean;
  public Copydata: ICopydata;
  public Bgcolordate: any;
  public WorkingHours: string;
public Enableedit:Boolean;
  public Addhours: Date;
  public Totalhours: string;
  public Changedtimefromatted: string;
  selectedRowIndex: number = -1;
  selection = new SelectionModel<ITimesheetdetails>(true, []);
  public searchValue: string;
  public UserDate: string;
  constructor(
    public TimesheetentryService: TimesheetentryService,
    public datePipe: DatePipe,
    public snackBar: MatSnackBar,
    public spinner: NgxSpinnerService,
    public UserService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.UserDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.initialize();
    this.clearsubmitdata();
    this.getEmployeeTimeSheetdetails();
    this.clearpastedata();
    this.Username = this.UserService.EMPName;
    this.empName = this.UserService.EMPTeam;
    console.log(this.viewDate);
  }
  /***************************************** */
  getEmployeeTimeSheetdetails() {
    debugger
    this.paginator.pageIndex = 0;
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.TimesheetentryService.getUserTimesheetdetails(this.UserService.EMPID, this.UserDate).subscribe((data: ITimesheetMasterdetails) => {
      debugger
      this.TimesheetMasterdetails = data;
      this.EmployeeDetails = data[0];
   
      if (this.EmployeeDetails != undefined) {
        this.WorkingHours = this.EmployeeDetails[0].WorkingHours;
        this.Totalhours = this.EmployeeDetails[0].TotalEmpWorking;
        this.Enableedit=this.EmployeeDetails[0].EnableEditing;
      }
      else {
        this.WorkingHours = "Not Punched";
        this.Totalhours = "Not Punched";
      }
      
      // if(this.Enableedit==true){
      this.Timesheetdata = data[1];

      // if (this.Timesheetdata != undefined) {
      //   let indexposition = this.Timesheetdata.findIndex(x => x.IsEditable == true && (x.Status == "Work" || x.Status == "Work From Home"));
      //   for (let i = indexposition; i >= 0; i--) {
      //     if (i >= 0) {
      //       this.Timesheetdata[i].editpermission = true;
      //       if (indexposition == 0 && this.Timesheetdata[indexposition].IsEditable == true) {
      //         this.Timesheetdata[i].maticon = "";
      //       }
      //       else {
      //         if (this.Timesheetdata[i].IsEditable == false) {
      //           this.Timesheetdata[i].maticon = "description";
      //           this.Timesheetdata[i].tooltipcopy = "Copy";
      //         }

      //       }

      //       // if(indexposition>0){
      //       //   this.Timesheetdata[indexposition].maticon="file_copy";
      //       //   this.Timesheetdata[indexposition].tooltipcopy="Paste";
      //       // }
      //     }
      //   }
      // }
      if (this.Timesheetdata != undefined) {
        let indexposition = this.Timesheetdata.findIndex(x => x.IsEditable == true && (x.Status == "Work" || x.Status == "Work From Home"||x.Status=="Holiday Work"));
        for (let i = indexposition; i >= 0; i--) {
          if (i >= 0) {
            this.Timesheetdata[i].editpermission = true;
            if (indexposition == 0 && this.Timesheetdata[indexposition].IsEditable == true) {
              this.Timesheetdata[i].maticon = "";
            }
            else {
              this.Timesheetdata[i].maticon = "description";
            }
            this.Timesheetdata[i].tooltipcopy = "Copy";
            if (indexposition > 0) {
              this.Timesheetdata[indexposition].maticon = "file_copy";
              this.Timesheetdata[indexposition].tooltipcopy = "Paste and Save";
            }
          }
        }
      }
      this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    // }
    // else{
    //   this.openSnackBar("Please Complete previous date", "Close", "warning");
    // }
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.TimesheetentryService.getUserTimesheetdetails(this.UserService.EMPID, this.UserDate).subscribe((data: ITimesheetMasterdetails) => {
      debugger
      this.TimesheetMasterdetails = data;
      this.EmployeeDetails = data[0];
      this.TSData=data[1];
    }
    );
  }
 
 
  /**************************************** */
  /************************************************** */
  Copyevent(event) {
    this.clearsubmitdata();
 
    this.ProjectID = event.ProjectDescription;
    this.Copydata.ProjectDescription = event.ProjectDescription;
    this.Copydata.Activity = event.Activity;
    this.Copydata.WorkModule = event.WorkModule;
    this.Copydata.Region = event.Region;
    this.Summary = event.TaskSummary;
    this.PBINO = event.TrackerNo;
    this.Copydata.TrackerNo = event.TrackerNo;
    // this.Taskstatus.setValue(event.TaskStatus)
    this.Copydata.TaskSummary = event.TaskSummary;
    this.Fromtime = this.datePipe.transform(event.InTime, 'h:mm a');
    this.Totime = this.datePipe.transform(event.OutTime, 'h:mm a');
    this.Copydata.ProjectID = event.ProjectID;
    this.Copydata.ActivityID = event.ActivityID;
    this.Copydata.PunchID = event.PunchID;
    this.Copydata.ModuleID = event.ModuleID;
    this.Copydata.RegionID = event.RegionID;
    // this.Copydata.TaskStatusID=event.TaskStatusID;
    this.Copydata.WorkLocation = event.WorkLocation;
    this.Copydata.CreateBy = this.UserService.EMPName;
    this.Copydata.CreatedDate = event.CreatedDate;
    this.Copydata.ModifiedBy = this.UserService.EMPName;
    this.Copydata.ModifiedDate = event.ModifiedDate;
    this.Copydata.PunchDate = event.LogDate;
    this.Copydata.Status = event.Status;
    this.Copydata.CreateBy = this.UserService.EMPName;
    this.Copydata.PunchInTime = event.InTime;
    this.Copydata.PunchOutTime = event.OutTime;
    this.Copydata.WorkDate = event.LogDate;
    this.hideevent = true;
  }
  pasteevent(event,index) {
    if(this.Copydata.ModuleID!=undefined){
this.Timesheetdata[index].TaskSummary=this.Copydata.TaskSummary;
this.Timesheetdata[index].ProjectDescription=this.Copydata.ProjectDescription;
this.Timesheetdata[index].WorkModule=this.Copydata.WorkModule;
this.Timesheetdata[index].Activity=this.Copydata.Activity;
this.Timesheetdata[index].Activity=this.Copydata.Region;
this.Timesheetdata[index].TrackerNo=this.Copydata.TrackerNo;
this.submitdata.TaskSummary = this.Copydata.TaskSummary;
    this.submitdata.TrackerNo = this.Copydata.TrackerNo;
    // this.Taskstatus.setValue(event.TaskStatus)
    this.Fromtime = this.datePipe.transform(event.InTime, 'h:mm a');
    this.Totime = this.datePipe.transform(event.OutTime, 'h:mm a');
    this.submitdata.FromTime = event.InTime;
    this.submitdata.ToTime = event.OutTime;
    this.submitdata.WorkEntryID = 0;
    this.submitdata.EmployeeID = this.UserService.EMPID;
    this.submitdata.PunchID = event.PunchID;
    this.submitdata.PunchDate = event.LogDate;
    this.submitdata.PunchInTime = event.InTime;
    this.submitdata.PunchOutTime = event.OutTime;
    this.submitdata.WorkDate = event.LogDate;
    // this.submitdata.TaskStatusID="";
    this.submitdata.WorkLocation = event.WorkLocation;
    this.submitdata.Status = event.Status;
    this.submitdata.SprintNo = "36A";
    this.submitdata.ModifiedBy = this.UserService.EMPName;
    this.submitdata.CreatedDate = event.CreatedDate;
    this.submitdata.ModifiedDate = event.ModifiedDate;
    this.submitdata.PunchDate = event.LogDate;
    this.submitdata.CreateBy = this.UserService.EMPName;
    this.submitdata.ProjectID = this.Copydata.ProjectID;
    this.submitdata.ActivityID = this.Copydata.ActivityID;
    this.submitdata.ModuleID = this.Copydata.ModuleID;
    this.submitdata.RegionID = this.Copydata.RegionID;
    this.hideevent = true;
    this.submit();


    }
  }
  /*********************************************************** */

  /************************************** */
  openSnackBar(message: string, action: string, messagetype: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = [messagetype + '-class'];
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }
  /**************************************************** */

  Selecteddate(event, selectdate) {
    this.Fromtime = "";
    this.Totime = "";
    if (this.currentdate > selectdate || this.currentdate == selectdate) {
      let c = event.srcElement.setAttribute("style", "background-color: #33b9b680");
      let A = event.srcElement;
      if (this.Bgcolordate != undefined) {
        this.Bgcolordate.setAttribute("style", "background-color: white");
      }
      this.spinner.show();
      this.UserDate = this.datePipe.transform(selectdate, 'yyyy-MM-dd');
      this.getEmployeeTimeSheetdetails();
      this.changedatecell(A);
    }
    else {
      this.openSnackBar("Invalid date", "Close", "warning");
    }
  }

  changedatecell(srcelement) {
    this.Bgcolordate = srcelement;
  }
  onchange(event, index, OutTime, inputcontrol) {
    var validformat = OutTime.viewModel.indexOf(":");
    var matchesCount = OutTime.viewModel.split(":").length - 1;
    if (validformat > 0 && matchesCount == 1) {
      if (OutTime.viewModel.length >= 0) {
        var charlength = OutTime.viewModel;
        charlength = charlength.replace("AM", "");
        charlength = charlength.replace(/\s/g, "");
        charlength = charlength.split(":");
        var Frstcharval = charlength[0];
        var last2 = OutTime.viewModel.slice(-2);
        if (last2 == "PM" && Frstcharval < 12) {
          Frstcharval = Frstcharval + 12;
        }
        let outime = Number(charlength[0]);
        charlength = charlength[1].length;
      }
      if (charlength > 1) {
        let orftme = this.Timesheetdata[index].OutTime.split(':');
        var aorftme = orftme[2];
        let checkouttimeformat = new Date(event.OutTime);
        let Hours = checkouttimeformat.getHours();
        if (Hours >= 12 && Frstcharval > 12) {
          this.ChangedTotime = OutTime.viewModel;
          let Addtime = '12:00:00';
          let Getselectedtime = this.ChangedTotime.toString().replace("PM", "").split(':');
          if (Getselectedtime[2] == null) {
            var seconds = (+Getselectedtime[0]) * 60 * 60 + (+Getselectedtime[1]) * 60;
          }
          else {
            seconds = (+Getselectedtime[0]) * 60 * 60 + (+Getselectedtime[1]) * 60 + (+Getselectedtime[2]);
          }
          let setAddtime = Addtime.split(':');
          let seconds2 = (+setAddtime[0]) * 60 * 60 + (+setAddtime[1]) * 60 + (+setAddtime[2]);
          var date = new Date(1970, 0, 1);
          date.setSeconds(seconds + seconds2);
          var Formattedtimevalue = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
          this.Changedtimefromatted = this.datePipe.transform(event.OutTime, 'yyyy-MM-dd' + 'T' + Formattedtimevalue);
        }
        else {
          this.ChangedTotime = OutTime.viewModel;
          Formattedtimevalue = this.ChangedTotime.toString();
          if (Hours >= 10) {
            Formattedtimevalue = Formattedtimevalue.replace("PM", "");
            Formattedtimevalue = Formattedtimevalue.replace("AM", "");
            Formattedtimevalue = Formattedtimevalue.replace(/\s/g, "");
            Formattedtimevalue = Formattedtimevalue + ':' + aorftme;
            this.Changedtimefromatted = this.datePipe.transform(event.OutTime, 'yyyy-MM-dd' + 'T' + Formattedtimevalue);
          }
          else {
            Formattedtimevalue = Formattedtimevalue.replace("AM", "");
            Formattedtimevalue = Formattedtimevalue.replace("PM", "");
            Formattedtimevalue = Formattedtimevalue.replace(/\s/g, "");
            Formattedtimevalue = Formattedtimevalue + ':' + aorftme;
            this.Changedtimefromatted = this.datePipe.transform(event.OutTime, 'yyyy-MM-dd' + 'T0' + Formattedtimevalue);
          }
        }
        let beforetodate = this.datePipe.transform(event.InTime, 'yyyy-MM-dd')
        var dateObj = new Date(beforetodate + '  ' + Formattedtimevalue).toJSON();
        this.cleardetails();
        this.ChangedTotime = new Date(dateObj);
        let fromatted = this.ChangedTotime.getTimezoneOffset();
        let index1 = index + 1;
        let lengthoforiginalTodata = new Date(this.TSData[this.TSData.length - 1].OutTime);
        let lengthofdatasource = this.Timesheetdata.length - 1;
        let lengthofcureentdatasource = new Date(this.Timesheetdata[this.Timesheetdata.length - 1].OutTime);
        if (lengthoforiginalTodata > this.ChangedTotime && lengthofdatasource > index) {
          let Index1dateINtime = new Date(this.Timesheetdata[index1].InTime);
          let indexdateINtime = new Date(this.Timesheetdata[index].InTime);
          let Index1dateouttime = new Date(this.Timesheetdata[index1].OutTime);
          let indexdateouttime = new Date(this.Timesheetdata[index].OutTime);
          if (this.ChangedTotime < Index1dateINtime && indexdateINtime < this.ChangedTotime && lengthofdatasource > index && indexdateouttime > this.ChangedTotime && indexdateouttime != this.ChangedTotime) {
            this.Fromtime = this.datePipe.transform(event.InTime, 'h:mm a');
            this.Totime = this.datePipe.transform(this.ChangedTotime, 'h:mm a');
            this.Timesheetdata[index].OutTime = this.Changedtimefromatted;
            this.Changeddate.InTime = this.Changedtimefromatted;
            this.Changeddate.OutTime = this.Timesheetdata[index1].InTime;
            this.Changeddate.PunchID = this.Timesheetdata[index].PunchID;
            this.Changeddate.LogDate = this.Timesheetdata[index].LogDate;
            this.Changeddate.Status = this.Timesheetdata[index].Status;
            this.Changeddate.IsEditable = this.Timesheetdata[index].IsEditable;
            this.Changeddate.WorkLocation = this.Timesheetdata[index].WorkLocation;
            this.Changeddate.CreatedDate = this.Timesheetdata[index].CreatedDate;
            this.Timesheetdata.splice(index1, 0, this.Changeddate)
            this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
            this.datasource.paginator = this.paginator;
            this.datasource.sort = this.sort;

          }
          else if (this.ChangedTotime > this.Timesheetdata[this.Timesheetdata.length - 1].OutTime) {
            alert("invalid entry");
          }
          else {
            this.Timesheetdata[index].OutTime = this.Timesheetdata[index1].InTime;
            var inputElement = <HTMLInputElement>document.getElementById(OutTime.valueAccessor._elementRef.nativeElement.id);
            inputElement.value = this.datePipe.transform(this.Timesheetdata[index].OutTime, 'h:mm a')
            this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
            this.datasource.paginator = this.paginator;
            this.datasource.sort = this.sort;

          }
        }
        else if (lengthofdatasource == index && this.ChangedTotime < lengthoforiginalTodata) {
          this.Fromtime = this.datePipe.transform(event.InTime, 'h:mm a');
          this.Totime = this.datePipe.transform(this.ChangedTotime, 'h:mm a');
          this.Changeddate.OutTime = this.Timesheetdata[index].OutTime;
          this.Timesheetdata[index].OutTime = this.Changedtimefromatted;
          this.Changeddate.InTime = this.Changedtimefromatted;
          this.Changeddate.PunchID = this.Timesheetdata[index].PunchID;
          this.Changeddate.LogDate = this.Timesheetdata[index].LogDate;
          this.Changeddate.Status = this.Timesheetdata[index].Status;
          this.Changeddate.IsEditable = this.Timesheetdata[index].IsEditable;
          this.Changeddate.WorkLocation = this.Timesheetdata[index].WorkLocation;
          this.Changeddate.CreatedDate = this.Timesheetdata[index].CreatedDate;
          this.Timesheetdata.splice(index1, 0, this.Changeddate);
          this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
        }
        else {
          if (lengthofcureentdatasource != this.ChangedTotime && lengthofcureentdatasource > this.ChangedTotime) {
            this.Fromtime = "";
            this.Totime = "";
            this.Timesheetdata[index].OutTime = this.Timesheetdata[index1].InTime;
            var inputElement = <HTMLInputElement>document.getElementById(OutTime.valueAccessor._elementRef.nativeElement.id);
            inputElement.value = this.datePipe.transform(this.Timesheetdata[index].OutTime, 'h:mm a')
            this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
            this.datasource.paginator = this.paginator;
            this.datasource.sort = this.sort;
          }
          else {
            this.Fromtime = "";
            this.Totime = "";
            let timefrmt = this.Timesheetdata[index].OutTime;
            this.Timesheetdata[index].OutTime = this.Changedtimefromatted;
            this.Timesheetdata[index].OutTime = timefrmt;
            var inputElement = <HTMLInputElement>document.getElementById(OutTime.valueAccessor._elementRef.nativeElement.id);
            inputElement.value = this.datePipe.transform(this.Timesheetdata[index].OutTime, 'h:mm a')
            this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
            this.datasource.paginator = this.paginator;
            this.datasource.sort = this.sort;
          }
        }
      }
      else {
        var inputElement = <HTMLInputElement>document.getElementById(OutTime.valueAccessor._elementRef.nativeElement.id);
        inputElement.value = this.datePipe.transform(this.Timesheetdata[index].OutTime, 'h:mm a')
        this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      }
    }
    else {
      this.Fromtime = "";
      this.Totime = "";
      let timefrmt = this.Timesheetdata[index].OutTime;
      this.Timesheetdata[index].OutTime = this.Changedtimefromatted;
      this.Timesheetdata[index].OutTime = timefrmt;
      var inputElement = <HTMLInputElement>document.getElementById(OutTime.valueAccessor._elementRef.nativeElement.id);
      inputElement.value = this.datePipe.transform(this.Timesheetdata[index].OutTime, 'h:mm a')
      this.datasource = new MatTableDataSource<ITimesheetdetails>(this.Timesheetdata);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    }



  }

  cleardetails() {
    this.Changeddate =
      {
        "WorkEntryID": 0,
        "Activity": "",
        "ActivityID": 0,
        "Selected": false,
        "PunchID": "",
        "TeamName": "",
        "DeviceID": 0,
        "UserID": "",
        "UserName": "",
        "LogDate": new Date(),
        "InTime": new Date(),
        "OutTime": new Date(),
        "ProjectDescription": "",
        "ProjectID": 0,
        "WorkModule": "",
        "ModuleID": 0,
        "Region": "",
        "RegionID": 0,
        "TaskSummary": "",
        "InTimeDisplay": "",
        "OutTimeDisplay": "",
        "LogMinutes": 0,
        "WorkEntryMinutes": 0,
        "Status": "",
        "LogHours": "",
        "HallName": "",
        "Door": "",
        "WorkLocation": "",
        "CreatedBy": "",
        "CreatedDate": new Date(),
        "ModifiedBy": "",
        "ModifiedDate": new Date(),
        "IsEditable": false,
        "editpermission": false,
        "maticon": "",
        "tooltipcopy": "",
        "TrackerNo":"",
      

      };
  }


  openentrydailog(event,index, Selectedrow) {
    debugger
    let index1=index;
    let row=Selectedrow;
    let Fromtime=this.datePipe.transform(row.InTime,'hh:mm');
    let Totime=this.datePipe.transform(row.OutTime,'hh:mm');
    let EntrydialogRef = this.dialog.open(TimesheetentryOverviewExampleDialog, {
      disableClose: true,
      width: '550px',
      data: {Fromtime:Fromtime,Totime:Totime,ActivityDetail:row.Activity,ModuleDetail:row.WorkModule,
        RegionDetail:row.Region,ProjectDetail:row.ProjectDescription,PBINO:row.TrackerNo,Tasksummary:row.TaskSummary,
      ActivityID:row.ActivityID,ModuleID:row.ModuleID,ProjectID:row.ProjectID,RegionID:row.RegionID}

    });
    EntrydialogRef.afterClosed().subscribe(result => {
      debugger
      if(EntrydialogRef.componentInstance.Validateentry==true){
      this.Timesheetdata[index1].Activity=EntrydialogRef.componentInstance.ActivityDetail.value;
      this.Timesheetdata[index1].WorkModule=EntrydialogRef.componentInstance.ModuleDetail.value;
      this.Timesheetdata[index1].Region=EntrydialogRef.componentInstance.RegionDetail.value;
      this.Timesheetdata[index1].ProjectDescription=EntrydialogRef.componentInstance.ProjectDetail.value;
      this.Timesheetdata[index1].TaskSummary=EntrydialogRef.componentInstance.Summary;
      this.Timesheetdata[index1].TrackerNo=EntrydialogRef.componentInstance.PBINO;
      this.submitdata.WorkEntryID=row.WorkEntryID;
      this.submitdata.TrackerNo=EntrydialogRef.componentInstance.PBINO;
      this.submitdata.TaskSummary=EntrydialogRef.componentInstance.Summary;
      this.submitdata.ActivityID=EntrydialogRef.componentInstance.ActivityID;
      this.submitdata.ProjectID=EntrydialogRef.componentInstance.ProjectId;
      this.submitdata.RegionID=EntrydialogRef.componentInstance.RegionID;
      this.submitdata.ModuleID=EntrydialogRef.componentInstance.ModuleID;
      this.submitdata.FromTime = row.InTime;
      this.submitdata.ToTime = row.OutTime;
      this.submitdata.EmployeeID = this.UserService.EMPID;
      this.submitdata.PunchID = row.PunchID;
      this.submitdata.PunchDate = row.LogDate;
      this.submitdata.PunchInTime = row.InTime;
      this.submitdata.PunchOutTime = row.OutTime;
      this.submitdata.WorkDate = row.LogDate;
      this.submitdata.WorkLocation = row.WorkLocation;
      this.submitdata.Status = row.Status;
      this.submitdata.SprintNo = "36A";
      this.submitdata.ModifiedBy = this.UserService.EMPName;
      this.submitdata.CreatedDate = row.CreatedDate;
      this.submitdata.ModifiedDate = row.ModifiedDate;
      this.submitdata.PunchDate = row.LogDate;
      this.submitdata.CreateBy = this.UserService.EMPName;
      this.submit();
      }

    });
  }
  /****************************************** */
 
  Assignselectedtime(event) {
    if (this.hideevent == false) {
      if (event.tooltipcopy == "Copy") {
        this.ProjectID = event.ProjectDescription;
        this.Copydata.ProjectDescription = event.ProjectDescription;
        this.Copydata.Activity = event.Activity;
        this.Copydata.WorkModule = event.WorkModule;
        this.Copydata.Region = event.Region;
        this.Summary = event.TaskSummary;
        this.PBINO = event.TrackerNo;
        this.Copydata.TrackerNo = event.TrackerNo;
        // this.Taskstatus.setValue(event.TaskStatus)
        this.Copydata.TaskSummary = event.TaskSummary;
        this.Fromtime = this.datePipe.transform(event.InTime, 'h:mm a');
        this.Totime = this.datePipe.transform(event.OutTime, 'h:mm a');
        this.Copydata.ProjectID = event.ProjectID;
        this.Copydata.ActivityID = event.ActivityID;
        this.Copydata.PunchID = event.PunchID;
        this.Copydata.ModuleID = event.ModuleID;
        this.Copydata.RegionID = event.RegionID;
        // this.Copydata.TaskStatusID=event.TaskStatusID;
        this.Copydata.WorkLocation = event.WorkLocation;
        this.Copydata.CreateBy = this.UserService.EMPName;
        this.Copydata.CreatedDate = event.CreatedDate;
        this.Copydata.ModifiedBy = this.UserService.EMPName;
        this.Copydata.ModifiedDate = event.ModifiedDate;
        this.Copydata.PunchDate = event.LogDate;
        this.Copydata.Status = event.Status;
        this.Copydata.CreateBy = this.UserService.EMPName;
        this.Copydata.PunchInTime = event.InTime;
        this.Copydata.PunchOutTime = event.OutTime;
        this.Copydata.WorkDate = event.LogDate;
        this.submitdata.ProjectID = event.ProjectID;
        this.submitdata.ActivityID = event.ActivityID;
        this.submitdata.PunchID = event.PunchID;
        this.submitdata.ModuleID = event.ModuleID;
        this.submitdata.RegionID = event.RegionID;
        this.submitdata.WorkEntryID = 0;
        this.submitdata.EmployeeID = this.UserService.EMPID;
        this.submitdata.PunchID = event.PunchID;
        this.submitdata.PunchDate = event.LogDate;
        this.submitdata.PunchInTime = event.InTime;
        this.submitdata.PunchOutTime = event.OutTime;
        this.submitdata.WorkDate = event.LogDate;
        this.submitdata.FromTime = event.InTime;
        this.submitdata.ToTime = event.OutTime;
        this.submitdata.SprintNo = "36A";
        this.submitdata.TrackerNo = this.PBINO;
        this.submitdata.TaskSummary = this.Summary;
        this.submitdata.Remarks = this.Summary;
        this.submitdata.WorkLocation = event.WorkLocation;
        this.submitdata.CreateBy = this.UserService.EMPName;
        this.submitdata.CreatedDate = event.CreatedDate;
        this.submitdata.ModifiedBy = this.UserService.EMPName;
        this.submitdata.ModifiedDate = event.ModifiedDate;
        this.submitdata.Status = event.Status;
        this.submitdata.WorkEntryID = event.WorkEntryID;

      }
      else {
        this.selectedRowIndex = event.InTime;
        this.Fromtime = this.datePipe.transform(event.InTime, 'h:mm a')
        this.Totime = this.datePipe.transform(event.OutTime, 'h:mm a')
        this.submitdata.WorkEntryID = 0;
        this.submitdata.EmployeeID = this.UserService.EMPID;
        this.submitdata.PunchID = event.PunchID;
        this.submitdata.PunchDate = event.LogDate;
        this.submitdata.PunchInTime = event.InTime;
        this.submitdata.PunchOutTime = event.OutTime;
        this.submitdata.WorkDate = event.LogDate;
        this.submitdata.FromTime = event.InTime;
        this.submitdata.ToTime = event.OutTime;
        this.submitdata.SprintNo = "36A";
        this.submitdata.TrackerNo = this.PBINO;
        this.submitdata.TaskSummary = this.Summary;
        this.submitdata.Remarks = this.Summary;
        this.submitdata.WorkLocation = event.WorkLocation;
        this.submitdata.CreateBy = this.UserService.EMPName;
        this.submitdata.CreatedDate = event.CreatedDate;
        this.submitdata.ModifiedBy = this.UserService.EMPName;
        this.submitdata.ModifiedDate = event.ModifiedDate;
        this.submitdata.Status = event.Status;
      }
    }
    this.hideevent = false;
  }
  /********************************* */
  clearCopydata() {
    this.RegionId = "";
    this.ProjectID = "";
    this.TrackerID = "";
    this.ModuleID = "";
    this.ActivityID = "";
    this.SummaryId = "";
    // this.Taskstatusid="";
  }

  /*************************************************************** */
  submit() {
    debugger
    // this.submitdata.TaskSummary = this.Summary;
    // this.submitdata.TrackerNo = this.PBINO;
    if (this.submitdata.TaskSummary == "") {
      this.openSnackBar("Enter Summary", "Close", "warning");
    }
    else if (this.submitdata.ActivityID == 0) {
      this.openSnackBar("Select Activity", "Close", "warning");
    } else if (this.submitdata.ProjectID == 0) {
      this.openSnackBar("Select Project Description", "Close", "warning");
    }
    else if (this.submitdata.ModuleID == 0) {
      this.openSnackBar("Select Module", "Close", "warning");
    }
    else if (this.submitdata.RegionID == 0) {
      this.openSnackBar("Select Region", "Close", "warning");
    }
    else {
      this.detaildatasource = new MatTableDataSource<Isubmitdata>(this.submitdatalist);
      if (this.submitdata.WorkEntryID == 0) {
        this.spinner.show();
        this.TimesheetentryService.Savetimesheetdetails(this.submitdata)
          .subscribe(result => {
            let Successmsg = result.Status;
            if (Successmsg == "Successfully saved") {
              this.clearsubmitdata();
              this.initialize();
              this.getEmployeeTimeSheetdetails();
              setTimeout(() => {
              }, 500);
            }
            this.openSnackBar("Submitted Successfully", "Close", "success");
          },
            error => {
              this.errorMessage = <any>error
              alert(this.errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
            },
          );
      }
      else {
        this.spinner.show();
        this.TimesheetentryService.Updatetimesheetdetails(this.submitdata)
          .subscribe(result => {
            let Successmsg = result.Status;
            if (Successmsg == "Success") {
              this.clearsubmitdata();
              this.initialize();
              this.getEmployeeTimeSheetdetails();
              setTimeout(() => {
              }, 500);
              this.openSnackBar("Updated Successfully", "Close", "success");
            }

          },
            error => {
              this.errorMessage = <any>error
              alert(this.errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
            },
          );
      }
    }
  }
  clearsubmitdata() {
    this.submitdata = {
      "WorkEntryID": 0,
      "EmployeeID": 0,
      "PunchID": "",
      "PunchDate": new Date(),
      "PunchInTime": new Date(),
      "PunchOutTime": new Date(),
      "WorkDate": new Date(),
      "FromTime": new Date(),
      "ToTime": new Date(),
      "ProjectID": 0,
      "ModuleID": 0,
      "SprintNo": "",
      "TrackerNo": "",
      "ActivityID": 0,
      "TaskSummary": "",
      "RegionID": 0,
      "Remarks": "",
      "WorkLocation": "",
      "CreateBy": "",
      "CreatedDate": new Date(),
      "ModifiedBy": "",
      "ModifiedDate": new Date(),
      "Status": "",
      "TaskStatusID": 0,
    }
  }
  initialize() {
    this.Fromtime = "";
    this.Totime = "";
    this.project = "";
    this.Tracker = "";
    this.Activity = "";
    this.Summary = "";
  }
  clearpastedata() {
    this.Copydata = {
      "WorkEntryID": 0,
      "EmployeeID": 0,
      "PunchID": "",
      "PunchDate": new Date(),
      "PunchInTime": new Date(),
      "PunchOutTime": new Date(),
      "WorkDate": new Date(),
      "FromTime": new Date(),
      "ToTime": new Date(),
      "ProjectID": 0,
      "ModuleID": 0,
      "SprintNo": "",
      "TrackerNo": "",
      "ActivityID": 0,
      "TaskSummary": "",
      "RegionID": 0,
      "Remarks": "",
      "WorkLocation": "",
      "CreateBy": "",
      "CreatedDate": new Date(),
      "ModifiedBy": "",
      "ModifiedDate": new Date(),
      "Status": "",
      "ProjectDescription": "",
      "Activity": "",
      "WorkModule": "",
      "Region": ""
    }
  }

}
@Component({
  selector: 'empprof-dialog',
  templateUrl: 'Timesheetfieldentry.dailog.html',
})
export class TimesheetentryOverviewExampleDialog {
  public ProjectCollection: IMasterdetails[];
  public Activitycollection: IMasterdetails[];
  public Modulecollection: IMasterdetails[];
  public Regioncollection: IMasterdetails[];
  public Taskstatuscollection: IMasterdetails[];
  public ProjectDetail = new FormControl();
  public ActivityDetail = new FormControl();
  public RegionDetail = new FormControl();
  public ModuleDetail = new FormControl();
  public Taskstatus = new FormControl();
  public projectcollectionfilter: Observable<any[]>;
  public Activitycollectionfilter: Observable<any[]>;
  public modulecollectionfilter: Observable<any>;
  public Regioncollectionfilter: Observable<any[]>;
  public Taskstatuscollectionfiter: Observable<any[]>;
  public ActivityID:Number=this.data.ActivityID;
  public ModuleID:Number=this.data.ModuleID;
  public ProjectId:Number=this.data.ProjectID;
  public RegionID:Number=this.data.RegionID;
  public Validateentry:Boolean;
  public errorMessage: string;
  public Summary: string=this.data.Tasksummary;
  public PBINO: string=this.data.PBINO;
  constructor(public TimesheetentryService: TimesheetentryService,
    public datePipe: DatePipe,
    public snackBar: MatSnackBar,
    public spinner: NgxSpinnerService,
    public EntrydialogRef: MatDialogRef<TimesheetentryOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  public Fromtime: string=this.data.Fromtime;
  public Totime: string=this.data.Totime;

  onclose(): void {
    this.Validateentry=false;
    this.EntrydialogRef.close();
  }

  ngOnInit() {
    debugger
    this.ActivityDetail.setValue(this.data.ActivityDetail);
    this.ProjectDetail.setValue(this.data.ProjectDetail);
    this.ModuleDetail.setValue(this.data.ModuleDetail);
    this.RegionDetail.setValue(this.data.RegionDetail);
this.getProjectdetails();
this.getActivitydetails();
this.getWorkModule();
this.getregion();
  }
  getProjectdetails() {
    let Projecttype = "ProjectDescription";
    this.TimesheetentryService.getMasterdata(Projecttype)
      .subscribe((data: IMasterdetails[]) => {
        this.ProjectCollection = data;
        this.projectcollectionfilter = this.ProjectDetail.valueChanges
          .pipe(
            startWith(''),
            map(Description => Description ? this.filterprojectdetails(Description) : this.ProjectCollection.slice())
          );
      },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        });
  }
  filterprojectdetails(Description: string) {
    return this.ProjectCollection.filter(project =>
      project.Description.toLowerCase().indexOf(Description.toLowerCase()) === 0);
  }
  /*********************************************************** */
  getActivitydetails() {
    let Activitytype = "Activity";
    this.TimesheetentryService.getMasterdata(Activitytype)
      .subscribe(data => {
        this.Activitycollection = data;
        this.Activitycollectionfilter = this.ActivityDetail.valueChanges
          .pipe(
            startWith(''),
            map(Description => Description ? this.filteractivitydetails(Description) : this.Activitycollection.slice())
          );
      },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        });
  }

  filteractivitydetails(Description: string) {
    return this.Activitycollection.filter(Activity =>
      Activity.Description.toLowerCase().indexOf(Description.toLowerCase()) === 0);
  }
  getWorkModule() {
    let moduletype = "WorkModule";
    this.TimesheetentryService.getMasterdata(moduletype)
      .subscribe(data => {
        this.Modulecollection = data;
        this.modulecollectionfilter = this.ModuleDetail.valueChanges
          .pipe(
            startWith(''),
            map(Description => Description ? this.filtermoduledetails(Description) : this.Modulecollection.slice())
          );
      },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        });
  }

  filtermoduledetails(Description: string) {
    return this.Modulecollection.filter(Module =>
      Module.Description.toLowerCase().indexOf(Description.toLowerCase()) === 0);
  }
  /************************************************* */
  getregion() {
    let regiontype = "Region";
    this.TimesheetentryService.getMasterdata(regiontype)
      .subscribe(data => {
        this.Regioncollection = data;
        this.Regioncollectionfilter = this.RegionDetail.valueChanges
          .pipe(
            startWith(''),
            map(Description => Description ? this.filterregiondetails(Description) : this.Regioncollection.slice())
          );
      },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        });
  }
  filterregiondetails(Description: string) {
    return this.Regioncollection.filter(Region =>
      Region.Description.toLowerCase().indexOf(Description.toLowerCase()) === 0);
  }
  /**************************************************** */
  getTaskstatus() {
    let TaskStatus = "TaskStatus";
    this.TimesheetentryService.getMasterdata(TaskStatus)
      .subscribe(data => {
        this.Taskstatuscollection = data;
        this.Taskstatuscollectionfiter = this.Taskstatus.valueChanges
          .pipe(
            startWith(''),
            map(Description => Description ? this.filterTaskdetails(Description) : this.Taskstatuscollection.slice())
          );
      },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        });
  }
  filterTaskdetails(Description: string) {
    return this.Regioncollection.filter(Region =>
      Region.Description.toLowerCase().indexOf(Description.toLowerCase()) === 0);
  }
  changeregion(event) {
    this.RegionID=event.Code;
  }
  changeActivity(event) {
  this.ActivityID=event.Code;
  }
  changemodule(event) {
    this.ModuleID=event.Code;
  }
  changeproject(event) {
    this.ProjectId=event.Code;
  }
  changeTaskstatus(event) {
    // this.submitdata.TaskStatusID=event.Code;
  }
  Clearformdata() {
    this.Fromtime = "";
    this.Totime = "";
    this.ActivityDetail.setValue('');
    this.RegionDetail.setValue('');
    this.ModuleDetail.setValue('');
    this.ProjectDetail.setValue('');
    this.Summary = "";
    // this.Taskstatus.setValue('');
    this.PBINO = "";
  }
  Submit(){
if(this.RegionID!=undefined&&this.ActivityID!=undefined
  &&this.ModuleID!=undefined&&
  this.ProjectId&&this.Summary!=""&&this.PBINO!=""){
    this.Validateentry=true;
    this.EntrydialogRef.close();
}
  }
}

