import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
public ReportName: string = '';
public ReportURL: any = "";
public SSRSURL:string="http://192.168.1.137/Reports_SQL2016/report/";

  constructor(
    private ActiveRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {

    this.ActiveRoute.params.subscribe(params => {
      if (params != undefined) {
        debugger
        this.ReportName = (params.ActiveTabName);
        this.ReportURL = sanitizer.bypassSecurityTrustResourceUrl(this.SSRSURL + this.ReportName)
      }
    });
    console.log(this.ReportURL);
  }


  ngOnInit() {
  }

}
