import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as c3 from 'c3';
import * as d3 from 'd3';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { IMonthLeaveDetails, IYearLeaveDetails, IEmployeeDetails } from '../employee-dashboard/employee-dashboard.interface';
import { EmployeeDashboardService } from '../employee-dashboard/employee-dashboard.service';
import { UserService } from '../users/user.service';
import { CalenderDashboardComponent } from '../calender-dashboard/calender-dashboard.component';

import { MonthFilterPipe } from '../employee-dashboard/employee-dashboard-pipefilter'

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-employee-dashboard',
    templateUrl: './employee-dashboard.component.html',
    styleUrls: ['./employee-dashboard.component.css'],
    providers: [MonthFilterPipe, DatePipe]
})
export class EmployeeDashboardComponent implements OnInit {
    public MonthDetails: IYearLeaveDetails[];
    public YearDetails: IYearLeaveDetails[];
    public TotalDetails: IYearLeaveDetails[];
    public Holidaydetail: IYearLeaveDetails[];
    public LinechartDetail: IYearLeaveDetails[];
    public PermissionChartDetail: IYearLeaveDetails[];
    public EmployeeDetails: IEmployeeDetails[];
    public errorMessage: any;
    public i: number
    public CurrentMonthFilter: any;
    public DefaultEmpName: string;
    myControl: FormControl;
    filteredOptions: Observable<any[]>;
    public EmployeeDetails1: IEmployeeDetails[];
    public CurrentMonth = new Date().getMonth();
    public CurrentYear = new Date().getFullYear();
    public EMPCode: any;
    private RoutingEMPName: string;
    private RoutingYear : string;
    public RoutingTeamName: string;
    public SelectedAxis: any;
    SelectedYear: any;
    SelectedMonth: any;
    public Monthvisible: boolean = false
    public Yearvisible: boolean = false;
    color = 'primary';
    checked = false;
    disabled = false;
    public ToggleValue: boolean=true;
    public TogglePermissionValue: boolean=true;
    Permissionchecked = false;
    public Permissionvisible: boolean = false;
    public Holidayvisible: boolean = false;
    public yearfilter: any
    public RoutingEmpcodeName: string;
    public backbtnflag: boolean = false;
    currentDate: Date =new Date('01/01/2019');// new Date();
    private EMPTypeID ;
    private EMPTeam;
    public  Heading:string;
    
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
    constructor(public employeeDashboardService: EmployeeDashboardService, public monthFilterPipe: MonthFilterPipe,
        public userService: UserService, private router: Router, private route: ActivatedRoute, private CalenderDashboardComponent: CalenderDashboardComponent, private datePipe: DatePipe,private spinner: NgxSpinnerService) {
        this.myControl = new FormControl();

        this.yearfilter = this.Years.filter(Years =>
            Years.value.indexOf(this.CurrentYear.toString()) === 0);
        this.SelectedYear = this.currentDate.getFullYear()
        this.SelectedMonth = this.datePipe.transform(this.currentDate, 'MMMM')
        this.RoutingEMPName = this.route.snapshot.paramMap.get("EMPName");

        this.RoutingYear = this.route.snapshot.paramMap.get("CurrentYear");
 
        if (  this.RoutingYear != "" && this.RoutingYear != null )
            {
                this.CurrentYear =  parseInt(this.RoutingYear);
                this.SelectedYear =  this.CurrentYear;
            }
        
        this.EMPTypeID = this.userService.EMPTypeID;
        this.EMPTeam = this.userService.EMPTeam;

     
        if (this.RoutingEMPName == "" || this.RoutingEMPName == null)
            {
                this.EMPCode = this.userService.EMPCode
            }
      
        this.EmployeeDetails = [
            {

                "EMPID": 0,
                "EMPCODE": "",
                "EMPName": ""
            }
        ]
    }

    getNextMonth() {
        this.currentDate = new Date(new Date().setMonth(this.currentDate.getMonth() + 1))
        this.SelectedMonth = this.datePipe.transform(this.currentDate, 'MMMM')
        this.selectMonth()
    }

    getPrevoiusMonth() {
        this.currentDate = new Date(new Date().setMonth(this.currentDate.getMonth() - 1))
        this.SelectedMonth = this.datePipe.transform(this.currentDate, 'MMMM')
        this.selectMonth()
    }

    getNextYear() {

        this.SelectedYear = this.SelectedYear + 1
        this.selectYear()
    }

