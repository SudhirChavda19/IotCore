import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDeviceComponent } from '../register-device/register-device.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public dialog: MatDialog) {}

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(RegisterDeviceComponent, {
      width: 'auto', height: '450px'
    });
  }
}
