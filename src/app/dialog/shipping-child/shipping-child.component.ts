import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';

export interface City {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Driver {
  id: number;
  name: string;
}

export interface DistanceBetweenCities {
  id: number;
  distance: number;
}

export interface DurationBetweenCities {
  id: number;
  duration: number;
}

export enum DrivingOrParked {
  Driving = 'driving',
  Parked = 'parked'
}

@Component({
  selector: 'app-shipping-child',
  templateUrl: './shipping-child.component.html',
  styleUrls: ['./shipping-child.component.scss']
})
export class ShippingChildComponent implements OnInit {

  onAddShipping = new EventEmitter();
  state : string = 'Parked';

  availableCities: City[] = [
    { id: 1, name: 'Marrakech', lat: 31.629472, lng: -7.981084 },
    { id: 2, name: 'Casablanca', lat: 33.5731104, lng: -7.5898434 },
    { id: 3, name: 'Rabat', lat: 34.020882, lng: -6.841650 },
    { id: 4, name: 'Tangier', lat: 35.759465, lng: -5.833954 },
    { id: 5, name: 'Kenitra', lat: 34.261036, lng: -6.580200 },
    { id: 6, name: 'Salé', lat: 34.01325, lng: -6.83255 },
    { id: 7, name: 'Safi', lat: 32.295917, lng: -9.236549 },
    { id: 8, name: 'Essaouira', lat: 31.515714, lng: -9.76336 },
    { id: 9, name: 'Fes', lat: 34.053103, lng: -4.999988 },
    { id: 10, name: 'Oujda', lat: 34.685001, lng: -1.910000 },
    { id: 11, name: 'Beni Mellal', lat: 31.791702, lng: -7.080311 },
    { id: 12, name: 'Agadir', lat: 30.421256, lng: -9.598107 },
    { id: 13, name: 'Khouribga', lat: 32.880787, lng: -6.906296 },
    { id: 14, name: 'Ouarzazate', lat: 30.931030, lng: -6.943480 },
    { id: 15, name: 'Khemisset', lat: 34.249833, lng: -6.589958 }
  ];

  availableDrivers: Driver[] = [
    {id : 1, name :'Ahmed Hassan'},
    {id : 2, name :'Omar El Khattabi'},
    {id : 3, name :'Abdelkader Mansouri'},
    {id : 4, name : 'Mohamed Amrani'}
  ];

  calculatedDuration : any = 'duration';
  calculatedDistance : any = 'distance';

  refresh = new Subject<void>();

  formGroup: any = FormGroup;


  constructor(private formBuilder: FormBuilder,
              private snackBar : SnackbarService,
              @Inject(MAT_DIALOG_DATA) public dialogData: any,
              private dialogRef : MatDialogRef<ShippingChildComponent>) {
  }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      title: new FormControl(this.dialogData.data?.nom),
      startDate: new FormControl(this.dialogData.data?.date),
      driver: new FormControl(this.dialogData.data?.driver),
      duration: new FormControl(this.dialogData.data?.duration),
      distance: new FormControl(this.dialogData.data?.distance),
      fromCity: new FormControl(this.dialogData.data?.depart),
      toCity: new FormControl(this.dialogData.data?.stop),
      state: new FormControl(this.dialogData.data?.drivingOrParked)
    });
    
  }

  onSubmit(): void {
    const fromCityId = this.formGroup.get('fromCity')?.value;
    const toCityId = this.formGroup.get('toCity')?.value;
    const driverId = this.formGroup.get('driver')?.value;

    const fromCity = this.availableCities.find(city => city.id === fromCityId);
    const toCity = this.availableCities.find(city => city.id === toCityId);
    const driver = this.availableDrivers.find(driver => driver.id === driverId);

    if (fromCity && toCity) {
      this.calculatedDistance = this.haversineDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng).toFixed(2) + ' km';
      this.calculatedDuration = this.calculateDuration(this.calculatedDistance) + ' min';

      const newVehicle = {
        nom: this.formGroup.get('title')?.value,
        date: this.formGroup.get('startDate')?.value,
        lat: fromCity?.lat,
        lng: fromCity?.lng,
        depart: fromCity?.name,
        stop: toCity?.name,
        driver: driver?.name,
        distance: this.calculatedDistance,
        duration: this.calculatedDuration,
        drivingOrParked: this.formGroup.get('state')?.value
      };

      this.onAddShipping.emit(newVehicle);
      this.snackBar.openSnackBar("Shipment is added successfully.", '');
      this.dialogRef.close();
    }else{
      this.snackBar.openSnackBar("Shipment is not added.",'error');
    }
  }

  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => x * Math.PI / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  calculateDuration(distance: string): number {
    const avgSpeed = 80; // Average speed in km/h
    const distanceInKm = parseFloat(distance);
    const durationInHours = distanceInKm / avgSpeed;
    const durationInMinutes = durationInHours * 60;
    return Math.round(durationInMinutes);
  }

}
