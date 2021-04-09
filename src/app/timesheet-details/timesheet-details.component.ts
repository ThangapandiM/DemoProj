import { Component, OnInit,ViewChild } from '@angular/core';
import{TimesheetdetailService} from './timesheet-details.service';
import{ITimesheetDetails} from './Timesheetdetails.interface'
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawerToggleResult } from '@angular/material';
import { getLocaleDateFormat, DatePipe } from '@angular/common';
import{ExcelService} from '../excelservice/excelservice';
import { UserService } from '../users/user.service';
@Component({
  selector: 'app-timesheet-details',
  templateUrl: './timesheet-details.component.html',
  styleUrls: ['./timesheet-details.component.scss'],
  providers: [DatePipe]
})
export class TimesheetDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  TimesheetDetails:ITimesheetDetails[];
  displayedColumns = ['DeptCode','ProjectName','RecordDate','Recorder','Subject','SystemName','TimeSheetType','WorkType','WorkingHours'];
  datasource = new MatTableDataSource();
  constructor(public TimesheetdetailService:TimesheetdetailService,public spinner:NgxSpinnerService,
    public datePipe : DatePipe,public ExcelService:ExcelService,public UserService:UserService) { }
  ngOnInit() {
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
    this.getTimesheetdetails();
  }
  public FromDateValidate: string;
  public FromDate: string;
  public ToDate: string;
  public OnFromDateChange() {
    this.FromDateValidate = this.FromDate;
    // console.log("Selected From Date =>", this.FromDate);
  }
  public OnFromDtChangeClear(event) {
    debugger
    var frmtdTodate=new Date(this.ToDate);
    //var frmtdTodate=new Date();
   if(event>frmtdTodate){
    this.ToDate = "";
   }
    
  }
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
  getTimesheetdetails(){
    debugger
    let Month="0";
    let Year="0";

    let Fdate=new Date(this.FromDate);
    let Tdate=new Date(this.ToDate);
    this.FromDate=this.datePipe.transform(Fdate,'yyyy-MM-dd');
    this.ToDate=this.datePipe.transform(Tdate,'yyyy-MM-dd');
    this.spinner.show();
    this.TimesheetdetailService.getTimesheetdetails(Month,Year,this.FromDate,this.ToDate,this.UserService.EMPCode).
    subscribe((data:ITimesheetDetails[])=>{
      debugger
      this.TimesheetDetails=data;
      this.datasource=new MatTableDataSource<ITimesheetDetails>(this.TimesheetDetails);
      this.datasource.paginator=this.paginator;
      this.datasource.sort=this.sort;
    },
    error => alert('Error: ' + <any>error));
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  GoSearch(){
    this.getTimesheetdetails();
  }
  exportAsXLSX():void {
    this.ExcelService.exportAsExcelFile(this.datasource.data, this.UserService.EMPName);
  }
}
