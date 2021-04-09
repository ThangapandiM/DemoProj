import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './/app-routing.module';
import { MonthFilterPipe } from '././employee-dashboard/employee-dashboard-pipefilter';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxSpinnerModule } from 'ngx-spinner';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatSortModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgProgressModule } from 'ngx-progressbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
// import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/login/login.component';
import { LeaveEntryComponent } from './leave-entry/leave-entry.component';
import { EmpRegistrationComponent } from './empregistration/empregistration.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { MasterTabsComponent } from './master-tabs/master-tabs.component';
import { DetailedGridComponent } from './detailed-grid/detailed-grid.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { TeamWiseDashboardComponent } from './team-wise-dashboard/team-wise-dashboard.component';
import { LeaveapprovalComponent } from './leaveapproval/leaveapproval.component';
import { ContentComponent } from './content/content.component';
import { DialogOverviewExampleDialog, RejectDialogOverviewExampleDialog,BulkapproveDialogOverviewExampleDialog,empprofOverviewExampleDialog} from './leaveapproval/leaveapproval.component';
import { CancelDialogOverviewExampleDialog, ForgetcardDetailDialogOverviewExampleDialog } from './detailed-grid/detailed-grid.component';
import { ForgetCardDialogOverviewExampleDialog } from './leave-entry/leave-entry.component';
import{TimesheetentryOverviewExampleDialog} from './Timesheet/Timesheetentry.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { CalenderDashboardComponent } from './calender-dashboard/calender-dashboard.component';
import { EmployeeCalenderService } from './calender-dashboard/calender-dashboard.service'
import 'flatpickr/dist/flatpickr.css';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule } from 'angular-calendar';
//import { EDSTimesheetAPI } from '../Services/EDSTimesheetService';
import { UserService } from './users/user.service';
import { AuthGuard } from './users/auth-guard.service';
import { EmployeeRegistrationService } from './empregistration/employeeregistration.service';
import { LeaveEntryService } from './leave-entry/leave-entry.service';
import { EMPDetailedGridDetailService } from './detailed-grid/detailed-grid.service';
import { EmployeeDashboardService } from './employee-dashboard/employee-dashboard.service';
import { TeamDashboardService } from './team-dashboard/team-dashboard.service';
import { TeamWiseDashboardService } from './team-wise-dashboard/team-wise-dashboard.service';
import { LeaveApprovalService } from './leaveapproval/leaveapproval.service';
import { MasterTabsService } from './master-tabs/master-tabs.service';
import{TimesheetentryService} from './Timesheet/Timesheetentry.service';
import { ManagementDashboardService } from './management-dashboard/management-dashboard.service';
import { HolidayListService } from './holiday-list/holiday-list.service'
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import{Timesheetcomponent} from './Timesheet/Timesheetentry.component'
import { McattachmentdailogComponent } from './mcattachmentdailog/mcattachmentdailog.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { LocalStorageService } from './shared/local-storage.service';
import { EmployeeListService } from './employee-list/employee-list.service';
import { ReportsComponent } from './reports/reports.component';
//import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';
import{TimesheetdetailService} from './timesheet-details/timesheet-details.service';
import{ExcelService} from './excelservice/excelservice';
// import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LeaveEntryComponent,
    EmpRegistrationComponent,
    EmployeeDashboardComponent,
    AuthenticatedUserComponent,
    ContentComponent,
    MasterTabsComponent,
    DetailedGridComponent,
    TeamDashboardComponent,
    TeamWiseDashboardComponent,
    LeaveapprovalComponent,
    DialogOverviewExampleDialog,
    RejectDialogOverviewExampleDialog,
    MonthFilterPipe,
    CancelDialogOverviewExampleDialog,
    ForgetCardDialogOverviewExampleDialog,
    ForgetcardDetailDialogOverviewExampleDialog,
    ManagementDashboardComponent,
    CalenderDashboardComponent,
    HolidayListComponent,
    McattachmentdailogComponent,
    EmployeeListComponent,
    BulkapproveDialogOverviewExampleDialog,
    empprofOverviewExampleDialog,
    Timesheetcomponent,
    ReportsComponent,
    TimesheetDetailsComponent,
    TimesheetentryOverviewExampleDialog,
    // EmployeeRegistrationComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatGridListModule,
    MatDialogModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgProgressModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSlideToggleModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot(),
    MatExpansionModule,
    NgxSpinnerModule,
    MatChipsModule,
    // MatSortModule,
  ],
  entryComponents: [DialogOverviewExampleDialog, RejectDialogOverviewExampleDialog,
    CancelDialogOverviewExampleDialog, ForgetCardDialogOverviewExampleDialog,BulkapproveDialogOverviewExampleDialog,
    ForgetcardDetailDialogOverviewExampleDialog,empprofOverviewExampleDialog, HolidayListComponent, McattachmentdailogComponent,TimesheetentryOverviewExampleDialog],
  providers: [
    // EDSTimesheetAPI,
    AuthGuard,
    UserService,
    EmployeeRegistrationService,
    LeaveEntryService,
    EMPDetailedGridDetailService,
    EmployeeDashboardService,
    LeaveApprovalService,
    TeamDashboardService,
    TeamWiseDashboardService,
    MasterTabsService,
    ManagementDashboardService,
    EmployeeCalenderService,
    HolidayListService,
    CalenderDashboardComponent,
    LocalStorageService,
    EmployeeListService,
    TimesheetentryService,
    DatePipe,
    TimesheetdetailService,
    ExcelService


    // CookieService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

}
