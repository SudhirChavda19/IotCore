import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mydevice',
  templateUrl: './mydevice.component.html',
  styleUrls: ['./mydevice.component.css'],
})
export class MydeviceComponent {

 public deviceType : any = ["AC", "Fan", "LED"] 
  constructor(public dialog: MatDialog) {}

    
  ngOnInit() {
    
  }



}
