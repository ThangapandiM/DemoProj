import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { MatPaginator, MatSort, MatTableDataSource, MatDrawerToggleResult } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { IMasterDetail, IEmpLeaveDetails, IDeleteLeaveDetail, IDeleteResult, IForgetDetails, ICardDeleteResult, ICardDeleteDetail, IStatusTypes, IEmployeeDetails, ITeamNames, ILeaveType, IRowcount } from '../detailed-grid/detailed-grid.interface';
import { EMPDetailedGridDetailService } from '../detailed-grid/detailed-grid.service';
import { UserService } from '../users/user.service';
import { getLocaleDateFormat, DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { TeamDashboardService } from '../team-dashboard/team-dashboard.service';
import { LeaveApprovalService } from '../leaveapproval/leaveapproval.service';
import { LeaveEntryService } from '../leave-entry/leave-entry.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-detailed-grid',
  templateUrl: './detailed-grid.component.html',
  styleUrls: ['./detailed-grid.component.css'],
  providers: [DatePipe]
})
export class DetailedGridComponent implements OnInit {
  public MasterDetails: IMasterDetail[];
  public LeaveDetails: IEmpLeaveDetails[];
  public DeleteLeaveDetail: IDeleteLeaveDetail;
  public DeleteResult: IDeleteResult;
  public CardDeleteResult: ICardDeleteResult;
  public LeaveTypeDetails: ILeaveType[];
  public StatusTypeDetails: IStatusTypes[];
  public Rowcount:IRowcount[];
  public Status: string = "All";
  public Leavedata: any;
  public DeleteLeave: boolean;
  public validationMessage: string;
  public Cancelledreason: string = "Leave cancelled";
  public CancelledLeaveID: number;
  public CancelledFlag: boolean = true;
  filteredOptions: Observable<any[]>;
  public EmployeeDetails: IEmployeeDetails[];
  public EmployeeFilter: IEmployeeDetails[];
  public TeamDetails: ITeamNames[];
  EmpNamefilteredOptions: Observable<any[]>;
  TeamfilteredOptions: Observable<any[]>;
  EmployeeName = new FormControl();
  public DefaultEmpName: string;
  public DefaultTeamName: string;
  public EMPCode: string = "0";
  public TeamID: any = 0;
  public FromDate: string;
  public ToDate: string;
  public Empcodefliter: string = "";
  public EmpTeamnamefliter: string = "";
  public errorMessage: any;
  toppings = new FormControl();
  panelOpenState = false;
  public StatusString: string = "";
  public TeamString: string = "";
  public LeaveTypeString: string = "";
  public TeamFilterString: string = "";
  public IsObjload: boolean = false;
  public TeamNameArray = new Array();
  public StatusArray = new Array();
  public LTypeArray = new Array();
  public FromDateValidate: string;
  public totalLength:number;
  public From:number=1;
  public CTO:number=10;
  public pageSize=20;
  limit:number=10;
  skip:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [5, 10,25] ;
  // displayedColumns = ['TName', 'DFrom', 'LType', 'LDays', 'LHours', 'TotalYear', 'LStatus','LReason', 'LApprovedBy', 'LDelete'];
  displayedColumns = ['TName', 'DFrom', 'LType', 'TotalYear', 'LStatus', 'LReason', 'LApprovedBy', 'LDelete'];
  datasource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(public DetailedGridService: EMPDetailedGridDetailService,
    public userService: UserService, public snackBar: MatSnackBar, public dialog: MatDialog,
    public LeaveApprovalService: LeaveApprovalService, public TeamDashboardService: TeamDashboardService,
    public datePipe: DatePipe, public LeaveEntryService: LeaveEntryService, private spinner: NgxSpinnerService) {
  }

  //Leave Cancel------------
  openCancelDialog(Leave: any): void {
    let CanceldialogRef = this.dialog.open(CancelDialogOverviewExampleDialog, {
      disableClose: true,
      width: '250px',
      data: { Reason: this.Cancelledreason }

    });
    CanceldialogRef.afterClosed().subscribe(result => {
      this.Cancelledreason = result;
      this.DeleteLeaveDetail.Remarks = this.Cancelledreason;
      this.DeleteLeaveDetail.Flag = true;
      this.DeleteLeaveDetail.LeaveID = Leave.LeaveID;
      this.DeleteLeaveDetail.EMPCODE = this.userService.EMPCode;
      if (this.Cancelledreason != "" && Boolean(this.Cancelledreason) != false) {
        this.CancelLeave();
      }
      else {
        this.validationMessage = "No Action Taken!"
        this.openSnackBar(this.validationMessage, "Close", "warning");
      }
      this.Cancelledreason = "Leave cancelled";
    });
  }

