import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SmarthomeService } from 'src/app/services/smarthome.service';

@Component({
  selector: 'app-devicecard',
  templateUrl: './devicecard.component.html',
  styleUrls: ['./devicecard.component.css'],
})
export class DevicecardComponent {
  public temperature: any = 25;
  public deviceId :any;

  @Input() deviceType: any;
  public allThings: any[] = [];
  public filteredData: { device: any, isPower: boolean, temperature: number }[] = [];
  constructor(
    public dialog: MatDialog,
    private smarthomeservice: SmarthomeService
  ) {}

  ngOnInit() {
    this.getAllThings();
  }

  getAllThings() {
    this.smarthomeservice.getAllDevices().subscribe({
      next: (res) => {
        // this.allThings = res.data.Items;
        this.filteredData = res.data.Items.map((item:any) => ({
          device: item,
          isPower: false, // Initialize isPower to false for each device
          temperature: 0, // Initialize temperature to 0 for each device
        }));
        console.log("===",this.filteredData);
        
        this.allThings.forEach((data) => {
          if(data.device.ThingType.S === this.deviceType){
            this.filteredData.push(data)
          }
        })
      },
      error: (err) => {
        console.log('Error while fetching data: ', err);
      },
    });
  }

  data = {
    status:"",
    temperature: "",
  }

  publishData(deviceId:any) {
    console.log("DATA----------------", this.data);
    console.log("ID----------------", deviceId);
    
    // this.smarthomeservice.publishDevice(this.deviceId, this.data).subscribe({
    //   next: (res) => {
    //     this.allThings = res.data.Items;

    //     console.log('Response------- ', this.filteredData);
    //   },
    //   error: (err) => {
    //     console.log('Error while fetching data: ', err);
    //   },
    // });
  }

  
  decreaseTemperature(deviceId:any) {
    this.deviceId = deviceId;
    this.temperature--;
    if (this.temperature <= 16) {
      this.temperature = 16;
    }
  }
  increaseTemperature(deviceId:any) {
    this.deviceId = deviceId;
    this.temperature++;
    if (this.temperature >= 30) {
      this.temperature = 30;
    }
  }
  setTemperature(val: number, deviceId:any) {
    this.deviceId = deviceId;
    this.data.temperature = val.toString();
    this.publishData(deviceId);
  }

  isPower = false;

  powerSwitch(deviceId:any) {
    this.isPower = !this.isPower;
    if (this.isPower === true) {
      this.data.status = "ON"
    } else {
      this.data.status = "OFF"
    }
    this.publishData(deviceId)
  }
}
