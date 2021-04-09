import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/login/login.component';
import { LeaveEntryComponent } from './leave-entry/leave-entry.component';
import { EmpRegistrationComponent } from './empregistration/empregistration.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { MasterTabsComponent } from './master-tabs/master-tabs.component';
import { LeaveapprovalComponent } from './leaveapproval/leaveapproval.component'
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { TeamWiseDashboardComponent } from './team-wise-dashboard/team-wise-dashboard.component';
import { AuthGuard } from './users/auth-guard.service';
import { DetailedGridComponent } from './detailed-grid/detailed-grid.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import{Timesheetcomponent} from './Timesheet/Timesheetentry.component'
import{ReportsComponent} from './reports/reports.component'
import{TimesheetDetailsComponent} from './timesheet-details/timesheet-details.component';

const appRoutes: Routes = [
  { path: 'signin', component: LoginComponent },
  { path: 'signin/Profile', component: EmpRegistrationComponent },
  { path: 'Profile', component: EmpRegistrationComponent },
  {
    path: 'authenticated', component: AuthenticatedUserComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '', canActivateChild: [AuthGuard],
        children: [
          { path: '', redirectTo: 'Home', pathMatch: 'full' },
          { path: 'Home', component: MasterTabsComponent },
          { path: 'Dashboard', component: EmployeeDashboardComponent },
          { path: 'Dashboard/:EMPName/:CurrentYear', component: EmployeeDashboardComponent },
          { path: 'Dashboard/:CurrentYear', component: EmployeeDashboardComponent },
          { path: 'ODCLeadDashboard', component: TeamDashboardComponent },
          { path: 'ODCLeadDashboard/:TeamName/:CurrentYear', component: TeamDashboardComponent },
          { path: 'HRDashboard', component: ManagementDashboardComponent },
          { path: 'LeaveApproval', component: LeaveapprovalComponent },
          { path: 'LeaveApproval/:EMPCode/:EMPName/:TeamName', component: LeaveapprovalComponent },
          { path: 'LeaveEntry/:ActiveTabName', component: LeaveEntryComponent },
          { path: 'LeaveDetail', component: DetailedGridComponent },
          { path: 'HoliDayWork/:ActiveTabName', component: LeaveEntryComponent },
          { path: 'EmployeeList', component: EmployeeListComponent },
          { path: 'Timesheetentry/:ActiveTabName', component: Timesheetcomponent },
          {path:'Report/:ActiveTabName/:EmployeeLeaveSummaryReport', component:ReportsComponent},
          {path:'Timesheetdetail/:ActiveTabName',component:TimesheetDetailsComponent}

        ]
      }
    ]
  },
  { path: '', component: LoginComponent },
  { path: '**', component: LoginComponent }
];
// const appRoutes: Routes = [
//   { path: '', component: Timesheetcomponent },
//      { path: '**', component: Timesheetcomponent }
// ]
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false })],
  exports: [RouterModule]

})
export class AppRoutingModule { }
