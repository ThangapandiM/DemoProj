import { Component,OnInit } from '@angular/core';
import { OverlayContainer} from '@angular/cdk/overlay';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 title = 'app';
 theme="acer-theme";
 constructor(public Overlay:OverlayContainer,private spinner: NgxSpinnerService)
 {
 }
 ngOnInit(): void {
    this.spinner.show();
 // subscribe to some source of theme change events, then...
 this.Overlay.getContainerElement().classList.add(this.theme);
  
 setTimeout(() => {
    this.spinner.hide();
}, 500);
 }
 onthemechanage(): void {
    this.spinner.show();
 // subscribe to some source of theme change events, then...
  this.Overlay.getContainerElement().classList.add(this.theme);
   
  setTimeout(() => {
    this.spinner.hide();
}, 500);
 }
}



