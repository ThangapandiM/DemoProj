import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as c3 from 'c3';

import { TeamDashboardService } from '../team-dashboard/team-dashboard.service';
import { UserService } from '../users/user.service';

import { ITeamLeaveDetails, ITeamNames } from '../team-dashboard/team-dashboard.Interface';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-team-dashboard',
    templateUrl: './team-dashboard.component.html',
    styleUrls: ['./team-dashboard.component.css'],
    providers:[DatePipe]
})
export class TeamDashboardComponent implements OnInit {

    public CurrentYear=new Date().getFullYear();
    public TeamLeaveDetails: ITeamLeaveDetails[];
    public TeamNames: ITeamNames[];
    public TeamNames1: ITeamNames[];
    public TeamID: any = 0;
    public SelectedName: string;
    public CurrentMonth = new Date().getMonth();
    public errorMessage: any;
    private RoutingTeamName: string;
    private RoutingYear: string;
    public SelectedEmployee: any;
    myControl: FormControl;
    SelectedMonth: any;
   
    public backbtnflag:boolean=false;
    Months = [
        { value: "Jan" },
        { value: "Feb" },
        { value: "Mar" },
        { value: "Apr" },
        { value: "May" },
        { value: "Jun" },
        { value: "Jul" },
        { value: "Aug" },
        { value: "Sep" },
        { value: "Oct" },
        { value: "Nov" },
        { value: "Dec" },
    ];

