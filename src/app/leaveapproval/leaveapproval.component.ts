import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, fadeInContent } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { IEmpLeaveDetails, IEMPLeaveApprovalDetails, IEmployeeDetails, ITeamNames, IMasterDetail, IStatusTypes, ILeaveType ,IMGAttachment,IRowcount} from '../leaveapproval/leaveapproval.Interface';
import { LeaveApprovalService } from '../leaveapproval/leaveapproval.service';
import { UserService } from '../users/user.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TeamDashboardService } from '../team-dashboard/team-dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { getLocaleDateFormat, DatePipe } from '@angular/common';
import { MasterTabsService } from '../master-tabs/master-tabs.service';
import { ImasterTabs } from '../master-tabs/master-tabs.interface';
import { ResponseContentType, Http } from '../../../node_modules/@angular/http';
import { LeavemanagementserviceConfig } from '../leavemanagement.serviceconfig';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawerToggleResult } from '@angular/material';
import { ILeaveDetail } from '../leave-entry/Leave-entry.Interface';
import { json } from 'd3';

@Component({
  selector: 'app-leaveapproval',
  templateUrl: './leaveapproval.component.html',
  styleUrls: ['./leaveapproval.component.css'],
  providers: [DatePipe]
})
export class LeaveapprovalComponent implements OnInit {
  public MastertabDetails: ImasterTabs[];
  // public MastertabDetails: any;
  public MasterDetails: IMasterDetail[];
  public LeaveDetails: IEmpLeaveDetails[];
  EmpLeaveApprovalDetails: IEMPLeaveApprovalDetails;
  AllEmpLeaveApprovalDetails: IEMPLeaveApprovalDetails[];
  Allselecteddata: IEMPLeaveApprovalDetails;
  public LeaveTypeDetails: ILeaveType[];
  public StatusTypeDetails: IStatusTypes[];
  public errorMessage: any;
  public approvereason: string = "Approved";
  public rejectreason: string = "Rejected";
  public myDate: string = new Date().toISOString();
  public isPermission: boolean = false;
  public validationMessage: string;
  public btnflag: boolean = false;
  EmpNamefilteredOptions: Observable<any[]>;
  TeamfilteredOptions: Observable<any[]>;
  public EmployeeDetails: IEmployeeDetails[];
  public EmployeeFilter: IEmployeeDetails[];
  public TeamDetails: ITeamNames[];
  public DefaultEmpName: string;
  public EMPCode: string = "0";
  EmployeeName = new FormControl();
  TeamName = new FormControl();
  ALRemarks = new FormControl();
  RemarksValue = new FormControl();
  public EmpNametext: string = "";
  public Empcodefliter: string = "";
  public EmpTeamnamefliter: string = "";
  public TeamID: any = 0;
  public SelectedName: string;
  public Icon: boolean = true;
  public RoutingEmpID: string = "";
  public RoutingTeamname: string = "";
  public RoutingEMPName: string = "";
  public backbtnflag: boolean = false;
  public FromDate: string;
  public ToDate: string;
  public StatusString: string = "";
  public TeamString: string = "";
  public LeaveTypeString: string = "";
  public TeamFilterString: string = "";
  public IsObjload: boolean = false;
  public TeamNameArray = new Array();
  public EmpLeaveApprovalDetailslist = new Array();
  public DupDatasource=new Array();
  public StatusArray = new Array();
  public LTypeArray = new Array();
  public HolidayWorkReason: Boolean;
  public OverrideApproval: Boolean = false;
  public SetIsException: Boolean = false;
  public OverrideApprovalvalue: Boolean;
  public Approvalvalue: any = 0;
  public MenuName: string = "";
  public isChecked: boolean = false;
  public Isshowexception: Boolean;
  public url: string;
  public Leavecard: boolean = true;
  public leavedetailgrid: boolean;
  public gridshow: boolean;
  public SelectedRow: boolean = false;
  public disableFlag: Boolean = false;
  public HideBulkAppbutton:boolean=false;
  public Overallselect:boolean=true;
  public Checkedall:Boolean=false;
  public paginateshow:Boolean=false;
  public From:number=0;
  public CTO:number=0;
  public totalLength:number;
  limit:number=10;
  skip:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [5, 10,25] ;
  public Rowcount:IRowcount[];
  displayedColumns = ['select', 'EMPName', 'TeamName', 'LeaveType', 'NoofdaysApplied', 'PermissionsTaken', 'LeaveRemarks', 'LeaveFromDate', 'LeaveToDate', 'EmpRemarks'];
  datasource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(public MasterTabsService: MasterTabsService,
    public LeaveApprovalService: LeaveApprovalService,
    public dialog: MatDialog,
    public userService: UserService,
    public ngProgress: NgProgress,
    public snackBar: MatSnackBar,
    public TeamDashboardService: TeamDashboardService,
    private router: Router, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private http: Http
  ) {
    this.EmployeeDetails = [
      {

        "EMPID": 0,
        "EMPCODE": "",
        "EMPName": "",
        "TeamID": "",
        "TeamName": ""
      }
    ]

  }
  ///Leave Approval------------
  openApproveDialog(Leave: any): void {
   let ApprovedialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      disableClose: true,
      width: '250px',
      data: { Reason: Leave.LeaveType + '  ' + this.approvereason }

    });
    ApprovedialogRef.afterClosed().subscribe(result => {
      this.approvereason = result;
      this.EmpLeaveApprovalDetails.LeaveApproval = true;
      this.EmpLeaveApprovalDetails.LeaveApproveRemarks = this.approvereason;
      this.EmpLeaveApprovalDetails.LeaveApprovedBy = this.userService.EMPCode;
      this.EmpLeaveApprovalDetails.LeaveID = Leave.LeaveID;
      this.EmpLeaveApprovalDetails.IsException = Leave.IsException;
    //   let indexof=this.LeaveDetails.findIndex(x=>x.LeaveID==Leave.LeaveID);
    //  this.LeaveDetails.splice(indexof, 1);
    //   this.datasource=new MatTableDataSource<IEmpLeaveDetails>(this.LeaveDetails);
    //   if(this.LeaveDetails.length==0){
    //     if(this.leavedetailgrid==true){
    //     this.Overallselect=true;
    //     this.paginateshow=false;
    //     this.HideBulkAppbutton=false;
    //   }
    //   }
    //   else{
    //     if(this.leavedetailgrid==true){
    //     this.Overallselect=false;
    //     this.paginateshow=true;
    //     this.HideBulkAppbutton=true;
    //   }
    //   }
      console.log("openApproveDialog =>", this.EmpLeaveApprovalDetails);
      if (this.approvereason != "" && Boolean(this.approvereason) != false) {
        let index1 = this.LeaveDetails.findIndex(d => d.CreatedOn == Leave.CreatedOn);
        this.LeaveDetails.splice(index1, 1);
        this.SaveLeave();
      }
      else {
        this.validationMessage = "No Action Taken!"
        this.openSnackBar(this.validationMessage, "Close", "warning");
      }
      this.approvereason = "Approved";
    });
 
  }


  openbulkApproveDialog(event): void {
    let allApprovedialogRef = this.dialog.open(BulkapproveDialogOverviewExampleDialog, {
      disableClose: true,
      width: '250px',
      data: { Reason: event.EmpRemarks }

    });
    allApprovedialogRef.afterClosed().subscribe(result => {
      let index1 = this.LeaveDetails.findIndex(x => x.LeaveID == event.LeaveID);
      if (index1 >= 0) {
        this.LeaveDetails[index1].EmpRemarks = allApprovedialogRef.componentInstance.Remarks;
        this.datasource = new MatTableDataSource<IEmpLeaveDetails>(this.LeaveDetails);
this.datasource.paginator=this.paginator;
this.datasource.sort=this.sort;
        let index2 = this.EmpLeaveApprovalDetailslist.findIndex(x => x.LeaveID == event.LeaveID)
        if (index2 >= 0) {
          this.EmpLeaveApprovalDetailslist[index2].LeaveApproveRemarks = allApprovedialogRef.componentInstance.Remarks;
        }

      }

    });
  }
  //open Emp prof
  openempprofDialog(event): void {
    let allApprovedialogRef = this.dialog.open(empprofOverviewExampleDialog, {
      disableClose: true,
      width: '250px',
      data: { EMPImgAttachment: event.EMPImgAttachment, EMPName: event.EMPName, EMPCODE: event.EMPCode, TeamName: event.TeamName, Gender: event.Gender, EMPType: event.EMPType }
    });
    allApprovedialogRef.afterClosed().subscribe(result => {


    });
  }
  ///Leave Rejection------------
  openRejectDialog(Leave: any): void {
   let RejectdialogRef = this.dialog.open(RejectDialogOverviewExampleDialog, {
      disableClose: true,
      width: '250px',
      data: { Reason: Leave.LeaveType + '  ' + this.rejectreason }
    });

    RejectdialogRef.afterClosed().subscribe(result => {
      this.rejectreason = result;
      this.EmpLeaveApprovalDetails.LeaveApproval = false;
      this.EmpLeaveApprovalDetails.LeaveApproveRemarks = this.rejectreason;
      this.EmpLeaveApprovalDetails.LeaveApprovedBy = this.userService.EMPCode;
      this.EmpLeaveApprovalDetails.LeaveID = Leave.LeaveID;
      // let indexof=this.LeaveDetails.findIndex(x=>x.LeaveID==Leave.LeaveID);
      // this.LeaveDetails= this.LeaveDetails.splice(indexof, 1);
      // this.datasource.data.splice(indexof,1);
      // if(this.LeaveDetails.length==0){
      //   this.Overallselect=true;
      //   this.paginateshow=false;
      //   this.HideBulkAppbutton=false;

      // }
      // else{
      //   this.Overallselect=false;
      //   this.paginateshow=true;
      //   this.HideBulkAppbutton=true;
      // }
      this.EmpLeaveApprovalDetails.IsException = Leave.Isexception;
      if (this.rejectreason != "" && Boolean(this.rejectreason) != false) {
        let index1 = this.LeaveDetails.findIndex(d => d.CreatedOn == Leave.CreatedOn);
        this.LeaveDetails.splice(index1, 1);
        this.SaveLeave();
      }
      else {
        this.validationMessage = "No Action Taken!"
        this.openSnackBar(this.validationMessage, "Close", "warning");
      }
      this.rejectreason = "Rejected";
    });
  }

  IsAllSelected(event) {
    this.EmpLeaveApprovalDetailslist=[];
    if (event.checked) {
      this.datasource.data.forEach(function (e) {
        if (typeof e === "object") {
          e["SelectedRow"] = true;
        }
      });
      if(this.DupDatasource[0]==undefined){
        this.DupDatasource.push(this.datasource);
      }
     
      if (this.datasource.data.length > 0) {
        for (let i = 0; i < this.datasource.data.length; i++) {
          this.Allselecteddata.LeaveApproval = true;
          let Approved = "Approved";
          let C="";
          this.Allselecteddata.IsException=null;
         
          this.Allselecteddata.LeaveApproveRemarks = this.LeaveDetails[i].EmpRemarks;
          this.Allselecteddata.LeaveApprovedBy = this.userService.EMPCode;
          this.Allselecteddata.LeaveID = this.LeaveDetails[i].LeaveID;
          this.Allselecteddata.Status = "";
          this.Allselecteddata.Description = "";
          this.EmpLeaveApprovalDetailslist.push(this.Allselecteddata);
          this.savedata();
          this.EmpLeaveApprovalDetailslist
        }
      }

    }
    else {
      this.datasource.data.forEach(function (e) {
        if (typeof e === "object") {
          e["SelectedRow"] = false;
        }
      });
      this.disableFlag = false;
      this.EmpLeaveApprovalDetailslist=[];
    }

  }
  Lselectedrow(row) {
    if(this.DupDatasource[0]==undefined){
      this.datasource.data.forEach(function (e) {
        if (typeof e === "object") {
          e["SelectedRow"] = false;
        }
      });
      this.DupDatasource.push(this.datasource);
    }
  
    let leaveid = this.EmpLeaveApprovalDetailslist.filter(x => x.LeaveID == row.LeaveID)[0];
    if (leaveid == undefined) {
      this.Allselecteddata.LeaveApproval = true;
      this.Allselecteddata.IsException=null;
      let Approved = "Approved";
      this.Allselecteddata.LeaveApproveRemarks = row.EmpRemarks;
      this.Allselecteddata.LeaveApprovedBy = this.userService.EMPCode;
      this.Allselecteddata.LeaveID = row.LeaveID;
      this.Allselecteddata.Status = "";
      this.Allselecteddata.Description = "";
      this.EmpLeaveApprovalDetailslist.push(this.Allselecteddata);
      this.savedata();
      this.EmpLeaveApprovalDetailslist;
      var idexofdatasource=this.DupDatasource[0].data.findIndex(x=>x.LeaveID==row.LeaveID);
      this.DupDatasource[0].data[idexofdatasource].SelectedRow=true;
      this.DupDatasource[0].data[idexofdatasource].LeaveApproval=true;
    }
    else if (leaveid != undefined) {
      const index = this.EmpLeaveApprovalDetailslist.findIndex(x => x.LeaveID === row.LeaveID);
      this.EmpLeaveApprovalDetailslist.splice(index, 1);
      this.Checkedall=false;
     idexofdatasource=this.DupDatasource[0].data.findIndex(x=>x.LeaveID==row.LeaveID);
      this.DupDatasource[0].data[idexofdatasource].SelectedRow=false;
      this.DupDatasource[0].data[idexofdatasource].LeaveApproval=false;
    }
  
  //  this.datasource.data[0].SelectedRow="false";
 let Fndvalue=this.DupDatasource[0].data.findIndex(x => x.SelectedRow ==false);
 if(Fndvalue!=undefined && Fndvalue>=0){
  this.Checkedall=false;
 }
 else{
  this.Checkedall=true;
 }
  }
  Reject() {
    if (this.EmpLeaveApprovalDetailslist.length > 0) {
      for (var i in this.EmpLeaveApprovalDetailslist) {
        this.EmpLeaveApprovalDetailslist[i].LeaveApproval = false;
        let LeaveID = this.EmpLeaveApprovalDetailslist[i].LeaveID;
        this.EmpLeaveApprovalDetailslist[i].LeaveApproveRemarks = this.LeaveDetails.filter(x => x.LeaveID == LeaveID)[0].EmpRemarks;
      }
      this.SaveAllLeave();
    }
    else
    {
      this.validationMessage="Please Select the Leave(s) to Reject "
      this.openSnackBar(this.validationMessage, "Close", 'error');
    }

  }
  Approve() {
    if (this.EmpLeaveApprovalDetailslist.length > 0) {
      for (var i in this.EmpLeaveApprovalDetailslist) {
        this.EmpLeaveApprovalDetailslist[i].LeaveApproval = true;
        let LeaveID = this.EmpLeaveApprovalDetailslist[i].LeaveID;
        this.EmpLeaveApprovalDetailslist[i].LeaveApproveRemarks = this.LeaveDetails.filter(x => x.LeaveID == LeaveID)[0].EmpRemarks;
      }
      this.SaveAllLeave();
    }
    else
    {
      this.validationMessage="Please Select the Leave(s) to Approve "
      this.openSnackBar(this.validationMessage, "Close", 'error');
    }

  }
  mouseLeave(event) {
    if (event.LeaveID != "") {
      let index1 = this.LeaveDetails.findIndex(x => x.LeaveID == event.LeaveID);
      if (this.ALRemarks.value != null) {
        this.LeaveDetails[index1].EmpRemarks = this.ALRemarks.value;
        let index2 = this.EmpLeaveApprovalDetailslist.findIndex(x => x.LeaveID == event.LeaveID)
        this.EmpLeaveApprovalDetailslist[index2].EmpRemarks = this.ALRemarks.value;
      }
    }
  }
  Overrideapproval() {
    this.MasterTabsService.GetMasterTabDetails(this.userService.EMPCode)
      .subscribe(data => {
        this.MastertabDetails = data;
        if (this.MastertabDetails.find(x => x.MenuName == 'LeaveApproval') && this.MastertabDetails.find(x => x.CanOverRideApproval == 1)) {
          this.OverrideApproval = true;
        }
        if (this.MastertabDetails.find(x => x.MenuName == 'LeaveApproval') && this.MastertabDetails.find(x => x.SetIsException == 1)) {
          this.SetIsException = true;
        }

      });
  }
  paginationshow(){
    if(this.HideBulkAppbutton==true){
      
    }
  }
  ngOnInit() {
          
    this.datasource.paginator =this.paginator;
    this.spinner.show();
    this.Overrideapproval()
    this.FromDate = new Date().toISOString();
    this.ToDate = new Date().toISOString();
    this.RoutingTeamname = this.route.snapshot.paramMap.get("TeamName");
    this.RoutingEmpID = this.route.snapshot.paramMap.get("EMPCode");
    this.RoutingEMPName = this.route.snapshot.paramMap.get("EMPName");
    if ((this.RoutingEMPName != null) && (this.RoutingTeamname != null)) {
      this.backbtnflag = true;
      this.Empcodefliter = this.RoutingEMPName;
      this.EmpTeamnamefliter = this.RoutingTeamname;
    }
    this.cleardetails();
    this.savedata();
    this.GoSearch();
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
    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }

  //Get Leave Details------------------------------------------------
  GetEmployeeLeaveDetails(Loggeduser, FromDate, ToDate, Empcode, TeamID: string, LeaveType, LeaveStatus) {
    this.spinner.show();
    if (FromDate != "") {
      FromDate = this.datePipe.transform(FromDate, 'yyyy-MM-dd');
    }
    if (ToDate != "") {
      ToDate = this.datePipe.transform(ToDate, 'yyyy-MM-dd');
    }
    this.LeaveApprovalService.getEmployeeLeaveDetails(Loggeduser, FromDate, ToDate, Empcode, TeamID, LeaveType, LeaveStatus, this.Approvalvalue,this.From,this.CTO)
      .subscribe((data: IMasterDetail) => {
        this.LeaveDetails = data.LeaveDetails;
        this.Checkedall=false;
        if (this.LeaveDetails) {
          if (this.LeaveDetails.length > 0) {
            this.Overallselect=false;
            for (let i = 0; i < this.LeaveDetails.length; i++) {
              this.LeaveDetails[i].EmpRemarks = this.LeaveDetails[i].LeaveType + " " + "Approved"
            }
            this.datasource = new MatTableDataSource<IEmpLeaveDetails>(this.LeaveDetails);
            this.datasource.data.forEach(function (e) {
              if (typeof e === "object") {
                e["SelectedRow"] = false;
              }
            });
    
            this.Rowcount=data.Leavecount;
            this.totalLength=this.Rowcount[0].TCount;
            this.datasource.sort = this.sort;
            this.HideBulkAppbutton=true;
            this.EmpLeaveApprovalDetailslist=[];
          }
        }
        else{
          this.datasource=new MatTableDataSource<IEmpLeaveDetails>(this.LeaveDetails);
          this.HideBulkAppbutton=false;
          this.Overallselect=true;
       }
        this.EmployeeDetails = data.EmployeeDetails;
        this.HolidayWorkReason = true;
        if (this.Empcodefliter == "" || this.Empcodefliter == "ALL") {
          this.Empcodefliter = this.EmployeeDetails[0].EMPName
        }
        if (this.EMPCode == '0') {
          this.EMPCode = this.EmployeeDetails[0].EMPCODE;
        }
        this.EmpNamefilteredOptions = this.EmployeeName.valueChanges
          .pipe(
            startWith(''),
            map(empName => empName ? this.filterNames(empName) : this.EmployeeDetails.slice())
          );
        if (data.TeamDetails!=null) {
          if(this.TeamString==""){
            this.TeamDetails = data.TeamDetails;
          }
          if(this.LeaveTypeString==""){
            this.StatusTypeDetails = data.StatusTypeDetails;
          }
          if(this.LeaveTypeString==""){
            this.LeaveTypeDetails = data.LeaveTypeDetails;
          }
          
        }
      },
        error => alert('Error: ' + <any>error));
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
    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
      }
  //Employee change event-----------------------------------
  EmployeeChange(EName: string) {
    this.spinner.show();
    this.EmployeeFilter = this.EmployeeDetails.filter(empName =>
      empName.EMPName.toLowerCase().indexOf(EName.toLowerCase()) === 0);
    this.EMPCode = this.EmployeeFilter[0].EMPCODE;
    this.Empcodefliter = this.EmployeeFilter[0].EMPName;
    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
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

    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
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
    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }
  //Isexception Leave checked
  ExceptionValue(event, Leave) {
    console.log("IsException Check=>", event.checked);
    Leave.IsException = event.checked;
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
    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
  }

  filterNames(name: string) {
    return this.EmployeeDetails.filter(empName =>
      empName.EMPName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  gridTogglechange() {
    this.spinner.show();
    if (this.gridshow == true) {
      this.Leavecard = false;
      this.leavedetailgrid = true;
      this.From=1;
      this.CTO=10;
      this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
      this.paginateshow=true;
    }
    else {
      this.Leavecard = true;
      this.leavedetailgrid = false;
      this.paginateshow=false;
      this.From=0;
      this.CTO=0;
      this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);


    }
    if(this.LeaveDetails){
      if(this.LeaveDetails.length==0){
      if(this.leavedetailgrid==true){
      this.Overallselect=true;
      this.paginateshow=false;
      this.HideBulkAppbutton=false;
    }
  }
    
    else{
      if(this.leavedetailgrid==true){
      this.Overallselect=false;
      this.paginateshow=true;
      this.HideBulkAppbutton=true;
    }
    }
  }
    this.spinner.hide();
  }
  Togglechange() {
    this.spinner.show();
    if (this.OverrideApprovalvalue == true) {
      this.Approvalvalue = 1;
    }
    else {
      this.Approvalvalue = 0;
    }

    

    this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
    
  }
  //Open filter event---------------------------------------------------
  openNav() {
    var sidenav = document.getElementById('sidenadiv');
    var detailgriddiv = document.getElementById('detailgriddiv');
    var filterbtn = document.getElementById('filterbtn');
    var closebtn = document.getElementById('closebtn');
    sidenav.style.width = "280px";
    sidenav.style.top = "90px";
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

  SaveLeave() {
    this.spinner.show();
    this.EmpLeaveApprovalDetails;
    console.log("SaveLeave =>", this.EmpLeaveApprovalDetails)
    //this.EmpLeaveApprovalDetails.IsException=this.isChecked;
    this.LeaveApprovalService.CommitLeave(this.EmpLeaveApprovalDetails)
      .subscribe(
        result => {
          this.EmpLeaveApprovalDetails = <IEMPLeaveApprovalDetails>result
          this.validationMessage = this.EmpLeaveApprovalDetails.Description;
          if (this.EmpLeaveApprovalDetails.Status.toUpperCase() == "SUCCESS") {
            this.openSnackBar(this.validationMessage, "Close", 'success');
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          }
          else {
            this.openSnackBar(this.validationMessage, "Close", 'error');
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          }
          this.approvereason = "Approved";
          this.rejectreason = "Rejected";
          this.cleardetails();
          this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
        },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        },
      )
  }
  SaveAllLeave() {
    this.spinner.show();
    this.LeaveApprovalService.CommitAllLeave(this.EmpLeaveApprovalDetailslist)
      .subscribe(
        result => {
          this.disableFlag=false;
          this.AllEmpLeaveApprovalDetails = <IEMPLeaveApprovalDetails[]>result
          this.validationMessage = this.AllEmpLeaveApprovalDetails[0].Description;
          if (this.EmpLeaveApprovalDetails.Status.toUpperCase() == "SUCCESS") {
            this.openSnackBar(this.validationMessage, "Close", 'success');
            setTimeout(() => {

            }, 500);
          }
          else {
            this.openSnackBar(this.validationMessage, "Close", 'error');
            setTimeout(() => {

            }, 500);
          }
          this.approvereason = "Approved";
          this.rejectreason = "Rejected";
          this.cleardetails();
          this.From=1;
          this.CTO=5;
          this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
          // this.GetEmployeeLeaveDetails(this.userService.EMPCode, this.FromDate, this.ToDate, this.EMPCode, this.TeamString, this.LeaveTypeString, this.StatusString);
        },
        error => {
          this.errorMessage = <any>error
          alert(this.errorMessage);
        },

      )
  }
  cleardetails() {
    this.EmpLeaveApprovalDetails =
      {
        "LeaveApproval": false,
        "LeaveApproveRemarks": "",
        "LeaveApprovedBy": 0,
        "LeaveID": 0,
        "Status": "",
        "Description": "",
        "IsException": false
      };
  }
  savedata() {
    this.Allselecteddata =
      {
        "LeaveApproval": false,
        "LeaveApproveRemarks": "",
        "LeaveApprovedBy": 0,
        "LeaveID": 0,
        "Status": "",
        "Description": "",
        "IsException": false
      };
  }
  openSnackBar(message: string, action: string, messagetype: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = [messagetype + '-class'];
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }


  GetEmployeeNamedetails(EMPCode) {
    this.spinner.show();
    this.LeaveApprovalService.getEmployeeNameDetails(EMPCode)
      .subscribe((data: IEmployeeDetails[]) => {
        this.EmployeeDetails = data;
        this.EmployeeDetails.splice(0, 1);
        //this.EMPCode = this.EmployeeDetails[0].EMPCODE;
        this.EmpNamefilteredOptions = this.EmployeeName.valueChanges
          .pipe(
            startWith(''),
            map(empName => empName ? this.filterNames(empName) : this.EmployeeDetails.slice())
          );
      }, error => this.errorMessage = <any>error);
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  backClicked() {
    this.spinner.show();
    window.history.back();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }


  public DownloadFile(leaveDtl) {
    try {
      this.http.get(LeavemanagementserviceConfig.APIUrl + '/Employee/GetAttachmentDetails?LeaveID=' + leaveDtl.LeaveID + '', {
        responseType: ResponseContentType.Blob
      }).map(res => {
        console.log("Download File View =>", JSON.stringify(res));
        return {
          filename: leaveDtl.FileName,
          data: res.blob()
        };
      }).subscribe(res => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });

    } catch (error) {

    }
  }
}

