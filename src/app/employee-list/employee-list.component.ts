import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { IEmployeeList } from './employeelist.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeListService } from './employee-list.service';
import { EmpRegistrationComponent } from '../empregistration/empregistration.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  EmployeeLists: IEmployeeList[];
  public errorMessage: any;
  searchKey = '';
  private currentUrl: string;

  public employeeList = new MatTableDataSource();
  public displayedColumns: string[] = ["SNo", "EMPName", "Gender", "TeamName", "EMPType", "EMPMobileNo", "EMPEmailID", "EMPDOB", "RoleType", "Actions"];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;



  constructor(
    private spinner: NgxSpinnerService,
    private employeeListService: EmployeeListService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.router.events.subscribe((_: NavigationEnd) => {
      this.currentUrl = _.url;
      console.log("Current URL =>", this.currentUrl);
    });
  }


  ngOnInit() {
    this.LoadEmployeeList();
  }

  private LoadEmployeeList() {
    this.spinner.show();
    this.employeeListService.GetAllEmployeeLists()
      .subscribe(data => {

        this.EmployeeLists = data
        this.employeeList = new MatTableDataSource(this.EmployeeLists);
        this.employeeList.sort = this.sort;
        this.employeeList.paginator = this.paginator;

        setTimeout(() => {
          this.spinner.hide();
        }, 1000);

      }, error => this.errorMessage = <any>error);


  }

  applyFilter() {
    this.employeeList.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "600px";
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { CurrentUrl: this.currentUrl }
    // this.dialog.open(EmpRegistrationComponent, dialogConfig);
    let dialogRef = this.dialog.open(EmpRegistrationComponent, dialogConfig);
  }


  openEditDialog(row: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "600px";
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { CurrentUrl: "", EditValue: row }
    let dialogRef = this.dialog.open(EmpRegistrationComponent, dialogConfig);

  }


}