    filteredOptions: Observable<any[]>;
    constructor(public teamDashboardService: TeamDashboardService, public userService: UserService,  private datePipe: DatePipe,private router: Router, private route: ActivatedRoute) {

        this.SelectedMonth = this.Months[this.CurrentMonth].value;
        this.myControl = new FormControl();
    }
    filterNames(name: string) {
        return this.TeamNames.filter(empName =>
            empName.TeamName.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    ngOnInit() {
       //GetEmployeeNames---------------------
        this.RoutingTeamName = this.route.snapshot.paramMap.get("TeamName");
        this.RoutingYear = this.route.snapshot.paramMap.get("CurrentYear");
        this.CurrentYear =  parseInt(this.RoutingYear);
      
           this.teamDashboardService.getTeamNames(this.userService.EMPCode)
            .subscribe((data: ITeamNames[]) => {
                this.TeamNames = data
                if (this.TeamNames.length >1 )
                {
                    this.TeamNames.splice(0, 1);
                }               
                if (this.RoutingTeamName == "" || this.RoutingTeamName == null)
                {
                    this.SelectedName = this.TeamNames[0].TeamName;
                }
                else {
                    if (this.RoutingTeamName == "CSS_8_0") {
                        this.RoutingTeamName = "CSS 8.0";
                    }
                    this.backbtnflag=true;
                    this.SelectedName = this.RoutingTeamName;
                    this.TeamChange(this.SelectedName);
                }
                this.filteredOptions = this.myControl.valueChanges
                    .pipe(
                        startWith(''),
                        map(teamName => teamName ? this.filterNames(teamName) : this.TeamNames.slice())
                    );
            }, error => this.errorMessage = <any>error);
    }

    TeamChange(ETeamName: String) {
        this.TeamNames1 = this.TeamNames.filter(teamName =>
            teamName.TeamName.toLowerCase().indexOf(ETeamName.toLowerCase()) === 0);
        this.TeamID = this.TeamNames1[0].TeamID;
        this.ngAfterViewInit();
    }
    selectMonth() {
        this.SelectedMonth = this.SelectedMonth;
        this.ngAfterViewInit();
    }
    callrouting(SelectedEmployee) {
            this.router.navigate(['authenticated/Dashboard', {EMPName:this.SelectedEmployee,CurrentYear:this.CurrentYear}]);
           
    }
    backClicked() {
      //  window.history.back();
        if (this.userService.Hierarchy>5)
        {
            this.router.navigate(['authenticated/HRDashboard'])
        }
        else
            {
                this.router.navigate(['authenticated/Dashboard', { CurrentYear:this.CurrentYear}]);
            }
    }
    ngAfterViewInit() {
        //Team Bar chart-----------------
        //Bar chart----------------------------
        
        var TeamHeaderArray = []
        var TeamBarCasualLeaveArray = []
        var TeamBarCompoffArray = []
        var TeamBarSickLeaveArray = []
        var TeamBarPermissionArray = []
        var TeamBarWeddingLeaveArray = []
        var TeamBarHolidayWorkArray = []
        var TeamBarHolidayLeaveArray = []
        var TeamBarWorkFromHomeArray = []

        var MonthTeamHeaderArray = []
        var MonthTeamBarCasualLeaveArray = []
        var MonthTeamBarCompoffArray = []
        var MonthTeamBarSickLeaveArray = []
        var MonthTeamBarPermissionArray = []
        var MonthTeamBarWeddingLeaveArray = []
        var MonthTeamBarHolidayWorkArray = []
        var MonthTeamBarHolidayLeaveArray = []
        var MonthTeamBarWorkFromHomeArray = []


        TeamHeaderArray.push('EMPName');
        TeamBarCasualLeaveArray.push('CasualLeave');
        TeamBarCompoffArray.push('CompoffLeave');
        TeamBarSickLeaveArray.push('SickLeave');
        TeamBarPermissionArray.push('Permission');
        TeamBarWeddingLeaveArray.push('WeddingLeave');
        TeamBarHolidayWorkArray.push('CompensatoryWork');
        TeamBarHolidayLeaveArray.push('HolidayLeave');
        TeamBarWorkFromHomeArray.push('WorkFromHome');

        MonthTeamHeaderArray.push('EMPName');
        MonthTeamBarCasualLeaveArray.push('CasualLeave');
        MonthTeamBarCompoffArray.push('CompoffLeave');
        MonthTeamBarSickLeaveArray.push('SickLeave');
        MonthTeamBarPermissionArray.push('Permission');
        MonthTeamBarWeddingLeaveArray.push('WeddingLeave');
        MonthTeamBarHolidayWorkArray.push('CompensatoryWork');
        MonthTeamBarHolidayLeaveArray.push('HolidayLeave');
        MonthTeamBarWorkFromHomeArray.push('WorkFromHome');

        this.teamDashboardService.getTeamLevelEmployeeLeaveDetails(this.userService.EMPCode,this.CurrentYear.toString(), this.TeamID)
            .subscribe((data: ITeamLeaveDetails[]) => {
                
                this.TeamLeaveDetails = data;
                var i;
                for (i = 0; i < data.length; i++) {

                    TeamHeaderArray.push(data[i].EMPName);
                    TeamBarCasualLeaveArray.push(data[i].CasualLeave);
                    TeamBarCompoffArray.push(data[i].CompoffLeave);
                    TeamBarSickLeaveArray.push(data[i].SickLeave);
                    TeamBarPermissionArray.push(data[i].Permission);
                    TeamBarWeddingLeaveArray.push(data[i].WeddingLeave);
                    TeamBarHolidayWorkArray.push(data[i].HolidayWork);
                    TeamBarHolidayLeaveArray.push(data[i].HolidayLeave);
                    TeamBarWorkFromHomeArray.push(data[i].WorkFromHome);
                }

                var Barchart = c3.generate({
                    bindto: '#Barchart',
                    data: {
                        x: 'EMPName',
                        columns: [
                            TeamHeaderArray,
                            TeamBarCasualLeaveArray,
                            TeamBarCompoffArray,
                            TeamBarSickLeaveArray,
                            TeamBarPermissionArray,
                            TeamBarWeddingLeaveArray,
                            TeamBarHolidayWorkArray,
                            TeamBarHolidayLeaveArray,
                            TeamBarWorkFromHomeArray
                        ],
                        type: 'bar',
                        groups: [
                            ['CasualLeave', 'CompoffLeave', 'SickLeave', 'Permission', 'WeddingLeave', 'CompensatoryWork', 'HolidayLeave', 'WorkFromHome']
                             
                        ],
                        onclick: (d, i) => {
                            this.SelectedEmployee = Barchart.categories()[d.index];
                            this.callrouting(this.SelectedEmployee);
                        },
                    },
                    axis: {
                        x: {
                            type: 'category',
                            tick: {
                                rotate: 55,
                                multiline: false
                            },
                            height: 100
                        }
                    }
                });
            });

        this.teamDashboardService.getTeamLevelEmployeeLeaveDetailsForMonth(this.userService.EMPCode,this.CurrentYear.toString(), this.TeamID, this.SelectedMonth)
            .subscribe((data: ITeamLeaveDetails[]) => {
                this.TeamLeaveDetails = data;
                var i;
                for (i = 0; i < data.length; i++) {

                    MonthTeamHeaderArray.push(data[i].EMPName);
                    MonthTeamBarCasualLeaveArray.push(data[i].CasualLeave);
                    MonthTeamBarCompoffArray.push(data[i].CompoffLeave);
                    MonthTeamBarSickLeaveArray.push(data[i].SickLeave);
                    MonthTeamBarPermissionArray.push(data[i].Permission);
                    MonthTeamBarWeddingLeaveArray.push(data[i].WeddingLeave);
                    MonthTeamBarHolidayWorkArray.push(data[i].HolidayWork);
                    MonthTeamBarHolidayLeaveArray.push(data[i].HolidayLeave);
                    MonthTeamBarWorkFromHomeArray.push(data[i].WorkFromHome);
                }
                var Barchart = c3.generate({
                    bindto: '#MonthBarchart',
                    data: {
                        x: 'EMPName',
                        columns: [
                            MonthTeamHeaderArray,
                            MonthTeamBarCasualLeaveArray,
                            MonthTeamBarCompoffArray,
                            MonthTeamBarSickLeaveArray,
                            MonthTeamBarPermissionArray,
                            MonthTeamBarWeddingLeaveArray,
                            MonthTeamBarHolidayWorkArray,
                            MonthTeamBarHolidayLeaveArray,
                            MonthTeamBarWorkFromHomeArray
                        ],
                        type: 'bar',
                        groups: [
                            ['CasualLeave', 'CompoffLeave', 'SickLeave', 'Permission', 'WeddingLeave', 'CompensatoryWork', 'HolidayLeave', 'WorkFromHome']
                        ],
                        onclick: (d, i) => {
                            this.SelectedEmployee = Barchart.categories()[d.index];
                            this.callrouting(this.SelectedEmployee);
                        },
                    },
                    color: {
                        pattern: ['#FD8814', '#3CFF36', '#E54661', '#126872', '#2E63A4', '#296E22', '#B609E8']
                    },
                    axis: {
                        x: {
                            type: 'category',
                            tick: {
                                rotate: 55,
                                multiline: false
                            },
                            height: 100
                        }
                    }
                });
            });


    }
}
