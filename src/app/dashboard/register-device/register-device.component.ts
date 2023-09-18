import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-device',
  templateUrl: './register-device.component.html',
  styleUrls: ['./register-device.component.css']
})
export class RegisterDeviceComponent {

  public deviceRegisterForm: any;
  public deviceName: any;
  public deviceBrand: any;
  public deviceType: any;
  public deviceWattage: any;

  ngOnInit(): void {
    this.deviceRegisterForm = new FormGroup({
      deviceName: new FormControl('', [
        Validators.required,
        Validators.maxLength(40),
      ]),
      deviceBrand: new FormControl('', [Validators.required]),
      deviceType: new FormControl('', [Validators.required]),
      deviceWattage: new FormControl('', [Validators.required]),
    });
  }
}