    getPrevoiusYear() {
        this.SelectedYear = this.SelectedYear - 1
        this.selectYear()
    }
    filterNames(name: string) {
        return this.EmployeeDetails.filter(empName =>
            empName.EMPName.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    
    Togglechange(value) {
        this.spinner.show();
        this.ToggleValue;
        if (this.ToggleValue == true) {
            this.Monthvisible = false
            this.Yearvisible = true
            this.ngAfterViewInit();
        }
        else {
            this.Yearvisible = false
            this.Monthvisible = true
            this.ngAfterViewInit();
        }
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    TogglePermissionchange(value) {
        this.spinner.show();
        this.TogglePermissionValue = value;
        if (this.TogglePermissionValue == true) {
            this.Permissionvisible = false
            this.Holidayvisible = true
            this.ngAfterViewInit();
        }
        else {
            this.Holidayvisible = false
            this.Permissionvisible = true
            this.ngAfterViewInit();
        }
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    ngOnInit() {
        
        this.spinner.show();
        this.RoutingEMPName = this.route.snapshot.paramMap.get("EMPName");
        if (this.RoutingEMPName == "" || this.RoutingEMPName == null)
        {
                this.EMPCode = this.userService.EMPCode
        }
        this.employeeDashboardService.getEmployeeNameDetails(this.userService.EMPCode)
            .subscribe((data: IEmployeeDetails[]) => {
                this.EmployeeDetails = data
                if (this.RoutingEMPName == "" || this.RoutingEMPName == null)
                    {
                    this.DefaultEmpName = this.EmployeeDetails[0].EMPName;
                    this.EmployeeChange(this.DefaultEmpName);
                    if(this.EMPCode == 0)
                    this.Heading = this.EMPTeam  
                    else
                        this.Heading = this.DefaultEmpName  
                    }
                    
                else {
                    this.DefaultEmpName = this.RoutingEMPName;
                    this.Heading = this.DefaultEmpName
                    this.EmployeeChange(this.DefaultEmpName);
                    this.backbtnflag = true;
                }
               
                if (this.ToggleValue == true) {
                    this.Yearvisible = true;
                }
                else {
                    this.Monthvisible = false;
                }
                if (this.TogglePermissionValue == true) {
                    this.Holidayvisible = true;
                }
                else {
                    this.Permissionvisible = false;
                }
                this.filteredOptions = this.myControl.valueChanges
                    .pipe(
                        startWith(''),
                        map(empName => empName ? this.filterNames(empName) : this.EmployeeDetails.slice())
                    );
            }, error => this.errorMessage = <any>error);
            setTimeout(() => {
                this.spinner.hide();
              }, 500);

            
    }

    EmployeeChange(EName: string) {
        
        this.spinner.show();
        this.EmployeeDetails1 = this.EmployeeDetails.filter(empName =>
            empName.EMPName.toLowerCase().indexOf(EName.toLowerCase()) === 0);
        this.EMPCode = this.EmployeeDetails1[0].EMPCODE;
        
        this.CalenderDashboardComponent.GetEmployeeCalenderDetailsFromChild(this.EMPCode)
        this.ngAfterViewInit();
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    selectYear() {
        this.spinner.show();
        this.SelectedYear = this.SelectedYear;
        this.ngAfterViewInit();
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    selectMonth() {
        this.spinner.show();
        this.SelectedMonth = this.SelectedMonth;
        this.ngAfterViewInit();
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
    callrouting( ) {
       
        if (this.userService.Hierarchy>2)
            {
                this.spinner.show();
                this.router.navigate(['authenticated/ODCLeadDashboard', {TeamName:this.userService.EMPTeam,CurrentYear:this.SelectedYear}]);
                setTimeout(() => {
                    this.spinner.hide();
                  }, 500);
            }
       
    }
    BindMonthchart(TotalDetails: any) {
        
        this.spinner.show();
        //Month Wise Donut Chart-----------------
        var CurrentMonthArray = []
        var DOCasualLeaveArray = []

        var DOSickLeaveArray = []
        var DOPermissionArray = []
        var DOWeddingLeaveArray = []

        var DOHolidayLeaveArray =  []
        var DOConsLeaveArray = []

        var DOMonthTotalCount = []

        DOCasualLeaveArray.push('CasualLeave');

        DOSickLeaveArray.push('SickLeave');

        DOWeddingLeaveArray.push('WeddingLeave');

        DOHolidayLeaveArray.push('HolidayLeave');
        DOConsLeaveArray.push('ConsecutiveLeave');

        DOMonthTotalCount.push('TotalLeave');



        this.MonthDetails = TotalDetails;
        var i;
        CurrentMonthArray = this.monthFilterPipe.transform(this.TotalDetails, this.SelectedMonth);

        for (i = 0; i < CurrentMonthArray.length; i++) {
            DOCasualLeaveArray.push(CurrentMonthArray[i].CasualLeave);

            DOSickLeaveArray.push(CurrentMonthArray[i].SickLeave);
            DOPermissionArray.push(CurrentMonthArray[i].Permission);
            DOWeddingLeaveArray.push(CurrentMonthArray[i].WeddingLeave);

            DOHolidayLeaveArray.push(CurrentMonthArray[i].HolidayLeave);
            DOConsLeaveArray.push(CurrentMonthArray[i].ConsecutiveLeave);

            DOMonthTotalCount.push(CurrentMonthArray[i].TotalLeave);

        }
        var Mtitle
         if (DOMonthTotalCount.length > 1) {
            Mtitle=  d3.format(",.1f")(DOMonthTotalCount[1])
           }
        else{
            Mtitle='No Leaves Taken'
        }

        let dochart = c3.generate({
            bindto: '#MonthDonut',
            data: {
                columns: [
                    DOCasualLeaveArray,

                    DOSickLeaveArray,

                    DOWeddingLeaveArray,

                    DOHolidayLeaveArray,
                    DOConsLeaveArray

                ],
                type: 'donut',
                onclick: (d, i) => {                  
                    this.callrouting();
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
                title:Mtitle
            }
        });
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    Bindyearchart() {
        
        this.spinner.show();
        //Year Wise Donut Chart--------------
        var HeaderArray = []
        var CasualLeaveArray = []

        var SickLeaveArray = []
        var WeddingLeaveArray = []
        var HolidayLeaveArray = []
        var ConsLeaveArray = []
        var YearTotalCount = []
        var TotalcasualLeaves = []
        var TotalSickLeaves = []
        var TotalWeddingLeaves = []
        var TotalHolidayLeaves = []
        var TotalConsLeaves = []
        var TotalLeaves = []

        HeaderArray.push('Month');
        TotalcasualLeaves.push('CasualLeave');
        TotalSickLeaves.push('SickLeave');
        TotalWeddingLeaves.push('WeddingLeave');
        TotalHolidayLeaves.push('HolidayLeave');
        TotalLeaves.push('TotalLeave');
        TotalConsLeaves.push('ConsecutiveLeave');

        this.employeeDashboardService.getYearLeaveDetails(this.userService.EMPCode, this.EMPCode, this.SelectedYear)
            .subscribe((data: IYearLeaveDetails[]) => {
                
                this.TotalDetails = data;
                this.YearDetails = this.TotalDetails
                var i;
                var CasualLeaveTotalcount = 0;
                var SickLeaveTotalcount = 0;
                var WeddingLeaveTotalcount = 0;
                var HolidayLeaveTotalcount = 0;
                var ConsLeaveTotalcount = 0;
                var TotalLeavecount = 0;
               
                this.BindMonthchart(this.TotalDetails);
                this.BindBarchart(this.TotalDetails);
                this.BindPermissionchart(this.TotalDetails);
                this.BindLineChart(this.TotalDetails);
                for (i = 0; i < data.length; i++) {
                    CasualLeaveArray.push(data[i].CasualLeave);
                    CasualLeaveTotalcount += data[i].CasualLeave
                    SickLeaveArray.push(data[i].SickLeave);
                    SickLeaveTotalcount += data[i].SickLeave
                    WeddingLeaveArray.push(data[i].WeddingLeave);
                    WeddingLeaveTotalcount += data[i].WeddingLeave
                    HolidayLeaveArray.push(data[i].HolidayLeave);
                    HolidayLeaveTotalcount += data[i].HolidayLeave
                    ConsLeaveArray.push(data[i].ConsecutiveLeave);
                    ConsLeaveTotalcount += data[i].ConsecutiveLeave
                    YearTotalCount.push(data[i].TotalLeave);
                    TotalLeavecount += data[i].TotalLeave
                }
                TotalcasualLeaves.push(CasualLeaveTotalcount)
                TotalSickLeaves.push(SickLeaveTotalcount)
                TotalWeddingLeaves.push(WeddingLeaveTotalcount)
                TotalHolidayLeaves.push(HolidayLeaveTotalcount)
                TotalConsLeaves.push(ConsLeaveTotalcount)
                TotalLeaves.push(TotalLeavecount)
                var title
                if (TotalLeaves[1] == '0') {
                    TotalLeaves[1] = 'No Leaves Taken'
                    title='No Leaves Taken'
                }
                else{
                    title= d3.format(",.1f")(TotalLeaves[1])
                }
               
               
                let Piechart = c3.generate({
                    bindto: '#YearDonut',
                    data: {
                        columns: [
                            HeaderArray,
                            TotalcasualLeaves,

                            TotalSickLeaves,

                            TotalWeddingLeaves,

                            TotalHolidayLeaves,
                            TotalConsLeaves

                        ],
                        type: 'donut',
                        onclick: (d, i) => {                  
                            this.callrouting();
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
                        title:title
                        
                    }
                });

            });
            setTimeout(() => {
                this.spinner.hide();
              }, 500);
    }
    BindBarchart(TotalDetails: any) {
        this.spinner.show();
        //Bar chart----------------------------
        var HeaderArray = []
        var BarHolidayworkArray = []
        var BarCompoffLeaveArray = []

        HeaderArray.push('Month');
        BarHolidayworkArray.push('HolidayWork');
        BarCompoffLeaveArray.push('CompOffLeave');

        this.Holidaydetail = TotalDetails;
        var j;

        for (j = 0; j < this.Holidaydetail.length; j++) {

            HeaderArray.push(this.Holidaydetail[j].Month);
            BarHolidayworkArray.push(this.Holidaydetail[j].HolidayWork);
            BarCompoffLeaveArray.push(this.Holidaydetail[j].CompOffLeave);
        }

        var EmpBarchart = c3.generate({
            bindto: '#Barchart',
            data: {
                x: 'Month',
                columns: [
                    HeaderArray,
                    BarHolidayworkArray,
                    BarCompoffLeaveArray,
                ],
                type: 'bar',
                // groups: [
                //     ['HolidayWork', 'CompOffLeave']
                // ]
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
        setTimeout(() => {
            this.spinner.hide();
          }, 500);


    }
    BindLineChart(TotalDetails: any) {
        this.spinner.show();
        var HeaderLineArray = []
        var LineTotalCountArray = []

        HeaderLineArray.push('Month');
        LineTotalCountArray.push('TotalLeave');

        this.LinechartDetail = TotalDetails
        var i;
        for (i = 0; i < this.LinechartDetail.length; i++) {
            HeaderLineArray.push(this.LinechartDetail[i].Month);
            LineTotalCountArray.push(this.LinechartDetail[i].TotalLeave);
        }
        var TotalLeaveLineChart = c3.generate({
            bindto: '#TotalLinechart',
            data: {
                x: 'Month',
                columns: [
                    HeaderLineArray,
                    LineTotalCountArray,
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
        setTimeout(() => {
            this.spinner.hide();
          }, 500);


    }
    BindPermissionchart(TotalDetails: any) {
        this.spinner.show();
        var HeaderLineArray = []
        var PermissionTotalCountArray = []
        var ExtendedHoursCountArray = []

        HeaderLineArray.push('Month');
        PermissionTotalCountArray.push('Permission');
        ExtendedHoursCountArray.push('ExtendedHours');

        this.PermissionChartDetail = TotalDetails
        var i;
        for (i = 0; i < this.PermissionChartDetail.length; i++) {
            HeaderLineArray.push(this.PermissionChartDetail[i].Month);
            PermissionTotalCountArray.push(this.PermissionChartDetail[i].Permission);
            ExtendedHoursCountArray.push(this.PermissionChartDetail[i].ExtendedHours);
        }
        var TotalLeaveLineChart = c3.generate({
            bindto: '#PermissionLinechart',
            data: {
                x: 'Month',
                columns: [
                    HeaderLineArray,
                    PermissionTotalCountArray,
                    ExtendedHoursCountArray,
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
        setTimeout(() => {
            this.spinner.hide();
          }, 500);

    }

    ngAfterViewInit() {
        this.spinner.show();
        this.Bindyearchart();
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }

}

