import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { Router, RouteConfigLoadStart} from '@angular/router';
import * as c3 from 'c3';
import { NgxSpinnerService } from 'ngx-spinner';

import { TeamWiseDashboardService } from '../team-wise-dashboard/team-wise-dashboard.service';
import { UserService } from '../users/user.service';

import { ITeamWiseLeaveDetails } from '../team-wise-dashboard/team-wise-dashboard.Interface';
@Component({
    selector: 'app-team-wise-dashboard',
    templateUrl: './team-wise-dashboard.component.html',
    styleUrls: ['./team-wise-dashboard.component.css']
})
export class TeamWiseDashboardComponent implements OnInit {

    public CurrentYear: string = "2018";
    public TeamWiseLeaveDetails: ITeamWiseLeaveDetails[];
    public CurrentMonth = new Date().getMonth();
    public SelectedTeam:any;
    SelectedMonth: any;

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


    constructor(public teamDashboardService: TeamWiseDashboardService, public userService: UserService, private router: Router,private spinner: NgxSpinnerService) {
        this.SelectedMonth = this.Months[this.CurrentMonth].value;
     }
    ngOnInit() {

        this.spinner.show();
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
    callrouting(SelectedTeam)
    {
        this.spinner.show();
        this.router.navigate(['authenticated/ODCLeadDashboard',SelectedTeam]);
        setTimeout(() => {
            this.spinner.hide();
          }, 500);
    }
    ngAfterViewInit() {
        //Team Bar chart
        //Bar chart----------------------------
        this.spinner.show();
        var TeamWiseHeaderArray = []
        var TeamWiseBarCasualLeaveArray = []
        var TeamWiseBarCompoffArray = []
        var TeamWiseBarSickLeaveArray = []
        var TeamWiseBarPermissionArray = []
        var TeamWiseBarOtherLeaveArray = []
        var TeamWiseBarHolidayWorkArray = []
        var TeamWiseBarExceptionLeaveArray = []
        var TeamWiseBarWorkFromHomeArray = []

        TeamWiseHeaderArray.push('TeamName');
        TeamWiseBarCasualLeaveArray.push('CasualLeave');
        TeamWiseBarCompoffArray.push('CompoffLeave');
        TeamWiseBarSickLeaveArray.push('SickLeave');
        TeamWiseBarPermissionArray.push('Permission');
        TeamWiseBarOtherLeaveArray.push('OtherLeave');
        TeamWiseBarHolidayWorkArray.push('HolidayWork');
        TeamWiseBarExceptionLeaveArray.push('ExceptionLeave');
        TeamWiseBarWorkFromHomeArray.push('WorkFromHome');

        
 var MonthTeamHeaderArray = []
 var MonthTeamBarCasualLeaveArray = []
 var MonthTeamBarCompoffArray = []
 var MonthTeamBarSickLeaveArray = []
 var MonthTeamBarPermissionArray = []
 var MonthTeamBarOtherLeaveArray = []
 var MonthTeamBarHolidayWorkArray = []
 var MonthTeamBarExceptionLeaveArray = []
 var MonthTeamBarWorkFromHomeArray = []

 
 MonthTeamHeaderArray.push('TeamName');
 MonthTeamBarCasualLeaveArray.push('CasualLeave');
 MonthTeamBarCompoffArray.push('CompoffLeave');
 MonthTeamBarSickLeaveArray.push('SickLeave');
 MonthTeamBarPermissionArray.push('Permission');
 MonthTeamBarOtherLeaveArray.push('OtherLeave');
 MonthTeamBarHolidayWorkArray.push('HolidayWork');
 MonthTeamBarExceptionLeaveArray.push('ExceptionLeave');
 MonthTeamBarWorkFromHomeArray.push('WorkFromHome');

        this.teamDashboardService.getTeamWiseLeaveDetails(this.userService.EMPCode, this.CurrentYear)
            .subscribe((data: ITeamWiseLeaveDetails[]) => {
                this.TeamWiseLeaveDetails = data;
                var i;

                for (i = 0; i < data.length; i++) {

                    TeamWiseHeaderArray.push(data[i].TeamName);
                    TeamWiseBarCasualLeaveArray.push(data[i].CasualLeave);
                    TeamWiseBarCompoffArray.push(data[i].CompoffLeave);
                    TeamWiseBarSickLeaveArray.push(data[i].SickLeave);
                    TeamWiseBarPermissionArray.push(data[i].Permission);
                    TeamWiseBarOtherLeaveArray.push(data[i].OtherLeave);
                    TeamWiseBarHolidayWorkArray.push(data[i].HolidayWork);
                    TeamWiseBarExceptionLeaveArray.push(data[i].ExceptionLeave);
                    TeamWiseBarWorkFromHomeArray.push(data[i].WorkFromHome);
                }

                var Barchart = c3.generate({
                    bindto: '#Barchart',
                    data: {
                        x: 'TeamName',
                        columns: [
                            TeamWiseHeaderArray,
                            TeamWiseBarCasualLeaveArray,
                            TeamWiseBarCompoffArray,
                            TeamWiseBarSickLeaveArray,
                            TeamWiseBarPermissionArray,
                            TeamWiseBarOtherLeaveArray,
                            TeamWiseBarHolidayWorkArray,
                            TeamWiseBarExceptionLeaveArray,
                            TeamWiseBarWorkFromHomeArray
                        ],
                        type: 'bar',
                        groups: [
                            ['CasualLeave', 'CompoffLeave', 'SickLeave', 'Permission', 'OtherLeave', 'HolidayWork', 'ExceptionLeave', 'WorkFromHome']
                        ],
                         
                        onclick: (d, i)=>{
                            this.SelectedTeam = Barchart.categories()[d.index];//this.internal.config.axis_x_categories[d.x];
                            this.callrouting(this.SelectedTeam);
                        },
                    },
                    axis: {
                        x: {
                            type: 'category',
                            tick: {
                                multiline: false
                            },
                            height: 100
                        }
                    }
                });
            });

            
this.teamDashboardService.getTeamWiseLeaveDetailsForMonth(this.userService.EMPCode, this.CurrentYear,  this.SelectedMonth  )
.subscribe((data: ITeamWiseLeaveDetails[]) => {
    this.TeamWiseLeaveDetails = data;
    
    var i;
    for (i = 0; i < data.length; i++) {

        MonthTeamHeaderArray.push(data[i].TeamName);
        MonthTeamBarCasualLeaveArray.push(data[i].CasualLeave);
        MonthTeamBarCompoffArray.push(data[i].CompoffLeave);
        MonthTeamBarSickLeaveArray.push(data[i].SickLeave);
        MonthTeamBarPermissionArray.push(data[i].Permission);
        MonthTeamBarOtherLeaveArray.push(data[i].OtherLeave);
        MonthTeamBarHolidayWorkArray.push(data[i].HolidayWork);
        MonthTeamBarExceptionLeaveArray.push(data[i].ExceptionLeave);
        MonthTeamBarWorkFromHomeArray.push(data[i].WorkFromHome);
    }

    var Barchart = c3.generate({
        bindto: '#MonthBarchart',
        data: {
            x: 'TeamName',
            columns: [
                MonthTeamHeaderArray,
                MonthTeamBarCasualLeaveArray,
                MonthTeamBarCompoffArray,
                MonthTeamBarSickLeaveArray,
                MonthTeamBarPermissionArray,
                MonthTeamBarOtherLeaveArray,
                MonthTeamBarHolidayWorkArray,
                MonthTeamBarExceptionLeaveArray,
                MonthTeamBarWorkFromHomeArray
            ],
            type: 'bar',
            groups: [
                ['CasualLeave', 'CompoffLeave', 'SickLeave', 'Permission', 'OtherLeave','HolidayWork','ExceptionLeave','WorkFromHome']
            ]
        },
        color:  {
            pattern:['#E55D4A','#E88554', '#FFAF53', '#AB2F52',  '#FF2D00', '#FF8C00', '#F2811D']
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    rotate:55,
                    multiline: false
                },
                height: 100
            }
        }
    });
});
setTimeout(() => {
    this.spinner.hide();
  }, 500);
   } 
}
