import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SmarthomeService } from 'src/app/services/smarthome.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-devicecard',
  templateUrl: './devicecard.component.html',
  styleUrls: ['./devicecard.component.css'],
})
export class DevicecardComponent {
  // public temperature: any = 25;
  public deviceId: any;
  public dotColor:any;
  deviceActive:string = "green";
  deviceDeactive:string = "red";

  @Input() deviceType: any;
  public allThings: any[] = [];
  public filteredData: {
    device: any;
    isPower: boolean;
    active: boolean
    temperature: number;
  }[] = [];
  constructor(
    public dialog: MatDialog,
    private smarthomeservice: SmarthomeService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getAllThings();
  }

  getAllThings() {
    this.smarthomeservice.getAllDevices().subscribe({
      next: (res) => {
        // this.allThings = res.data.Items;
        this.allThings = res.data.Items.map((item: any) => ({
          device: item,
          isPower: item.Status.S === 'ON',
          active: item.DeviceStatus.S === 'online', // Initialize isPower to false for each device
          temperature: item.Temperature?.N, // Initialize temperature to 0 for each device
        }));
        console.log('ALL Thing--', this.allThings);

        // this.allThings.forEach((data) => {
        //   if(data.device.ThingType.S === this.deviceType){
        //     this.filteredData.push(data)
        //   }
        // })

        this.filteredData = this.allThings.filter(
          (item: any) => item.device.ThingType.S === this.deviceType
        );

        console.log(' filtered Data==', this.filteredData);
      },
      error: (err) => {
        console.log('Error while fetching data: ', err);
      },
    });
  }

  publishData(deviceToUpdate:any, deviceId: any) {
    console.log("DEVICE TO UPDATE: ",deviceToUpdate);
    
    if (!deviceToUpdate) {
      console.error(`Device with ID ${deviceId} not found.`);
      return;
    }

    const dataToPublish = {
      status: deviceToUpdate.isPower ? 'ON' : 'OFF',
      temperature: deviceToUpdate.temperature,
    };

    console.log('Data to Publish:', dataToPublish);
    console.log('Device ID:', deviceId);

    this.smarthomeservice.publishDevice(deviceId, dataToPublish).subscribe({
      next: (res) => {
        // Handle the response if needed
        console.log('Response: ', res);
        setTimeout(() => {
          this.getAllThings();
        },500)
        this.changeDetector.detectChanges();

        // You can update your filteredData here if necessary
        // For example, if the API response includes updated data
        // deviceToUpdate.device = res.updatedDevice;
      },
      error: (err) => {
        console.error('Error while updating data: ', err);
      },
    });
  }

  decreaseTemperature(deviceData: any) {
    deviceData.temperature--;
    if (deviceData.temperature <= 16) {
      deviceData.temperature = 16;
    }
  }
  increaseTemperature(deviceData: any) {
    deviceData.temperature++;
    if (deviceData.temperature >= 30) {
      deviceData.temperature = 30;
    }
  }

  setTemperature(deviceData:any, deviceId: any) {
    console.log("Click On Device:", deviceData);
    
    // this.data.temperature = temp.toString();
    this.publishData(deviceData, deviceId);
  }

  powerSwitch(deviceData: any) {
    console.log('Clicked on device: ', deviceData.device.ThingName.S);
    deviceData.isPower = !deviceData.isPower;
    deviceData.device.Status.S = deviceData.isPower ? 'ON' : 'OFF';
    this.publishData(deviceData, deviceData.device.ThingId.N);
  }
  
}
