import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SmarthomeService } from 'src/app/services/smarthome.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarConfigService } from 'src/app/services/snackbar-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-device',
  templateUrl: './register-device.component.html',
  styleUrls: ['./register-device.component.css'],
})
export class RegisterDeviceComponent {
  // public deviceRegisterForm: any;
  public deviceName: any;
  public deviceBrand: any;
  public deviceType: any;
  public deviceWattage: any;

  constructor(
    private smarthomeservice: SmarthomeService,
    private snackbar: SnackbarConfigService,
    public dialogRef: MatDialogRef<RegisterDeviceComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {}
  public type: any;
  public brandAsPerDevice: any;
  public wattAsPerDevice: any;
  deviceDataList: any = [
    {
      name: 'Fan',
      brand: ['Havells', 'Crompton', 'Orient'],
      power: ['75', '50', '90'],
    },
    {
      name: 'LED',
      brand: ['Bajaj', 'Philips', 'Syska'],
      power: ['8', '12', '28'],
    },
    {
      name: 'AC',
      brand: ['Samsung', 'LG', 'Voltas'],
      power: ['3000', '1440', '4100'],
    },
  ];

  deviceChangeAction(device: any) {
    let dropDownData = this.deviceDataList.find(
      (data: any) => data.name === device
    );
    if (dropDownData) {
      this.brandAsPerDevice = dropDownData.brand;
      this.wattAsPerDevice = dropDownData.power;
    }
  }

  deviceRegisterForm = new FormGroup({
    thingType: new FormControl('', [Validators.required]),
    thingBrand: new FormControl('', [Validators.required]),
    wattage: new FormControl('', [Validators.required]),
    thingName: new FormControl('', [
      Validators.required,
      Validators.maxLength(19),
      Validators.pattern(/^[a-zA-Z0-9_-]*$/)
    ]),
  });

  public powerConsume = 0;
  public status = 'OFF';
  public temperature = 25;
  newDeviceSubmit() {
    this.smarthomeservice
      .createThing({
        ...this.deviceRegisterForm.value,
        powerConsume: this.powerConsume,
        status: this.status,
        temperature: this.temperature,
      })
      .subscribe({
        next: (result) => {
          console.log(result);

          this.dialogRef.close();
          this.router.navigate(['device-card']);
          this.snackBar.open(result.message, 'Dismiss', this.snackbar.commonSnackBarConfig);
        },
        error: (err) => {
          alert('Error while sending the data ' + err);
        },
      });
  }

  getErrorMessage(thingName: string) {
    const control = this.deviceRegisterForm.controls["thingName"];
    
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (thingName === 'thingName' && control?.hasError('maxlength')) {
      return 'Maximum length 20';
    }
    if (thingName === 'thingName' && control?.hasError('pattern')) {
      return 'device name containing only: letters, numbers, hyphens, not space';
    }
    return '';
  }
}
