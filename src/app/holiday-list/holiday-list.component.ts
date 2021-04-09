import { Component, OnInit,Inject } from '@angular/core';
import { getLocaleDateFormat, DatePipe } from '@angular/common';
import { IHolidayList } from '../holiday-list/holiday-list.interface'
import { HolidayListService } from '../holiday-list/holiday-list.service'
import { UserService } from '../users/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss'],
  providers: [DatePipe]
})
export class HolidayListComponent implements OnInit {
  public HolidayList: IHolidayList[];
  public Year: string=this.DatePipe.transform(this.data.Viewdate,'yyyy');
  constructor( private HolidayService : HolidayListService, @Inject(MAT_DIALOG_DATA) private data: any,
               private UserService: UserService,public DatePipe:DatePipe) { }

  ngOnInit() {
    this.GetEmployeeHolidayDetails()
  }

  GetEmployeeHolidayDetails()
  {

    this.HolidayService.getHolidayListforthisYear(this.Year)
    .subscribe((data: IHolidayList[]) => {
      this.HolidayList = data;
    })
   
  }


}
