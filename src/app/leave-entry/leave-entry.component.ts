import { Component, Renderer, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import {
  MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition,
  MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';
import { NgProgress } from 'ngx-progressbar';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { NgxSpinnerService } from 'ngx-spinner';
import { getLocaleDateFormat, DatePipe } from '@angular/common';
import { ResponseContentType, Http } from '../../../node_modules/@angular/http';

// Interfaces
import {
  ILeaveDetail, ISaveattachment, ILeaveType, ILeaveResult,
  IEmployeeDetails, IForgetCardResult, IForgetCardDeatails,
  IHolidayWorkDetails, IWorkLocation, IWorkType, IAttachmentMc
} from '../leave-entry/Leave-entry.Interface';

// Services
import { LeaveEntryService } from '../leave-entry/leave-entry.service';
import { UserService } from '../users/user.service';
import { LeavemanagementserviceConfig } from '../leavemanagement.serviceconfig';

// Component
import { McattachmentdailogComponent } from '../mcattachmentdailog/mcattachmentdailog.component';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../shared/app.constant';

@Component({
  selector: 'app-leave-entry',
  templateUrl: './leave-entry.component.html',
  styleUrls: ['./leave-entry.component.css'],
  providers: [DatePipe]
})
export class LeaveEntryComponent implements OnInit {
  @ViewChild('FileInput', {static: false}) FileInput: ElementRef;
  form: FormGroup;
  LeaveEntry: ILeaveDetail;
  AttachmentMc: IAttachmentMc;
  LeaveType: ILeaveType;
  LeaveResult: ILeaveResult;
  ForgetcardDetail: IForgetCardDeatails;
  ForgetcardResult: IForgetCardResult;
  public myDate: string = new Date().toISOString();
  public errorMessage: any;
  public Leavetypes: ILeaveType[];
  public validationMessage: string;
  public maxDate = new Date(2030, 11, 31, 10, 30);
  filteredOptions: Observable<any[]>;
  public CompensatoryWorkDetails: IHolidayWorkDetails[];
  public HolidayWorkDetails: IHolidayWorkDetails[];
  public ExtendedWorkDetails: IHolidayWorkDetails[];
  public EmployeeDetails: IEmployeeDetails[];
  public EmployeeDetails1: IEmployeeDetails[];
  public DefaultEmpName: string;
  public EMPCode: string;
  myControl: FormControl;
  public test: string = "False";
  public LeaveToDisable: boolean = false;
  public buttonflg: boolean = false;
  public Icon: boolean = true;
  public ForgetDeatails: any;
  public ValidationError: string;
  public holidayhalfflag: boolean = false;
  public Activetab: string = "";
  ForgetCardHide: boolean = false;
  public Wholevisible: boolean = true;
  public Partialvisible: boolean = false;
  public ToggleFlag: boolean = true;
  color = 'primary';
  disabled = false;
  public ToggleValue: boolean = true;
  public WorkLocation: IWorkLocation[];
  public ToggleVisible: boolean = true;
  public MethodType: string = "";
  public Worktypes: IWorkType[];
  public ExtLeaveIDstring: string = "";
  public HolidayWorkIDstring: string = "";
  public Gender: string;
  public HolidayArray = new Array();
  public ExtWorkArray = new Array();
  public FromDate: string;
  public minDate: Date;
  image: String = "";
  public AttchMcbutton: Boolean = false;
  filename = "";
  public attachMc: Boolean = false;
  public WorkReason: Boolean;
  public FilenameList: Boolean;
  public AttachRequiredMessage: String;
  public SaveattachmentMC: ISaveattachment;
  public Fromdate: Date;
  public Todate: Date;
  @ViewChild('LeaveFromDate', {static: false}) Fdate;
  public ValidateFromDate: string;
  public url: string;
  private userDetails: any;

  constructor(public LeaveEntryService: LeaveEntryService,
    public userService: UserService, public snackBar: MatSnackBar,
    public ngProgress: NgProgress, public dialog: MatDialog, private router: Router,
    private route: ActivatedRoute, private spinner: NgxSpinnerService, private renderer: Renderer,
    public datePipe: DatePipe,
    private _http: Http,
    private localStorage: LocalStorageService) {
    this.myControl = new FormControl();
    this.AttachmentMc = {
      "Description": "",
      "Attachments": "",
      "FileName": "",
      "FileType": "",
      "Type": "",
      "Typename": ""
    },
      this.SaveattachmentMC = {
        "LeaveID": "",
        "FileType": "",
        "FileName": "",
        "Attachments": "",
        "CreatedBy": ""
      }
    this.EmployeeDetails = [
      {
        "EMPID": 0,
        "EMPCODE": "",
        "EMPName": "",
        "Gender": ""
      }
    ]
    /**getting employee image to profile */
    this.userDetails = {};
    this.userDetails = this.localStorage.getItem(AppConstant.LOCALSTORAGE.EMP_IMG_DTL);
    // console.log("Profile View Emp Image Dtls =>", JSON.stringify(this.userDetails));
    /** */
    if (this.userDetails != null) {
      this.url = this.userDetails.ImgAttachment;
    }
  }

  onFileSelected(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.filename = file.name;
        this.image = reader.result as String;
        this.AttachmentMc.Description = file.name;
        this.AttachmentMc.Attachments = reader.result as string;
        this.AttachmentMc.Attachments = this.AttachmentMc.Attachments.split(',')[1];
        this.AttachmentMc.FileType = "." + (file.name as string).split('.')[1];
        this.AttachmentMc.Type = "2";
        this.AttachmentMc.FileName = file.name;
        this.AttachmentMc.Typename = null;
        this.attachMc = false;
        this.AttachRequiredMessage = "";
        this.FilenameList = true;
        console.log("onFileSelected=>", JSON.stringify(this.AttachmentMc));
      };

    }
  }

  openattachementMc() {
    const dialogRef = this.dialog.open(McattachmentdailogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: "10px" },
      data: {
        message: 'Sick Leave more than 2 days required medical certificate'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.filename = dialogRef.componentInstance.filename;
      this.AttachmentMc.Description = dialogRef.componentInstance.Description;
      this.AttachmentMc.Attachments = dialogRef.componentInstance.Attachment;
      this.AttachmentMc.Attachments = dialogRef.componentInstance.Attachment;
      this.AttachmentMc.FileType = dialogRef.componentInstance.FileType;
      this.AttachmentMc.Type = "2";
      this.AttachmentMc.FileName = dialogRef.componentInstance.filename;
      this.AttachmentMc.Typename = null;
      this.attachMc = false;
      this.AttachRequiredMessage = "";
      this.FilenameList = true;
    });
  }
  //Forget Card Entry
  openForgetCardDialog(): void {
    let ForgetCarddialogRef = this.dialog.open(ForgetCardDialogOverviewExampleDialog, {

      disableClose: true,
      width: '350px',
      data: { cardDetail: this.ForgetcardDetail },

    });



    ForgetCarddialogRef.afterClosed().subscribe(result => {
      this.ForgetcardDetail = result;
      if (Boolean(this.ForgetcardDetail) != false) {
        if (this.ForgetcardDetail.CardID == "" || this.ForgetcardDetail.Date == null) {
          this.validationMessage = "Please Enter the Missing Values"
          this.openSnackBar(this.validationMessage, "", "warning");
        }
        else {
          this.SaveForgetCardDetail();
        }
      }
      else {
        this.ClearForgetCardEntry();
        this.validationMessage = "Card not Saved!!"
        this.openSnackBar(this.validationMessage, "", "warning");
      }
    });
  }
  filterNames(name: string) {
    return this.EmployeeDetails.filter(empName =>
      empName.EMPName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  open() {
    this.Fdate.open();
  }
  ngOnInit() {
    this.spinner.show();
    this.clearLeaveEntry();
    this.ClearForgetCardEntry();
    this.MethodType = "Leave Type"
    this.FromDate = new Date().toISOString();
    this.GetEmployeeName();
    this.GetLeaveType(this.userService.EMPCode)
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  Togglechange() {

    if (this.ToggleValue == true) {
      this.Partialvisible = false
      this.Wholevisible = true
      this.LeaveEntry.LeaveFromDate = "";
      this.LeaveEntry.LeaveToDate = ""
    }
    else {
      this.Wholevisible = false
      this.Partialvisible = true
      this.LeaveEntry.LeaveFromDate = "";
      this.LeaveEntry.LeaveToDate = ""
    }
  }
  GetEmployeeName() {
    debugger
    this.spinner.show();
    this.LeaveEntryService.getEmployeeNameDetails(this.userService.EMPCode)
      .subscribe((data: IEmployeeDetails[]) => {
        debugger;
        this.EmployeeDetails = data
        if (this.EmployeeDetails.length > 1) {
          this.EmployeeDetails.splice(0, 1);
        }
        this.DefaultEmpName = this.EmployeeDetails[0].EMPName;
        this.LeaveEntry.EMPCODE = this.EmployeeDetails[0].EMPCODE;
        this.Gender = this.EmployeeDetails[0].Gender
        this.EMPCode = this.LeaveEntry.EMPCODE;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(empName => empName ? this.filterNames(empName) : this.EmployeeDetails.slice())
          );
        this.spinner.hide();
      }, error => this.errorMessage = <any>error);
  }
  GetLeaveType(EMPCODE) {

    this.spinner.show();
    this.LeaveEntryService.GetLeaveTypes(EMPCODE)
      .subscribe((data: ILeaveType[]) => {
        this.Leavetypes = data
        if (this.route.snapshot.paramMap.get("ActiveTabName") == "HoliDayWork") {
          this.Activetab = this.route.snapshot.paramMap.get("ActiveTabName");
          this.GetWorkTypes();
          this.LeaveToDisable = true;
          this.MethodType = "Work Type";
          this.GetWorkLocation();
        }
        this.spinner.hide();
      }, error => this.errorMessage = <any>error);
  }

  EmployeeChange(EName: string) {
    this.spinner.show();
    this.EmployeeDetails1 = this.EmployeeDetails.filter(empName =>
      empName.EMPName.toLowerCase().indexOf(EName.toLowerCase()) === 0);
    this.EMPCode = this.EmployeeDetails1[0].EMPCODE;
    this.Gender = this.EmployeeDetails1[0].Gender;
    this.GetLeaveType(this.EMPCode)
    this.clearLeaveEntry();
    this.spinner.hide();
  }
  clearLeaveEntry() {
    this.LeaveEntry = {
      "EMPCODE": this.EMPCode,
      "LeaveTypeID": "",
      "LeaveFromDate": "",
      "LeaveToDate": "",
      "LeaveStatusID": 1,
      "LeaveRemarks": "",
      "LeaveApproval": false,
      "LeaveApproveRemarks": "",
      "LeaveApprovedBy": "",
      "CreatedBy": this.userService.EMPCode,
      "HolidayWorkID": "",
      "IsPartial": false,
      "WorkLocationID": "",
      "ExtendedWorkID": ""
    };
    this.AttchMcbutton = false;
    this.filename = "";
  }
  ClearForgetCardEntry() {
    this.ForgetcardDetail = {
      "EMPCODE": this.userService.EMPCode,
      "CardID": "",
      "Remarks": "Forgot to Bring.",
      "Date": this.myDate
    }
    this.ForgetcardResult = {
      "Status": "",
      "Description": "",
      "CardID": "",
    }
  }
  SaveLeaveDetail() {
    this.spinner.show();
    var Fromdate = this.datePipe.transform(this.LeaveEntry.LeaveFromDate, 'dd');
    var todate = this.datePipe.transform(this.LeaveEntry.LeaveToDate, 'dd');
    let noOfDays = ((+(todate)) - (+(Fromdate))) + 1;
    this.LeaveEntry.IsPartial = this.Partialvisible;
    this.LeaveEntry.ExtendedWorkID = this.ExtLeaveIDstring;
    this.LeaveEntry.HolidayWorkID = this.HolidayWorkIDstring;
    if (this.LeaveEntry.IsPartial == false && this.LeaveEntry.LeaveTypeID == '6') {
      this.LeaveEntry.LeaveToDate = this.LeaveEntry.LeaveFromDate;
    }
    let CurrentDate : Date = new Date();
    // console.log("this.LeaveEntry.IsPartial =>", this.LeaveEntry.IsPartial)
    // console.log("this.LeaveEntry.LeaveTypeID =>", this.LeaveEntry.LeaveTypeID)

    if (this.LeaveEntry.IsPartial == false && this.LeaveEntry.LeaveTypeID == '2') {
      this.LeaveEntry.LeaveToDate = this.LeaveEntry.LeaveFromDate;
    }


    if ((this.LeaveEntry.LeaveTypeID == "2") && ((this.LeaveEntry.HolidayWorkID == "") && (this.LeaveEntry.ExtendedWorkID == ""))) {
      this.spinner.hide();
      this.validationMessage = "Please Choose the Holiday work or Extended work";
      this.openSnackBar(this.validationMessage, "Close", "warning");
    }
    else if ((this.LeaveEntry.WorkLocationID == "") && (this.LeaveEntry.LeaveTypeID == '9' || this.LeaveEntry.LeaveTypeID == '6')) {
      this.spinner.hide();
      this.validationMessage = "Please Choose the Work Location";
      this.openSnackBar(this.validationMessage, "Close", "warning");
    }
    else if ((this.LeaveEntry.LeaveTypeID == "3") && (new Date(this.LeaveEntry.LeaveFromDate) > CurrentDate )) {
      this.spinner.hide();
      this.validationMessage = "Sick Leave Cannot be applied for Future Date";
      this.openSnackBar(this.validationMessage, "Close", "warning");
    }
    else if ((this.LeaveEntry.LeaveTypeID == "3") && this.filename == "" && noOfDays > 2) {
      this.spinner.hide();
      this.validationMessage = "Please Choose Medical Certificate";
      this.openSnackBar(this.validationMessage, "Close", "warning");
    }
    else if (this.LeaveEntry.LeaveToDate >= this.LeaveEntry.LeaveFromDate) {
      this.LeaveEntry.CreatedBy = this.userService.EMPID;

      this.buttonflg = true;

      this.LeaveEntryService.SaveLeaveDetail(this.LeaveEntry)
        .subscribe(
          result => {

            this.ngProgress.done();
            this.LeaveResult = <ILeaveResult>result
            this.validationMessage = this.LeaveResult.Description;

            if (this.LeaveResult.Status.toUpperCase() == "SUCCESS") {
              this.openSnackBar(this.validationMessage, "Close", 'success');

              if ((this.LeaveEntry.LeaveTypeID == "3") && this.filename != "" && noOfDays > 2) {
                this.fnUploadFile(this.LeaveResult.LeaveID, this.userService.EMPID);
              }

              this.clearLeaveEntry();
              this.HolidayWorkIDstring = "";
              this.ExtLeaveIDstring = "";
              this.HolidayArray = new Array();
              this.ExtWorkArray = new Array();
            }
            else {
              this.openSnackBar(this.validationMessage, 'Close', 'error');
            }

            this.buttonflg = false;
            this.spinner.hide();
          },
          error => {
            this.buttonflg = false;
            this.errorMessage = <any>error
          })
    }
    else {
      this.spinner.hide();
      this.validationMessage = "* Valid Date Range Required."
      this.openSnackBar(this.validationMessage, "Close", "warning");
    }
  }


  fnUploadFile(LeaveID: string, CreatedBy: string) {

    try {
      this.SaveattachmentMC.LeaveID = (LeaveID as string).split(',')[0];
      this.SaveattachmentMC.FileType = this.AttachmentMc.FileType;
      this.SaveattachmentMC.FileName = this.AttachmentMc.FileName;
      this.SaveattachmentMC.Attachments = this.AttachmentMc.Attachments;
      this.SaveattachmentMC.CreatedBy = CreatedBy;
      this.spinner.show();
      this.LeaveEntryService.UpdateMCAttachment(this.SaveattachmentMC)
        .subscribe(result => { },
          error => {
            this.errorMessage = <any>error;
            this.spinner.show();
          });
    } catch (error) {
      alert(error);
    }

  }



  openSnackBar(message: string, action: string, messagetype: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = [messagetype + '-class'];
    config.duration = 7000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }
  clearPop() {
    this.filename = "";
    this.image = "";
    this.AttachmentMc = {
      "Description": "",
      "Attachments": "",
      "FileName": "",
      "FileType": "",
      "Type": "",
      "Typename": ""
    }
    this.attachMc = true;
    this.FilenameList = false;

    var Fromdate = this.datePipe.transform(this.LeaveEntry.LeaveFromDate, 'dd');
    var todate = this.datePipe.transform(this.LeaveEntry.LeaveToDate, 'dd');
    var diffDays = Number(todate) - Number(Fromdate) + 1;
    // if(this.LeaveEntry.LeaveTypeID=="3"&& diffDays>2 && this.filename==""){
    //   this.AttachRequiredMessage="Please Attach Medical Certificate for more than 2 days Sick Leave";
    // }
  }

  LTypeChanges() {
    // LeaveTypeID == "3"    SICK LEAVE
    if (this.LeaveEntry.LeaveTypeID == "3") {
      this.AttchMcbutton = true;
    }
    else {
      this.AttchMcbutton = false;
    }
    if (this.ToggleValue == true) {
      this.Wholevisible = true;
      this.Partialvisible = false;
      this.ToggleVisible = true;
    }
    else {
      this.Wholevisible = false;
      this.Partialvisible = true;
      this.ToggleVisible = true;
    }
    if (this.LeaveEntry.LeaveTypeID == "9") {
      this.Partialvisible = true;
      this.Wholevisible = false;
      this.ToggleVisible = false;
      this.GetWorkLocation();
    }
    else if (this.LeaveEntry.LeaveTypeID == "4") {
      this.Partialvisible = true;
      this.Wholevisible = false;
      this.ToggleVisible = false;
    }
    else {
      this.WorkLocation = null;
      if (this.ToggleValue == true) {
        this.Wholevisible = true;
        this.Partialvisible = false;
        this.ToggleVisible = true;
      }
      else {
        this.Wholevisible = false;
        this.Partialvisible = true;
        this.ToggleVisible = true;
      }
    }
    if (this.LeaveEntry.LeaveTypeID == "6") {
      this.ToggleFlag = false;
      this.GetWorkLocation();
    }
    else if (this.LeaveEntry.LeaveTypeID == "1") {
      this.minDate = new Date();
    }
    else {
      this.minDate = new Date(2017, 11, 31, 10, 30);
      this.WorkLocation = null;
    }
    this.OndateChange();
  }

  OndateChange() {

    var Fromdate = this.datePipe.transform(this.LeaveEntry.LeaveFromDate, 'dd');
    var todate = this.datePipe.transform(this.LeaveEntry.LeaveToDate, 'dd');
    var diffDays = Number(todate) - Number(Fromdate) + 1;





    if (this.LeaveEntry.LeaveTypeID == "3" && diffDays > 2 && this.filename == "") {
      this.buttonflg = false;
      this.attachMc = true;
      // let event = new MouseEvent('click', { bubbles: true });
      // this.renderer.invokeElementMethod(this.FileInput.nativeElement, 'dispatchEvent', [event]);
      this.openattachementMc();
    }
    else if (this.LeaveEntry.LeaveTypeID == "3" && diffDays == 2 || diffDays < 2) {
      this.attachMc = false;
    }
    else if (this.LeaveEntry.LeaveTypeID == "3" && diffDays > 2 && this.filename !== "") {
      this.attachMc = false;
    }


    if ((this.LeaveEntry.LeaveTypeID == "2") || (this.LeaveEntry.LeaveTypeID == "6")) {
      this.LeaveEntry.LeaveToDate = this.LeaveEntry.LeaveFromDate;

      if (this.Partialvisible == true) {
        this.LeaveToDisable = false;
      }
      else {
        this.LeaveToDisable = true;
      }
    }
    else {
      this.LeaveToDisable = false;
    }
    if (this.LeaveEntry.LeaveTypeID == "2") {

    }
    if (this.Partialvisible == true && this.LeaveEntry.LeaveTypeID == "9") {
      this.LeaveToDisable = false;
    }
    if ((this.LeaveEntry.LeaveTypeID == "2") && (this.LeaveEntry.LeaveFromDate != "")) {
      this.GetHolidayDetails(this.LeaveEntry.EMPCODE, this.LeaveEntry.LeaveFromDate)
    }
    else {
      this.HolidayWorkDetails = null;
    }

    /**Validation Start */
    this.ValidateFromDate = this.LeaveEntry.LeaveFromDate;
    //  this.LeaveEntry.LeaveToDate = null;
    // console.log("this.ValidateFromDate =>", this.ValidateFromDate)
    /**Validation Start */
  }

  public OnFromDtChangeClear() {
    this.LeaveEntry.LeaveToDate = "";
  }

  dateChange() {
    

    // let days=this.LeaveEntry.LeaveToDate-this.LeaveEntry.LeaveFromDate
  }
  SaveForgetCardDetail() {
    this.LeaveEntryService.CommitForgetcardDeatail(this.ForgetcardDetail)
      .subscribe(
        result => {
          this.ForgetcardResult = <IForgetCardResult>result
          this.ValidationError = this.ForgetcardResult.Description;
          this.openSnackBar(this.ValidationError, "", "warning");
          this.ClearForgetCardEntry();
        },
        error => {
          this.errorMessage = <any>error
        })
  }

  GetHolidayDetails(EMPCODE, FromDate) {
    if (FromDate != "") {
      FromDate = this.datePipe.transform(FromDate, 'yyyy-MM-dd');
    }

    this.LeaveEntryService.GetHolidayWorkDetails(EMPCODE, FromDate)
      .subscribe(data => {

        this.CompensatoryWorkDetails = data;

        if (this.CompensatoryWorkDetails != null && this.CompensatoryWorkDetails.length != 0) {

          if (this.CompensatoryWorkDetails[0].LeavetypeID == "6") {
            this.WorkReason = true;
          }
          this.HolidayWorkDetails = this.CompensatoryWorkDetails.filter(Detail =>
            Detail.LeavetypeID.toLowerCase().indexOf("6") === 0);
          this.ExtendedWorkDetails = this.CompensatoryWorkDetails.filter(Detail =>
            Detail.LeavetypeID.toLowerCase().indexOf("9") === 0);
        }
      }, error => this.errorMessage = <any>error);
    this.HolidayWorkIDstring = "";
    this.ExtLeaveIDstring = "";
    this.HolidayArray = new Array();
    this.ExtWorkArray = new Array();
  }

  GetWorkLocation() {
    this.spinner.show();
    this.LeaveEntryService.GetWorkLocation()
      .subscribe(data => {
        this.WorkLocation = data
        this.LeaveEntry.WorkLocationID = this.WorkLocation[0].LocationID
        this.spinner.hide();
      }, error => this.errorMessage = <any>error);
  }
  GetWorkTypes() {
    this.spinner.show();
    this.LeaveEntryService.GetWorkTypes()
      .subscribe(data => {
        this.Worktypes = data
        this.Leavetypes = this.Worktypes;
        this.spinner.hide();
      }, error => this.errorMessage = <any>error);
  }
  ExtChecked(ExtDetails: any) {
    const index: number = this.ExtWorkArray.indexOf(ExtDetails.LeaveID);
    if (index !== -1) {
      this.ExtWorkArray.splice(index, 1);
    }
    else
      this.ExtWorkArray.push(ExtDetails.LeaveID)

    this.ExtLeaveIDstring = ""
    this.ExtWorkArray.forEach(data => {

      if (this.ExtLeaveIDstring.length == 0) {
        this.ExtLeaveIDstring = data;
      }
      else {
        this.ExtLeaveIDstring = this.ExtLeaveIDstring + "," + data
      }

    })

  }
  HolidayChecked(HolidayDetails: any) {
    const index: number = this.HolidayArray.indexOf(HolidayDetails.LeaveID);
    if (index !== -1) {
      this.HolidayArray.splice(index, 1);
    }
    else
      this.HolidayArray.push(HolidayDetails.LeaveID)

    this.HolidayWorkIDstring = ""
    this.HolidayArray.forEach(data => {

      if (this.HolidayWorkIDstring.length == 0) {
        this.HolidayWorkIDstring = data;
      }
      else {
        this.HolidayWorkIDstring = this.HolidayWorkIDstring + "," + data
      }

    })
  }

}
@Component({
  selector: 'ForgetCard',
  templateUrl: 'ForgetCard.html',
  styleUrls: ['./ForgetCard.css']
})
export class ForgetCardDialogOverviewExampleDialog {

  constructor(
    public ForgetCarddialogRef: MatDialogRef<ForgetCardDialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.ForgetCarddialogRef.close();
  }

}
