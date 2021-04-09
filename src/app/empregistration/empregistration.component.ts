import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material';

import { IEmployeeTypes, ITeam, IEmployeeResult, IEmployee } from '../empregistration/employee.Interface';
import { EmployeeRegistrationService } from '../empregistration/employeeregistration.service';
import { UserService } from '../users/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';

import { AppConstant } from '../shared/app.constant';
import { LocalStorageService } from '../shared/local-storage.service';


@Component({
  selector: 'app-empregistration',
  templateUrl: './empregistration.component.html',
  styleUrls: ['./empregistration.component.css']
})
export class EmpRegistrationComponent implements OnInit {

  employeeRegistration: IEmployee;
  employeeRegistrationResult: IEmployeeResult;
  employeeTeams: ITeam;
  employeeTypes: IEmployeeTypes;
  public myDate: string = new Date().toISOString();
  public errorMessage: any;
  public EmployeeTypes: any;
  public EmployeeTeams: any;
  public EmployeeDetails: any;
  public EmployeeRoles: any;
  public EmployerLists: any;
  public ValidationError: string;
  public EMPDate: any;
  public dateofbirth: any = "";
  public dateofjoining: any = "";
  public hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  EName = new FormControl('', Validators.required);
  EPassword = new FormControl('', Validators.required);
  ECode = new FormControl('', Validators.required);
  EmployeeType = new FormControl('', Validators.required);
  EmployeeTeamName = new FormControl('', Validators.required);
  EDOB = new FormControl('', Validators.required);
  EMobile = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  EMPDateOfJoin = new FormControl('', Validators.required);
  EMPRole = new FormControl('', Validators.required);
  EMPEmployer = new FormControl('', Validators.required);
  EmployeeGender = new FormControl('', Validators.required);
  public url: string;
  public empImgNameValidation: string = "";
  public userDetails: any;

  private currentUrl: string;
  public hideEMPName: boolean = true;
  public disableEMPCode: boolean = true;
  public disableEMPMailID: boolean = true;
  public disableEMPType: boolean = true;
  public disableEMPTeam: boolean = true;
  public disableEMPDOJ: boolean = true;
  public disableEMPRole: boolean = true;
  public disableEMPEmployer: boolean = true;
  public hideEMPRole: boolean = true;
  public hideEMPVendor: boolean = true;

  empGender: Array<any> = [{ 'Value': 'M', 'Name': 'Male' }, { 'Value': 'F', 'Name': 'Female' }];

  constructor(
    public employeeRegistrationService: EmployeeRegistrationService,
    public userService: UserService,
    private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog,
    private localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    /**getting employee image to profile */
    this.userDetails = {};
    this.userDetails = this.localStorage.getItem(AppConstant.LOCALSTORAGE.EMP_IMG_DTL);
    // console.log("Profile View Emp Image Dtls =>", JSON.stringify(this.userDetails));
    /** */
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        this.EName.hasError('required') ? 'You must enter a value' :
          this.EPassword.hasError('required') ? 'You must enter a value' :
            this.ECode.hasError('required') ? 'You must enter a value' :
              this.EMobile.hasError('required') ? 'You must enter a value' :
                this.EmployeeType.hasError('required') ? 'You must enter a value' :
                  this.EmployeeTeamName.hasError('required') ? 'You must enter a value' :
                    this.EDOB.hasError('required') ? 'You must enter a value' :
                      this.EMPDateOfJoin.hasError('required') ? 'You must enter a value' :
                        this.EMPRole.hasError('required') ? 'You must select a value' :
                          this.EMPEmployer.hasError('required') ? 'You must select a value' :
                            this.EmployeeGender.hasError('required') ? 'You must select a value' :
                              '';
  }

  onGenderChange(event) {
    this.employeeRegistration.Gender = event.value;
  }

