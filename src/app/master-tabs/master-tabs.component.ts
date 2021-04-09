import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../users/user.service';
import { Router } from '@angular/router';
import { MasterTabsService } from '../master-tabs/master-tabs.service';
import { ImasterTabs } from '../master-tabs/master-tabs.interface';
import { MatTabChangeEvent } from '@angular/material';
import { AppComponent } from '../app.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { EmpRegistrationComponent } from '../empregistration/empregistration.component';

import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../shared/app.constant';

@Component({
  selector: 'app-master-tabs',
  templateUrl: './master-tabs.component.html',
  styleUrls: ['./master-tabs.component.css']
})
export class MasterTabsComponent implements OnInit {
  public MasterTabData: ImasterTabs[];
  public IsDashboardVisible: boolean = false;
  public IsOdcLeadDashboardVisible: boolean = false;
  public IsHrDashboardVisible: boolean = false;
  public IsLeaveapprovalVisible: boolean = false;
  public IsLeaveEntryVisible: boolean = false;
  public IsDetailedGridVisible: boolean = false;
  public IsHolidayVisiable: boolean = false;
  public ReportsVisible: boolean = false;
  public MenuName: any;
  public showchildroute: boolean;
  public IsErrorVisible: boolean = false;
  public themevisible: boolean = true;
  public DashboadDispalyname: string = "";
  public ODCLeadDashboardDispalyname: string = "";
  public HRDashboardDispalyname: string = "";
  public LeaveEntryDispalyname: string = "";
  public LeaveApprovalDispalyname: string = "";
  public DetailedGridDispalyname: string = "";
  public HolidayDispalyname: string = "";
  public Homepageurl: string
  public ReportsDisplayname: string = "";
  public url: string;
  public EmpImgDtl: any = {};
public IsTimsheetentry:Boolean;
  public IsEmployeeListVisible: boolean = false;
  public EmployeeListDispalyName: string = "";
  public IsReports:Boolean;
  public IsTimsheetDetail:boolean;

  constructor(public userService: UserService, public dialog: MatDialog, public MasterService: MasterTabsService, private router: Router, public appComponent: AppComponent, private spinner: NgxSpinnerService, private LocalStorageService: LocalStorageService) {
    {
      this.showchildroute = false;
    }
  }
  ngOnInit() {
    this.spinner.show();
    this.MasterService.GetMasterTabDetails(this.userService.EMPCode)
      .subscribe(data => {
        var i;
        for (i = 0; i < data.length; i++) {
          if (data[i].EMPImgName != '' && i != 0) {
            this.LocalStorageService.clearAllItem();
            this.url = data[i].EMPImgAttachment;
            /**get and set employee img details for global use. */
            this.EmpImgDtl.ImgName = data[i].EMPImgName;
            this.EmpImgDtl.ImgAttachment = data[i].EMPImgAttachment;
            this.LocalStorageService.addItem(AppConstant.LOCALSTORAGE.EMP_IMG_DTL, this.EmpImgDtl);
            //  console.log("Employee Img Dtls =>",JSON.stringify(this.LocalStorageService.getItem(AppConstant.LOCALSTORAGE.EMP_IMG_DTL)));
            /**get and set employee img details for global use. */
          }
          if (data[i].MenuName == "Dashboard") {
            this.IsDashboardVisible = true;
            this.DashboadDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "ODCLeadDashboard") {
            this.IsOdcLeadDashboardVisible = true;
            this.ODCLeadDashboardDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "HRDashboard") {
            this.IsHrDashboardVisible = true;
            this.HRDashboardDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "LeaveEntry") {
            this.IsLeaveEntryVisible = true;
            this.IsTimsheetentry=true;
            this.IsReports=true;
            this.IsTimsheetDetail=true;
            this.LeaveEntryDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "LeaveApproval") {
            this.IsLeaveapprovalVisible = true;
            this.LeaveApprovalDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "DetailedGrid") {
            this.IsDetailedGridVisible = true;
            this.DetailedGridDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "HolidayWork") {
            this.IsHolidayVisiable = true;
            this.HolidayDispalyname = data[i].DisplayMenuName;
          }
          else if (data[i].MenuName == "EmployeeList") {
            this.IsEmployeeListVisible = true;
            this.EmployeeListDispalyName = data[i].DisplayMenuName;
            
          }
          else if (data[i].MenuName == "HomePage") {
            this.Homepageurl = data[i].URL;
          }

        }
      })
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  Profile() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.height = '600px';
    dialogConfig.width = '450px';
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(EmpRegistrationComponent, dialogConfig);
  }
  SignOut() {
    this.userService.signOut();
    this.LocalStorageService.clearAllItem();
  }
  Goto() {
    this.router.navigate(['authenticated/' + this.Homepageurl]);
  }
  onLinkClick(event: MatTabChangeEvent) {
    this.showchildroute = true;
    if (event.tab.textLabel == "Dashboard") {
      this.router.navigate(['authenticated/Dashboard']);
    }
    else if (event.tab.textLabel == "ODCLeadDashboard") {
      this.router.navigate(['authenticated/ODCLeadDashboard']);
    }
    else if (event.tab.textLabel == "HRdashboard") {
      this.router.navigate(['authenticated/HRDashboard']);
    }

    else if (event.tab.textLabel == "LeaveApproval") {
      this.router.navigate(['authenticated/LeaveApproval']);
    }
    else if (event.tab.textLabel == "LeaveEntry") {
      this.router.navigate(['authenticated/LeaveEntry', event.tab.textLabel]);
    }
    else if (event.tab.textLabel == "LeaveDetail") {
      this.router.navigate(['authenticated/LeaveDetail']);
    }
    else if (event.tab.textLabel == "HoliDayWork") {
      this.router.navigate(['authenticated/HoliDayWork', event.tab.textLabel]);
    }
    else if (event.tab.textLabel == "EmployeeList") {
      this.router.navigate(['authenticated/', event.tab.textLabel]);
    }
    else if(event.tab.textLabel=="TimesheetEntry"){
      this.router.navigate(['authenticated/Timesheetentry', event.tab.textLabel]);
    }
    else if(event.tab.textLabel=="Reports"){
      this.router.navigate(['authenticated/Report/EmployeeLeaveSummaryReport', event.tab.textLabel]);
    }
    else if(event.tab.textLabel=="TimesheetDetail"){
      this.router.navigate(['authenticated/Timesheetdetail',event.tab.textLabel])
    }
  }
}

