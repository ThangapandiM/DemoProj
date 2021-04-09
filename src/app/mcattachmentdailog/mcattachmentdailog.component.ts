import { Component, OnInit,Renderer,ElementRef,ViewChild } from '@angular/core';
import{IAttachmentMc} from './mcattachement.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-mcattachmentdailog',
  templateUrl: './mcattachmentdailog.component.html',
  styleUrls: ['./mcattachmentdailog.component.scss']
})
export class McattachmentdailogComponent implements OnInit {
  @ViewChild('FileInput', {static: false}) FileInput: ElementRef;
  image: String = "";
  public filename = "";
  public Attachment: string;
  public  Description: String;
  public FileType: String;
  public FileName: string;
  public Typename: String;
  public Type: String;
  public PopAttachment: IAttachmentMc;
  constructor(private renderer: Renderer,public dialogRef: MatDialogRef<McattachmentdailogComponent>) {
    this.filename = "";
    this.image = "";
      this.PopAttachment = {
        "Description": "",
        "Attachment": "",
        "FileName": "",
        "FileType": "",
        "Type": "",
        "Typename": ""
      }
   }

  ngOnInit() {
  }
  Attachmc(){
    let event = new MouseEvent('click', { bubbles: true });
    this.renderer.invokeElementMethod(
      this.FileInput.nativeElement, 'dispatchEvent', [event]);
   

  }
  cancel(){
    this.dialogRef.close();
  }
  onFileSelected(event) {
    

    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        

        this.filename = file.name;
        this.image = reader.result as String;
        this.PopAttachment.Description = file.name;
        this.PopAttachment.Attachment = reader.result as string;
        this.PopAttachment.Attachment = this.PopAttachment.Attachment.split(',')[1];
        this.PopAttachment.FileType = "." + (file.name as string).split('.')[1];
        this.PopAttachment.Type = "2";
        this.PopAttachment.FileName = file.name;
        this.PopAttachment.Typename = null;
        this.Attachment=this.PopAttachment.Attachment;
        this.FileType=this.PopAttachment.FileType;
        this.Type=this.PopAttachment.Type;
        this.Typename=this.PopAttachment.Typename
    
      this.dialogRef.close();
      
        

      };
    }


  }
}