@Component({
  selector: 'approve-dialog',
  templateUrl: 'approve-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public ApprovedialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.ApprovedialogRef.close();
  }
}

@Component({
  selector: 'reject-dialog',
  templateUrl: 'reject-dialog.html',
})
export class RejectDialogOverviewExampleDialog {
  constructor(
    public RejectdialogRef: MatDialogRef<RejectDialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.RejectdialogRef.close();
  }

}
@Component({
  selector: 'Bulkapprove-dialog',
  templateUrl: 'Bulkapprove-dialog.html',
})
export class BulkapproveDialogOverviewExampleDialog {
  constructor(
    public bulkRejectdialogRef: MatDialogRef<BulkapproveDialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  public Remarks = this.data.Reason
  onNoClick(): void {
    if (this.Remarks != "") {
      this.bulkRejectdialogRef.close();
    }
  }
  onclose(): void {
    this.Remarks = this.data.Reason
    this.bulkRejectdialogRef.close();

  }

}
@Component({
  selector: 'empprof-dialog',
  templateUrl: 'Emp.profile.html',
})
export class empprofOverviewExampleDialog {

  constructor(
      public LeaveApprovalService: LeaveApprovalService,private spinner: NgxSpinnerService,
      public empprofdialogRef: MatDialogRef<empprofOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     }
  public EMPImgAttachment :string;
  public EMPCode = this.data.EMPCODE;
  public TeamName = this.data.TeamName;
  public EMPType = this.data.EMPType;
  public disableEMPCode: boolean = true;
  public disableEMPMailID: boolean = true;
  public EMPName = this.data.EMPName;
  public errorMessage: any;
  onclose(): void {
    this.empprofdialogRef.close();
  }
  prfimgclass() {
    if (this.EMPImgAttachment== "" ||this.EMPImgAttachment== undefined && this.data.Gender == "M") {
      this.EMPImgAttachment = "/assets/images/Male.png";
    }
    else if (this.EMPImgAttachment== ""||this.EMPImgAttachment== undefined && this.data.Gender == "F") {
      this.EMPImgAttachment = "/assets/images/Female.png";

    }
    console.log(this.EMPImgAttachment);
  }
  ngOnInit(){
    this.spinner.show();
this.LeaveApprovalService.GetemployeeIMG(this.EMPCode).
subscribe((data:any)=>{
  if(data)
  {
  this.EMPImgAttachment=data[0].EMPImgAttachment;
  this.prfimgclass()
  }
},
error => this.errorMessage = <any>error);
setTimeout(() => {
  this.spinner.hide();
}, 500);
  }
  
}

