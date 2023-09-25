import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevicecardComponent } from "./dashboard/devicecard/devicecard.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { MydeviceComponent } from "./dashboard/mydevice/mydevice.component"
import { RegisterDeviceComponent } from "./dashboard/register-device/register-device.component"

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'register-device',
    component: RegisterDeviceComponent,
  },
  {
    path: 'mydevices',
    component: MydeviceComponent,
  },
  {
    path: 'device-card',
    component: DevicecardComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