  public readUrl(event: any) {

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let file = event.target.files[0];

      //check file is valid
      if (!this.validateFile(file.name)) {
        this.ValidationError = 'Selected file format is not supported';
        this.openSnackBar(this.ValidationError, "close", 'error');
        return false;
      }

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result as string;

        this.empImgNameValidation = file.name;

        this.employeeRegistration.EMPImgName = this.employeeRegistration.EMPCode + "." + (file.name as string).split('.')[1];
        this.employeeRegistration.EMPImgAttachment = reader.result as string;
        this.employeeRegistration.EMPImgAttachment = this.employeeRegistration.EMPImgAttachment.split(',')[1];
      }
      reader.readAsDataURL(event.target.files[0]);
      // console.log("employeeRegistration", this.employeeRegistration);
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'jpeg') {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit() {
    this.EMPDateOfJoin.disable();

    if (this.userDetails != null) {
      /**assigning employee image to profile */
      if (this.userDetails.ImgName != '' && this.userDetails.ImgName != null) {
        // this.employeeRegistration.EMPImgName = this.userDetails.ImgName;
        this.url = this.userDetails.ImgAttachment;
      }
      /** */
    }

    this.clearDetails();
    this.employeeRegistrationService.getEmployeeTypes().subscribe(data => {
      this.EmployeeTypes = data
    }, error => this.errorMessage = <any>error);

    this.employeeRegistrationService.getAllTeams().subscribe(data => {
      this.EmployeeTeams = data
    }, error => this.errorMessage = <any>error);

    this.getEmployeeRoles();
    this.getEmployersList();

    if (this.data != null) { // New Employee 
      if (this.data.CurrentUrl == "/authenticated/EmployeeList") {
        this.NewEmployeeRegister();
      }
      else {  //Edit Employee

        console.log("EDIT =>", this.data.EditValue)
        this.EnableDisableField();
        this.employeeRegistration = this.data.EditValue;
      }
    }
    else { //Profile View
      this.employeeRegistrationService.getEmployeeDetails(this.userService.EMPUserName, this.userService.EMPPassword)
        .subscribe(data => {
          this.employeeRegistration = data
          // console.log("getEmployeeDetails =>", this.employeeRegistration)
          this.dateofbirth = new FormControl(new Date(this.employeeRegistration.EMPDOB))
          this.dateofjoining = new FormControl(new Date(this.employeeRegistration.DateOfJoining))
        }, error => this.errorMessage = <any>error);
    }
  }

  private getEmployeeRoles() {
    this.employeeRegistrationService.getRoles()
      .subscribe(data => {
        this.EmployeeRoles = data;
        // console.log("this.EmployeeRoles =>", this.EmployeeRoles)
      }, error => this.errorMessage = <any>error);

  }

  private getEmployersList() {
    this.employeeRegistrationService.getEmployers().subscribe(data => {
      this.EmployerLists = data;
    }, error => { this.errorMessage = <any>error })
  }


  SaveEmployee() {

    this.EMPDate = this.dateofbirth.value;
    this.employeeRegistration.EMPDOB = this.EMPDate;
    this.employeeRegistration.DateOfJoining = this.dateofjoining.value;
    this.employeeRegistration.DateOfJoining = this.dateofjoining;
    console.log("Before SaveEmployee employeeRegistration =>", JSON.stringify(this.employeeRegistration));
    console.log("this.employeeRegistration.DateOfJoining =>", this.employeeRegistration.DateOfJoining);

    //|| this.employeeRegistration.DateOfJoining == null 
    //|| this.employeeRegistration.EMPDOB == null
    //|| this.employeeRegistration.RoleID == null || this.employeeRegistration.EmployerID == null

    // // if (this.employeeRegistration.EMPName == null || this.employeeRegistration.EMPTeamID == null || this.employeeRegistration.EMPCode == null
    // //   || this.employeeRegistration.EMPPassword == null || this.employeeRegistration.EMPMobileNo == null || this.employeeRegistration.EMPEmailID == null
    // //   || this.employeeRegistration.EMPTypeID == null || this.employeeRegistration.Gender == null
    // // ) {
    // //   this.ValidationError = "Please Enter the Missing value..";
    // //   this.openSnackBar(this.ValidationError, "", "warning");
    // // }


    if (this.employeeRegistration.EMPName == null || this.employeeRegistration.EMPName == "" || this.employeeRegistration.EMPName == undefined) {
      this.ValidationError = "Please Enter Name";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    else if (this.employeeRegistration.EMPPassword == null || this.employeeRegistration.EMPPassword == "" || this.employeeRegistration.EMPPassword == undefined) {
      this.ValidationError = "Please Enter Password";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    else if (this.employeeRegistration.EMPCode == null || this.employeeRegistration.EMPCode == "" || this.employeeRegistration.EMPCode == undefined) {
      this.ValidationError = "Please Enter Employee Code";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    else if (this.employeeRegistration.EMPEmailID == null || this.employeeRegistration.EMPEmailID == "" || this.employeeRegistration.EMPEmailID == undefined) {
      this.ValidationError = "Please Enter Mail ID";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    else if (this.employeeRegistration.EMPMobileNo == null || this.employeeRegistration.EMPMobileNo == "" || this.employeeRegistration.EMPMobileNo == undefined) {
      this.ValidationError = "Please Enter Mobile No";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    // else if (this.employeeRegistration.EMPDOB == null || this.employeeRegistration.EMPDOB == "") {
    //   this.ValidationError = "Please Select Date of Birth";
    //   this.openSnackBar(this.ValidationError, "close", "warning");
    // }
    else if (this.employeeRegistration.Gender == null || this.employeeRegistration.Gender == "" || this.employeeRegistration.Gender == undefined) {
      this.ValidationError = "Please Select Gender";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    else if (this.employeeRegistration.EMPTypeID == null || this.employeeRegistration.EMPTypeID == 0 || this.employeeRegistration.EMPTypeID == undefined) {
      this.ValidationError = "Please Select Employee Type";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    else if (this.employeeRegistration.EMPTeamID == null || this.employeeRegistration.EMPTeamID == 0 || this.employeeRegistration.EMPTeamID == undefined) {
      this.ValidationError = "Please Select Team Name";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    // else if (this.employeeRegistration.DateOfJoining == null || this.employeeRegistration.DateOfJoining == "" || this.employeeRegistration.DateOfJoining == undefined) {
    //   this.ValidationError = "Please Select  Date of Joining";
    //   this.openSnackBar(this.ValidationError, "close", "warning");
    // }
    else if (this.dateofjoining.value == null || this.dateofjoining.value == "" || this.dateofjoining.value == undefined) {
      this.ValidationError = "Please Select  Date of Joining";
      this.openSnackBar(this.ValidationError, "close", "warning");
    }
    // else if (this.employeeRegistration.RoleID == null || this.employeeRegistration.RoleID == "" || this.employeeRegistration.RoleID == "0" || this.employeeRegistration.RoleID == undefined) {
    //   this.ValidationError = "Please Select  Role Type";
    //   this.openSnackBar(this.ValidationError, "close", "warning");
    // }
    // else if (this.employeeRegistration.EmployerID == null || this.employeeRegistration.EmployerID == "" || this.employeeRegistration.EmployerID == "0" || this.employeeRegistration.EmployerID == undefined) {
    //   this.ValidationError = "Please Select  Employer";
    //   this.openSnackBar(this.ValidationError, "close", "warning");
    // }
    else {

      /** updating old img;if not selected image */
      if (this.empImgNameValidation == "") {
        this.employeeRegistration.EMPImgAttachment = this.employeeRegistration.EMPImgAttachment.split(',')[1];
      }
      /** */
      console.log("this.employeeRegistration =>", JSON.stringify(this.employeeRegistration));

      this.employeeRegistrationService.SaveEmployee(this.employeeRegistration).subscribe(result => {
        this.employeeRegistrationResult = <IEmployeeResult>result
        this.ValidationError = this.employeeRegistrationResult.Description;
        if (this.employeeRegistrationResult.Status.toUpperCase() == "SUCCESS") {
          this.openSnackBar(this.ValidationError, "", 'success');
        }
        else {
          this.openSnackBar(this.ValidationError, "", 'error');
        }
        this.clearDetails();
        const dialogConfig = new MatDialogConfig();
        this.dialog.closeAll();
        this.userService.signOut();
        this.router.navigate(['/signin']);
      },
        error => {
          this.errorMessage = <any>error
        });
    }
  }

  openSnackBar(message: string, action: string, messagetype: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = [messagetype + '-class'];
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }

  clearDetails() {
    this.employeeRegistration =
      {
        "EMPName": "",
        "EMPTeamID": 0,
        "EMPCode": "",
        "EMPPassword": "",
        "EMPMobileNo": "",
        "EMPEmailID": "",
        "EMPDOB": this.myDate,
        "EMPTypeID": 0,
        "EMPImgAttachment": "",
        "EMPImgName": "",
        "Gender": "",
        "DateOfJoining": "",
        "RoleID": "",
        "EmployerID": "",
      };
  }
  navigateSignIn() {
    if (this.userService != null) {

      if (this.userService.EMPCode != null && this.userService.EMPCode != "") {
        this.router.navigate(['/authenticated/Dashboard']);
      }
      else {
        this.router.navigate(['/signin']);
      }
    }
    else {
      this.router.navigate(['/signin']);
    }

  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  private NewEmployeeRegister() {

    try {

      // console.log("data data =>", this.data.CurrentUrl);
      if (this.data.CurrentUrl == "/authenticated/EmployeeList") {

        // this.url = ""; // for clearing current logged employee image.
        // this.hideEMPName = false; // for enter new employee name
        // this.disableEMPCode = false;
        // this.disableEMPMailID = false;
        // this.disableEMPType = false;
        // this.disableEMPTeam = false;
        // this.disableEMPDOJ = false;
        // this.EMPDateOfJoin.enable();
        // this.disableEMPRole = false;
        // this.disableEMPEmployer = false;
        // this.hideEMPRole = false;
        // this.hideEMPVendor = false;
        this.EnableDisableField();
        this.clearDetails();
      }

    } catch (error) {

    }
  }

  public EnableDisableField() {
    this.url = ""; // for clearing current logged employee image.
    this.hideEMPName = false; // for enter new employee name
    this.disableEMPCode = false;
    this.disableEMPMailID = false;
    this.disableEMPType = false;
    this.disableEMPTeam = false;
    this.disableEMPDOJ = false;
    this.EMPDateOfJoin.enable();
    this.disableEMPRole = false;
    this.disableEMPEmployer = false;
    this.hideEMPRole = false;
    this.hideEMPVendor = false;
  }
}
