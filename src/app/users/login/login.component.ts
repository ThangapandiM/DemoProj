import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UserService } from '../../users/user.service';
import { LoginDeatils } from '../login/Interface';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public UserName: string = '';
  public Password: any;
  public Loginresult: LoginDeatils;
  public Logindata: any;
  public LoginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password=new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(15)]);
  public LoginErrorMessage: string;
  public IsErrorVisible: boolean = false;
  public Formdata: any = [];
  hide = true;
  public Icon:boolean=true;
  constructor(public userService: UserService,
    private router: Router, public appCom: AppComponent, public ngProgress: NgProgress,private spinner: NgxSpinnerService, public snackBar: MatSnackBar,private LocalStorageService : LocalStorageService) {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
  getpasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' :
      this.password.hasError('minLength') ? 'Too Short Password' :
        '';
  }

  ngOnInit(): void {
    this.LocalStorageService.clearAllItem();
  // this.Formdata.UserName='bala@eds.in';
  // this.Formdata.Password='1259';
    this.LoginForm = new FormGroup({
      'UserName': new FormControl(this.Formdata.UserName,
        Validators.required)
    });
    this.appCom.theme = "acer-theme";
    this.Loginresult = {
      "Description": "",
      "EMPCode": 0,
      "EMPID": 0,
      "EMPTypeID": 0,
      "Status": "",
      "EMPEmailID": "",
      "EMPName": "",
      "TeamName":"",
      "Gender":"",
      "Hierarchy":""

    }
  }
  GetLoginInfo() {
  
    //  this.Formdata.UserName="bala@eds.in";
    //  this.Formdata.Password="1259";
      // this.Formdata.UserName="1320@edsin";
      // this.Formdata.Password="1320";
    // this.Formdata.UserName="Padma.GScrambled@eds.in";
    // this.Formdata.Password="9005";
  //   this.Formdata.UserName="1259@edsin";
  //  this.Formdata.Password="1259";
  //    this.Formdata.UserName="9005@edsin";
  //  this.Formdata.Password="9005";
  
    this.spinner.show();
    this.getErrorMessage();
    this.getpasswordErrorMessage();
    this.userService.GetLogin(this.Formdata.UserName, this.Formdata.Password)
      .then(data => {
        this.Logindata = data;
        if (this.Logindata.Status == "Success"){
          this.Loginresult.Description = this.Logindata.Description
          this.Loginresult.EMPCode = this.Logindata.EMPCode
          this.Loginresult.EMPID = this.Logindata.EMPID
          this.Loginresult.EMPTypeID = this.Logindata.EMPTypeID
          this.Loginresult.Status = this.Logindata.Status
          this.Loginresult.EMPEmailID = this.Logindata.EMPEmailID
          this.Loginresult.EMPName = this.Logindata.EMPName
          this.Loginresult.TeamName = this.Logindata.TeamName
          this.Loginresult.Gender= this.Logindata.Gender
          this.Loginresult.Hierarchy=this.Logindata.Hierarchy
          this.userService.signIn(this.Loginresult.EMPCode, this.Loginresult.EMPID, this.Formdata.UserName, this.Loginresult.EMPEmailID, this.Formdata.Password, this.Loginresult.EMPName,this.Loginresult.EMPTypeID, this.Loginresult.TeamName,this.Loginresult.Gender, this.Loginresult.Hierarchy );
          this.router.navigate(['/authenticated']);
        }
        else if (this.Logindata.Status == "Error") {
          this.LoginErrorMessage = this.Logindata.Description;
          this.IsErrorVisible = true;
          this.Formdata.UserName = "";
          this.Formdata.Password = "";
          this.spinner.hide();
        }
      })
      setTimeout(() => {
      }, 800);
  }
  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = ['custom-class'];
    config.duration = 3000;
    config.verticalPosition = 'top';
    this.snackBar.open(message, action, config);
  }
  EnterKeyPress(event)
  {
    this.GetLoginInfo();
  }
}
