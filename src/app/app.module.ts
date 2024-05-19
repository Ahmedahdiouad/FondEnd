import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { MaintenanceChildComponent } from './dialog/maintenance-child/maintenance-child.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { MachineComponent } from './machine/machine.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ManageMachinesComponent } from './manage-machines/manage-machines.component';
import { ManageSensorsComponent } from './manage-sensors/manage-sensors.component';
import { SensorComponent } from './sensor/sensor.component';
import { MaterialModule } from './shared/material-module';
import { ShippingComponent } from './shipping/shipping.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ShippingChildComponent } from './dialog/shipping-child/shipping-child.component';


const ngxUiLoaderConfig : NgxUiLoaderConfig = {
  text : "Loading...",
  textColor : "#FFFFFF",
  textPosition : "center-center",
  bgsColor : "#1976D2",
  fgsColor : "#1976D2",
  fgsType : SPINNER.ballSpinClockwise,
  fgsSize : 60,
  hasProgressBar : false
}

  class CustomDateFormatter extends CalendarNativeDateFormatter{
    public override dayViewHour({ date, locale }: DateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
    }
    public override weekViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
  }
  }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidenavComponent,
    HomeComponent,
    HeaderComponent,
    SensorComponent,
    MachineComponent,
    ManageSensorsComponent,
    ManageMachinesComponent,
    Login2Component,
    MaintenanceComponent,
    MaintenanceChildComponent,
    ConfirmationComponent,
    ShippingComponent,
    ShippingChildComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MaterialModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    DatePipe,
    {provide : CalendarDateFormatter,useClass : CustomDateFormatter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
