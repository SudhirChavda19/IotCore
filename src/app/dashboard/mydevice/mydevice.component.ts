import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDeviceComponent } from '../register-device/register-device.component';

@Component({
  selector: 'app-mydevice',
  templateUrl: './mydevice.component.html',
  styleUrls: ['./mydevice.component.css'],
})
export class MydeviceComponent {
  constructor(public dialog: MatDialog) {}

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(RegisterDeviceComponent, {
      width: 'auto',
    });
  }

}
