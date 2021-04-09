import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import * as c3 from 'c3';
import * as d3 from 'd3';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx'
import { UserService } from '../users/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ITeamWiseDetail, IEmpLeaveDetails, IEMPLeaveApprovalDetails } from '../management-dashboard/management-dashboard.interface';
import { ManagementDashboardService } from '../management-dashboard/management-dashboard.service';
import { MonthFilterPipe } from '../employee-dashboard/employee-dashboard-pipefilter'
import { MatPaginator, MatSort, MatTableDataSource, MatDrawerToggleResult } from '@angular/material';
import { LeaveApprovalService } from '../leaveapproval/leaveapproval.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-management-dashboard',
    templateUrl: './management-dashboard.component.html',
    styleUrls: ['./management-dashboard.component.scss'],
    providers: [MonthFilterPipe, DatePipe]

})
export class ManagementDashboardComponent implements OnInit {
    public YearDetails: ITeamWiseDetail[];
    public LineChartDetails: ITeamWiseDetail[];
    public MonthDetails: ITeamWiseDetail[];
    public EMPApprovalDetails: IEMPLeaveApprovalDetails;
    public CurrentMonth = new Date().getMonth();
    public CurrentYear = new Date().getFullYear();
    public SelectedYear: any;
    public Monthvisible: boolean = false;
    public Yearvisible: boolean = true;
    public ToggleValue: boolean=true;
    OpenLeaveData = new MatTableDataSource();
    public MonthName: any
    @ViewChild(MatPaginator, {static: false}) openpaginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) opensort: MatSort;
    yearfilter: any;
    SelectedMonth: any;
    public SelectedTeam: any;
    public errorMessage: any;
    public validationMessage: string;
    public approveReason: string = "Leave Approved";
    public rejectedReason: string = "Leave Approved";
    public Icon: boolean = true;
    currentDate: Date = new Date();
    Years = [
        { value: "2018" },
        { value: "2019" },
        { value: "2020" },
        { value: "2021" },
        { value: "2022" },
        { value: "2023" },
        { value: "2024" },
        { value: "2025" }

    ];
    Months = [
        { value: "January" },
        { value: "February" },
        { value: "March" },
        { value: "April" },
        { value: "May" },
        { value: "June" },
        { value: "July" },
        { value: "August" },
        { value: "September" },
        { value: "October" },
        { value: "November" },
        { value: "December" },
    ];
    OpenLeaveColumns = ['TeamName', 'DFrom', 'MonthCount', 'Yearcount', 'LRejection', 'LApproval', 'OpenLApproval'];
    constructor(public managementdashboardservice: ManagementDashboardService,
        public monthFilterPipe: MonthFilterPipe, public userService: UserService,
        private router: Router, private route: ActivatedRoute, private datePipe: DatePipe,
        public LeaveApprovalService: LeaveApprovalService, public snackBar: MatSnackBar, public ngProgress: NgProgress,private spinner: NgxSpinnerService) {
            this.MonthName= this.datePipe.transform(this.currentDate, 'MMM');

        this.yearfilter = this.Years.filter(Years =>
            Years.value.indexOf(this.CurrentYear.toString()) === 0);
        this.SelectedYear = this.currentDate.getFullYear()
        this.SelectedMonth = this.datePipe.transform(this.currentDate, 'MMMM')
    }

    ngOnInit() {
        
        this.spinner.show();
        this.Getpendingleave();
        this.cleardetails();
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    ngAfterViewInit() {
        this.BindYearchart();
    }

    getNextMonth() {
        this.spinner.show();
        this.currentDate = new Date(new Date().setMonth(this.currentDate.getMonth() + 1))
        this.SelectedMonth = this.datePipe.transform(this.currentDate, 'MMMM')
        this.selectMonth()
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }

    getPrevoiusMonth() {
        this.spinner.show();
        this.currentDate = new Date(new Date().setMonth(this.currentDate.getMonth() - 1))
        this.SelectedMonth = this.datePipe.transform(this.currentDate, 'MMMM')
        this.selectMonth()
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }

    getNextYear() {
        this.spinner.show();
        this.SelectedYear = this.SelectedYear + 1
        this.selectYear()
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }

    getPrevoiusYear() {
        this.spinner.show();
        this.SelectedYear = this.SelectedYear - 1
        this.selectYear()
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }

    Getpendingleave() {
        this.managementdashboardservice.getEmployeeLeaveDetails(this.userService.EMPCode, "1")
            .subscribe((data: IEmpLeaveDetails[]) => {
                
                var OpenLeave = data 
                this.OpenLeaveData = new MatTableDataSource(OpenLeave);
                this.OpenLeaveData.paginator = this.openpaginator;
                this.OpenLeaveData.sort = this.opensort;
            },
                error => alert('Error: ' + <any>error));
    }
    selectYear() {
        this.SelectedYear = this.SelectedYear;
        this.ngAfterViewInit();
    }
    selectMonth() {
        this.SelectedMonth = this.SelectedMonth;
        this.ngAfterViewInit();
    }
    Togglechange(value) {
        this.ToggleValue = value;
        if (this.ToggleValue == true) {
            this.Yearvisible = true
            this.Monthvisible = false
            this.ngAfterViewInit();
        }
        else {
            this.Monthvisible = true
            this.Yearvisible = false
            this.ngAfterViewInit();
        }
    }
    callrouting(SelectedTeam) {
        this.spinner.show();
 
        this.router.navigate(['authenticated/ODCLeadDashboard', {TeamName:SelectedTeam,CurrentYear:this.SelectedYear}]);
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    openLeaveApproval(ApprovalDetail: any) {
        this.spinner.show();
        this.router.navigate(['authenticated/LeaveApproval', ApprovalDetail.EMPCode, ApprovalDetail.EMPName, ApprovalDetail.TeamName]);
         setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    ApproveLeave(LDetail: any) {
        this.spinner.show();
        this.EMPApprovalDetails.LeaveApproval = true;
        this.EMPApprovalDetails.LeaveApproveRemarks = this.approveReason;
        this.EMPApprovalDetails.LeaveApprovedBy = this.userService.EMPCode;
        this.EMPApprovalDetails.LeaveID = LDetail.LeaveID;
        this.LeaveApprovalService.CommitLeave(this.EMPApprovalDetails)
            .subscribe(
                result => {
                    this.EMPApprovalDetails = <IEMPLeaveApprovalDetails>result
                    this.validationMessage = this.EMPApprovalDetails.Description;
                    this.openSnackBar(this.validationMessage, "");
                    this.cleardetails();
                    this.ngAfterViewInit();
                    this.Getpendingleave();
                    setTimeout(() => {
                        this.spinner.hide();
                      }, 500);
                },
                error => {
                    this.errorMessage = <any>error
                    alert(this.errorMessage);
                    setTimeout(() => {
                        this.spinner.hide();
                      }, 500);
                },

        )
    }
    RejectLeave(LDetail: any) {
        this.spinner.show();
        this.EMPApprovalDetails.LeaveApproval = false;
        this.EMPApprovalDetails.LeaveApproveRemarks = this.rejectedReason;
        this.EMPApprovalDetails.LeaveApprovedBy = this.userService.EMPID;
        this.EMPApprovalDetails.LeaveID = LDetail.LeaveID;
        this.LeaveApprovalService.CommitLeave(this.EMPApprovalDetails)
            .subscribe(
                result => {
                    this.EMPApprovalDetails = <IEMPLeaveApprovalDetails>result
                    this.validationMessage = this.EMPApprovalDetails.Description;
                    this.openSnackBar(this.validationMessage, "");
                    this.cleardetails();
                    this.ngAfterViewInit();
                    this.Getpendingleave();
                    setTimeout(() => {
                        this.spinner.hide();
                      }, 500);
                },
                error => {
                    this.errorMessage = <any>error
                    alert(this.errorMessage);
                    setTimeout(() => {
                        this.spinner.hide();
                      }, 500);
                },

        )
    }
    cleardetails() {
        this.EMPApprovalDetails =
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
    openSnackBar(message: string, action: string) {
        let config = new MatSnackBarConfig();
        config.panelClass = ['custom-class'];
        config.duration = 2000;
        config.verticalPosition = 'top';
        this.snackBar.open(message, action, config);
    }
    BindYearchart() {
        var APMArray = []
        var CSS_8_0Array = [];
        var DashboardReportsArray = [];
        var GDPArray = [];
        var PLSArray = [];
        var MonthArray = [];
        var ReleaseArray = [];
        var SupportArray = [];
        var TestingArray = [];
        var TotalLeaveArray = [];
        var WS1Array = [];
        var WS2Array = [];
        var WS3Array = [];
        var WS4Array = [];
        var YearArray = [];
        //Sum of TeamLeaves
        var TotalAPMArray = []
        var TotalCSS_8_0Array = [];
        var TotalDashboardReportsArray = [];
        var TotalGDPArray = [];
        var TotalPLSArray = [];
        var TotalReleaseArray = [];
        var TotalSupportArray = [];
        var TotalTestingArray = [];
        var TotalLeaveArray2 = [];
        var TotalWS1Array = [];
        var TotalWS2Array = [];
        var TotalWS3Array = [];
        var TotalWS4Array = [];

        TotalAPMArray.push("APM");
        TotalCSS_8_0Array.push("CSS_8_0");
        TotalDashboardReportsArray.push("DashboardReports");
        TotalGDPArray.push("GDP");
        TotalPLSArray.push("PLS");
        TotalReleaseArray.push("Release");
        TotalSupportArray.push("Support");
        TotalTestingArray.push("Testing");
        TotalWS1Array.push("WS1");
        TotalWS2Array.push("WS2");
        TotalWS3Array.push("WS3");
        TotalWS4Array.push("WS4");
        TotalLeaveArray2.push("TotalLeave");
        this.managementdashboardservice.GetEmployeeLeaveyearwise(this.userService.EMPCode, this.SelectedYear)
            .subscribe((data: ITeamWiseDetail[]) => {
                this.YearDetails = data;
                var i;
                var WS1totalcount = 0;
                var WS2totalcount = 0;
                var WS3totalcount = 0;
                var WS4totalcount = 0;
                var CSS8totalcount = 0;
                var APMtotalcount = 0;
                var PLStotalcount = 0;
                var Dashboardtotalcount = 0;
                var Releasetotalcount = 0;
                var Supporttotalcount = 0;
                var Testingtotalcount = 0;
                var GDPtotalcount = 0;
                var TotalLeaveCount = 0;
                this.BindMonthchart();
                this.BindTeamLineChart(this.YearDetails);

                for (i = 0; i < data.length; i++) {
                    APMArray.push(data[i].APM);
                    APMtotalcount += data[i].APM
                    CSS_8_0Array.push(data[i].CSS_8_0);
                    CSS8totalcount += data[i].CSS_8_0
                    DashboardReportsArray.push(data[i].DashboardReports);
                    Dashboardtotalcount += data[i].DashboardReports
                    GDPArray.push(data[i].GDP);
                    GDPtotalcount += data[i].GDP
                    PLSArray.push(data[i].PLS);
                    PLStotalcount += data[i].PLS
                    ReleaseArray.push(data[i].Release);
                    Releasetotalcount += data[i].Release
                    SupportArray.push(data[i].Support);
                    Supporttotalcount += data[i].Support
                    TestingArray.push(data[i].Testing);
                    Testingtotalcount += data[i].Testing
                    WS1Array.push(data[i].WS1);
                    WS1totalcount += data[i].WS1
                    WS2Array.push(data[i].WS2);
                    WS2totalcount += data[i].WS2
                    WS3Array.push(data[i].WS3);
                    WS3totalcount += data[i].WS3
                    WS4Array.push(data[i].WS4);
                    WS4totalcount += data[i].WS4
                    TotalLeaveArray.push(data[i].TotalLeave)
                    TotalLeaveCount += data[i].TotalLeave
                }
                TotalAPMArray.push(APMtotalcount);
                TotalCSS_8_0Array.push(CSS8totalcount);
                TotalDashboardReportsArray.push(Dashboardtotalcount);
                TotalGDPArray.push(GDPtotalcount);
                TotalPLSArray.push(PLStotalcount);
                TotalReleaseArray.push(Releasetotalcount);
                TotalSupportArray.push(Supporttotalcount);
                TotalTestingArray.push(Testingtotalcount);
                TotalWS1Array.push(WS1totalcount);
                TotalWS2Array.push(WS2totalcount);
                TotalWS3Array.push(WS3totalcount);
                TotalWS4Array.push(WS4totalcount);
                TotalLeaveArray2.push(TotalLeaveCount);
                if (TotalLeaveArray2[1] == '0') {
                    TotalLeaveArray2[1] = 'No Leaves Taken'
                }
                let Piechart = c3.generate({
                    bindto: '#YearDonut',
                    data: {
                        columns: [
                            TotalAPMArray,
                            TotalCSS_8_0Array,
                            TotalDashboardReportsArray,
                            TotalGDPArray,
                            TotalPLSArray,
                            TotalReleaseArray,
                            TotalSupportArray,
                            TotalTestingArray,
                            TotalWS1Array,
                            TotalWS2Array,
                            TotalWS3Array,
                            TotalWS4Array,
                        ],
                        type: 'donut',
                        onclick: (d, i) => {
                            this.SelectedTeam = d.id;
                            this.callrouting(this.SelectedTeam);
                        },
                        onmouseover: function (d, i) { },
                        onmouseout: function (d, i) { }
                    },
                    tooltip: {
                        format: {
                            value: function (value) {
                                return d3.format(",.1f")(value)
                            }
                        }
                    },
                    donut: {
                        label: {
                            format: function (value, ratio, id) {
                                return d3.format(",.1f")(value)
                            },
                        },
                        title: d3.format(",.1f")(TotalLeaveArray2[1])
                    }

                });
            });
    }
    BindMonthchart() {
        var APMArray = []
        var CSS_8_0Array = [];
        var DashboardReportsArray = [];
        var GDPArray = [];
        var PLSArray = [];
        var MonthArray = [];
        var ReleaseArray = [];
        var SupportArray = [];
        var TestingArray = [];
        var TotalLeaveArray = [];
        var WS1Array = [];
        var WS2Array = [];
        var WS3Array = [];
        var WS4Array = [];
        var YearArray = [];
        APMArray.push("APM");
        CSS_8_0Array.push("CSS_8_0");
        DashboardReportsArray.push("DashboardReports");
        GDPArray.push("GDP");
        PLSArray.push("PLS");
        MonthArray.push("Month");
        ReleaseArray.push("Release");
        SupportArray.push("Support");
        TestingArray.push("Testing");
        WS1Array.push("WS1");
        WS2Array.push("WS2");
        WS3Array.push("WS3");
        WS4Array.push("WS4");
        YearArray.push("Year");
        TotalLeaveArray.push("TotalLeave");
        this.MonthDetails = this.YearDetails;
        this.MonthDetails = this.monthFilterPipe.transform(this.MonthDetails, this.SelectedMonth);
        var i;
        for (i = 0; i < this.MonthDetails.length; i++) {
            APMArray.push(this.MonthDetails[i].APM);
            CSS_8_0Array.push(this.MonthDetails[i].CSS_8_0);
            DashboardReportsArray.push(this.MonthDetails[i].DashboardReports);
            GDPArray.push(this.MonthDetails[i].GDP);
            PLSArray.push(this.MonthDetails[i].PLS);
            MonthArray.push(this.MonthDetails[i].Month);
            ReleaseArray.push(this.MonthDetails[i].Release);
            SupportArray.push(this.MonthDetails[i].Support);
            TestingArray.push(this.MonthDetails[i].Testing);
            WS1Array.push(this.MonthDetails[i].WS1);
            WS2Array.push(this.MonthDetails[i].WS2);
            WS3Array.push(this.MonthDetails[i].WS3);
            WS4Array.push(this.MonthDetails[i].WS4);
            YearArray.push(this.MonthDetails[i].Year);
            TotalLeaveArray.push(this.MonthDetails[i].TotalLeave)

        }
        if (TotalLeaveArray[1] == '0') {
            TotalLeaveArray[1] = 'No Leaves Taken'
        }

        let Piechart = c3.generate({
            bindto: '#MonthDonut',
            data: {
                columns: [
                    APMArray,
                    CSS_8_0Array,
                    DashboardReportsArray,
                    GDPArray,
                    PLSArray,
                    ReleaseArray,
                    SupportArray,
                    TestingArray,
                    WS1Array,
                    WS2Array,
                    WS3Array,
                    WS4Array,
                ],
                type: 'donut',
                onclick: (d, i) => {
                    this.SelectedTeam = d.id;
                    this.callrouting(this.SelectedTeam);
                },
                onmouseover: function (d, i) { },
                onmouseout: function (d, i) { }
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return d3.format(",.1f")(value)
                    }
                }
            },
            donut: {
                label: {
                    format: function (value, ratio, id) {
                        return d3.format(",.1f")(value)
                    },
                },
                title: d3.format(",.1f")(TotalLeaveArray[1])
            }
        });
    }
    BindTeamLineChart(TotalDetails: any) {
        var HeaderLineArray = []
        var APMArray = []
        var CSS_8_0Array = [];
        var DashboardReportsArray = [];
        var GDPArray = [];
        var PLSArray = [];
        var MonthArray = [];
        var ReleaseArray = [];
        var SupportArray = [];
        var TestingArray = [];
        var TotalLeaveArray = [];
        var WS1Array = [];
        var WS2Array = [];
        var WS3Array = [];
        var WS4Array = [];
        var YearArray = [];
        HeaderLineArray.push('Month')
        APMArray.push("APM");
        CSS_8_0Array.push("CSS_8_0");
        DashboardReportsArray.push("DashboardReports");
        GDPArray.push("GDP");
        PLSArray.push("PLS");
        MonthArray.push("Month");
        ReleaseArray.push("Release");
        SupportArray.push("Support");
        TestingArray.push("Testing");
        WS1Array.push("WS1");
        WS2Array.push("WS2");
        WS3Array.push("WS3");
        WS4Array.push("WS4");
        YearArray.push("Year");
        TotalLeaveArray.push("TotalLeave");

        var i;
        for (i = 0; i < TotalDetails.length; i++) {
            HeaderLineArray.push(TotalDetails[i].Month);
            WS1Array.push(TotalDetails[i].WS1);
            WS2Array.push(TotalDetails[i].WS2);
            WS3Array.push(TotalDetails[i].WS3);
            WS4Array.push(TotalDetails[i].WS4);
            CSS_8_0Array.push(TotalDetails[i].CSS_8_0);
            DashboardReportsArray.push(TotalDetails[i].DashboardReports);
            GDPArray.push(TotalDetails[i].GDP);
            PLSArray.push(TotalDetails[i].PLS);
            ReleaseArray.push(TotalDetails[i].Release);
            SupportArray.push(TotalDetails[i].Support);
            TestingArray.push(TotalDetails[i].Testing);
            APMArray.push(TotalDetails[i].APM);

        }
        var TotalLeaveLineChart = c3.generate({
            bindto: '#TotalLinechart',
            data: {
                x: 'Month',
                columns: [
                    HeaderLineArray,
                    WS1Array,
                    WS2Array,
                    WS3Array,
                    WS4Array,
                    CSS_8_0Array,
                    DashboardReportsArray,
                    GDPArray,
                    PLSArray,
                    ReleaseArray,
                    SupportArray,
                    TestingArray,
                    APMArray
                ],
                type: 'line',
            },
            axis: {

                x: {
                    type: 'category',
                    tick: {
                        multiline: false,
                        rotate: 55,
                    },
                    height: 100
                }
            }
        });
    }
}