  //Open forgetcard details
  openForgetcarddetailDialog(): void {
    let ForgetcarddetaildialogRef = this.dialog.open(ForgetcardDetailDialogOverviewExampleDialog, {
      disableClose: true,
      width: '600px',
    });
  }
  ngOnInit() {
    //this.spinner.show();  1
    var currentdate = new Date();
    currentdate.setDate(currentdate.getDate() - 30).toString();
    this.FromDate = currentdate.toISOString();
    this.ToDate = new Date().toISOString();
    /** Validation Start */
    this.FromDateValidate = this.FromDate;
    if (this.ToDate != '') {
      let currentdt = new Date(this.FromDate);
      currentdt.setDate(currentdt.getDate() - 1).toString();
      this.FromDateValidate = currentdt.toISOString();
      console.log("ngOnInit FromDateValidate =>", this.FromDateValidate)
    }
    /** Validation End */
    this.ClearEntry();
    this.GoSearch();
    this.GetEmployeeLeaveExample()
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 500); //2
  }
  GetEmployeeLeaveExample() {
    this.DetailedGridService.GetEmployeeLeaveDtlsExample().subscribe(res => {
      // console.log("ressss =>", res);
      // console.log("HttpStatusCode =>", res[0].status);
      // console.log("HttpStatusText =>", res[0].json.statusText);
    });
  }

  public OnFromDateChange() {
    this.FromDateValidate = this.FromDate;
    // console.log("Selected From Date =>", this.FromDate);
  }
  public OnFromDtChangeClear(event) {
    var frmtdTodate=new Date(this.ToDate);
    //var frmtdTodate=new Date();
   if(event>frmtdTodate){
    this.ToDate = "";
   }
    
  }


  filterNames(name: string) {
    return this.EmployeeDetails.filter(empName =>
      empName.EMPName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  //Employee Change event------------------------
  EmployeeChange(EName: string) {

    this.spinner.show();
    this.EmployeeFilter = this.EmployeeDetails.filter(empName =>
      empName.EMPName.toLowerCase().indexOf(EName.toLowerCase()) === 0);
    this.EMPCode = this.EmployeeFilter[0].EMPCODE;
    this.Empcodefliter = this.EmployeeFilter[0].EMPName;
    this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  changePage(event){
if(event.pageIndex==0){
  this.From=event.pageIndex+1;  
}
else{
  this.From=event.pageIndex*event.pageSize+1;
}

this.CTO=this.From+event.pageSize-1;
this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }
  //Get Employee Leave Details----------------------
  GetEmployeeLeaves(Loggeduser, FromDate, ToDate, Empcode, TeamID: string, LeaveType, LeaveStatus) {
    this.spinner.show();
    if (FromDate != "") {
      FromDate = this.datePipe.transform(FromDate, 'yyyy-MM-dd');
    }
    if (ToDate != "") {
      ToDate = this.datePipe.transform(ToDate, 'yyyy-MM-dd');
    }

    this.DetailedGridService.GetEmployeeLeaveDetails(Loggeduser, FromDate, ToDate, Empcode, TeamID, LeaveType, LeaveStatus,this.From,this.CTO)
      .subscribe((data: IMasterDetail) => {
        this.LeaveDetails = data.LeaveDetails;
       // this.EmployeeDetails = data.EmployeeDetails;
        // if (this.Empcodefliter == "" || this.Empcodefliter == "ALL") {
        //   this.Empcodefliter = this.EmployeeDetails[0].EMPName
        // }
        // if (this.EMPCode == '0') {
        //   this.EMPCode = this.EmployeeDetails[0].EMPCODE;
        // }
        if(this.EmployeeDetails==undefined){
          this.EmployeeDetails = data.EmployeeDetails;
            this.EmpNamefilteredOptions = this.EmployeeName.valueChanges
              .pipe(
                startWith(''),
                map(empName => empName ? this.filterNames(empName) : this.EmployeeDetails.slice())
              );
        }
        if (this.IsObjload == true) {
         if(this.TeamString==undefined){
            this.TeamDetails = data.TeamDetails;
          }
          if(this.StatusTypeDetails==undefined){
            this.StatusTypeDetails = data.StatusTypeDetails;
          }
          if(this.LeaveTypeDetails==undefined){
            this.LeaveTypeDetails = data.LeaveTypeDetails;
          }
        }
        this.IsObjload = false
        this.datasource = new MatTableDataSource(this.LeaveDetails);
        this.Rowcount=data.Leavecount;
        this.totalLength=this.Rowcount[0].TCount;
        this.datasource.sort = this.sort;
        this.spinner.hide();
      },
        error => alert('Error: ' + <any>error));
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  //Get Employee Name details for filter----------------------------
  GetEmployeeNamedetails(Loggeduser, FromDate, ToDate, Empcode, TeamID: string, LeaveType, LeaveStatus) {
    this.spinner.show();
    this.DetailedGridService.GetEmployeeLeaveDetails(Loggeduser, FromDate, ToDate, Empcode, TeamID, LeaveType, LeaveStatus,this.From,this.CTO)
      .subscribe((data: IMasterDetail) => {
        this.EmployeeDetails = data.EmployeeDetails;
        this.Empcodefliter = this.EmployeeDetails[0].EMPName
        this.EMPCode = this.EmployeeDetails[0].EMPCODE;
        this.EmpNamefilteredOptions = this.EmployeeName.valueChanges
          .pipe(
            startWith(''),
            map(empName => empName ? this.filterNames(empName) : this.EmployeeDetails.slice())
          );
      },
        error => alert('Error: ' + <any>error));
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  //Clear Details----------------------------------------------
  ClearEntry() {
    this.DeleteLeaveDetail =
      {
        "LeaveID": 0,
        "EMPCODE": this.userService.EMPCode,
        "Remarks": "",
        "Flag": false,

      };
  }
  //Leave Type change event----------------------------------------
  LTypeChanges(LTypes: any) {
    const index: number = this.LTypeArray.indexOf(LTypes.LeaveTypeID);
    if (index !== -1) {
      this.LTypeArray.splice(index, 1);
    }
    else
      this.LTypeArray.push(LTypes.LeaveTypeID)
    this.LeaveTypeString = ""
    this.LTypeArray.forEach(data => {
      if (this.LeaveTypeString.length == 0) {
        this.LeaveTypeString = data;
      }
      else {
        this.LeaveTypeString = this.LeaveTypeString + "," + data
      }

    })
    this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }

  //Team Name change event----------------------------------------
  TNameChanges(TNames: any) {
    const index: number = this.TeamNameArray.indexOf(TNames.TeamID);
    if (index !== -1) {
      this.TeamNameArray.splice(index, 1);
    }
    else
      this.TeamNameArray.push(TNames.TeamID)
    this.TeamString = ""
    this.TeamNameArray.forEach(data => {
      if (this.TeamString.length == 0) {
        this.TeamString = data;
      }
      else {
        this.TeamString = this.TeamString + "," + data
      }

    })
    this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }

  //Status Type change event----------------------------------------
  StatusChanges(STypes: any) {
    const index: number = this.StatusArray.indexOf(STypes.StatusID);
    if (index !== -1) {
      this.StatusArray.splice(index, 1);
    }
    else
      this.StatusArray.push(STypes.StatusID)
    this.StatusString = ""
    this.StatusArray.forEach(data => {
      if (this.StatusString.length == 0) {
        this.StatusString = data;
      }
      else {
        this.StatusString = this.StatusString + "," + data
      }
    })
    this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }

  //Leave cancel event----------------------------------------
  CancelLeave() {
    this.spinner.show();
    this.DetailedGridService.DeleteLeaveDetail(this.DeleteLeaveDetail)
      .subscribe(
        result => {
          this.DeleteResult = <IDeleteResult>result
          this.validationMessage = this.DeleteResult.Description;
          if (this.DeleteResult.Status.toUpperCase() == "SUCCESS") {
            this.openSnackBar(this.validationMessage, "Close", 'success');
          }
          else {
            this.openSnackBar(this.validationMessage, "Close", 'error');
          }
          this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
          this.Cancelledreason = "Leave cancelled";
          this.ClearEntry();
        });
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  //Grid Search Event------------------------------------------------
  GoSearch() {
    if (this.FromDate == null) {
      this.FromDate = "";
    }
    if (this.ToDate == null) {
      this.ToDate = "";
    }
    if (this.FromDate != "" && this.FromDate != null) {
      if (this.ToDate == "") {
        this.validationMessage = "Please select To Date for Search.";
        this.openSnackBar(this.validationMessage, "Close", 'error');
        return false;
      }
    }
    this.IsObjload = true
    this.GetEmployeeLeaves(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }
  //Open filter event---------------------------------------------------
  openNav() {
    var sidenav = document.getElementById('sidenadiv');
    var detailgriddiv = document.getElementById('detailgriddiv');
    var filterbtn = document.getElementById('filterbtn');
    var closebtn = document.getElementById('closebtn');
    sidenav.style.width = "250px";
    sidenav.style.top = "70px";
    sidenav.style.overflow = "auto";
    detailgriddiv.style.marginLeft = "200px";
    document.body.style.backgroundColor = "white";
    filterbtn.style.display = "none";
    closebtn.style.display = "block";
  }
  //Close filter Event------------------------------------
  closeNav() {
    var sidenav = document.getElementById('sidenadiv');
    var detailgriddiv = document.getElementById('detailgriddiv');
    var filterbtn = document.getElementById('filterbtn');
    var closebtn = document.getElementById('closebtn');
    sidenav.style.width = "0px";
    sidenav.style.top = "0px";
    sidenav.style.overflow = "auto";
    detailgriddiv.style.marginLeft = "0px";
    document.body.style.backgroundColor = "white";
    filterbtn.style.display = "block";
    closebtn.style.display = "none";
  }
  //Validation message show------------------------------------
  openSnackBar(message: string, action: string, messagetype: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = [messagetype + '-class'];
    config.duration = 8000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }
  Cancelbtn(Leave: any) {
    if ((Leave.EMPID == this.userService.EMPID) && (Leave.LeaveStatusID == 1)) {
      return true
    }
    else if ((Leave.LeaveStatusID == 2 && this.userService.EMPTypeID != 1 && Leave.EMPID != this.userService.EMPID)) {
      return true;
    }
    else {
      return false;
    }

  }
}

@Component({
  selector: 'Cancel-dialog',
  templateUrl: 'Cancel-dialog.html',
  styleUrls: ['Cancel.dialog.css']
})
export class CancelDialogOverviewExampleDialog {

  constructor(
    public CanceldialogRef: MatDialogRef<CancelDialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.CanceldialogRef.close();
  }

}
@Component({
  selector: 'Forgetcard-detail',
  templateUrl: 'Forgetcard-detail.html',
  styleUrls: ['./Forgetcard-detail.css']
})
export class ForgetcardDetailDialogOverviewExampleDialog {
  displayedColumns = ['ID', 'Employee', 'CardNo', 'Date', 'Remarks', 'LDelete'];
  datasource = new MatTableDataSource();
  public Status: string = "All"
  public CardDeleteDetail: ICardDeleteDetail;
  public CardDeleteResult: any;
  public cardvalidationmsg: string = ""
  public CardID: any;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public ForgetcarddetaildialogRef: MatDialogRef<ForgetcardDetailDialogOverviewExampleDialog>,
    public DetailedGridService: EMPDetailedGridDetailService,
    public dialog: MatDialog,
    public userService: UserService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.CardDeleteDetail =
      {
        "UniqueID": ""
      }
  }

  onNoClick(): void {
    this.ForgetcarddetaildialogRef.close();
  }

  ngOnInit() {
    this.GetForgetcarddetail();
  }
  openDeleteDialog(Leave: any): void {

    this.CardDeleteDetail.UniqueID = Leave.UniqueID
    this.DetailedGridService.DeleteCardDetail(this.CardDeleteDetail)
      .subscribe(
        result => {
          this.CardDeleteResult = <ICardDeleteResult>result
          this.GetForgetcarddetail();
          this.cardvalidationmsg = this.CardDeleteResult.Description;
          this.openSnackBar(this.cardvalidationmsg, "Close");
          this.GetForgetcarddetail();
        }
      )

  }
  GetForgetcarddetail() {
    this.DetailedGridService.GetForgetcarddetails(this.userService.EMPCode)
      .subscribe((data: IForgetDetails[]) => {
        this.datasource = new MatTableDataSource(data);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      },
        error => alert('Error: ' + <any>error));
  }
  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = ['custom-class'];
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }



}