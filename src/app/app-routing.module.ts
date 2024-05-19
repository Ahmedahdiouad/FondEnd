import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { MachineComponent } from './machine/machine.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ManageMachinesComponent } from './manage-machines/manage-machines.component';
import { ManageSensorsComponent } from './manage-sensors/manage-sensors.component';
import { SensorComponent } from './sensor/sensor.component';
import { ShippingComponent } from './shipping/shipping.component';

const routes: Routes = [
  {path : '',component : LoginComponent},
  {path : 'home' ,component : HomeComponent,
    children: [
      {path: 'sensor',component : SensorComponent},
      {path : 'machine', component : MachineComponent},
      {path : 'manage/machines', component : ManageMachinesComponent},
      {path : 'manage/sensors', component : ManageSensorsComponent},
      {path : 'login2', component : Login2Component},
      {path : 'maintenance', component : MaintenanceComponent},
      {path : 'shipping', component : ShippingComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
