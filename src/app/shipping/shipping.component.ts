import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow } from '@angular/google-maps'; // Import necessary Google Maps types
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShippingChildComponent } from '../dialog/shipping-child/shipping-child.component';


class Vehicle {
  constructor(
    public nom: string,
    public date: Date,
    public lat: number,
    public lng: number,
    public depart: string,
    public stop: string,
    public driver: string,
    public distance: number,
    public duration: string,
    public drivingOrParked: 'driving' | 'parked'
  ) {}
}

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  markers : any[] =[];
  vehicles: Vehicle[] = [];
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 34.053103,
    lng: -4.999988
  };
  zoom = 6;

  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;


  constructor(public dialog : MatDialog,
    private router : Router) {}

  ngOnInit(): void {
    // Call the method to generate random vehicles
    this.generateRandomVehicles(3); // Adjust the count as needed
    this.addMarkers();
  }

  addMarkers() {
    this.markers = []; // Clear existing markers
    this.vehicles.forEach(vehicle => {
      this.markers.push({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        title: vehicle.nom,
        options: { animation: google.maps.Animation.BOUNCE },
        label: {
          color: 'red',
          text: vehicle.driver,
        },
      });
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  // Function to generate a random date within the last 30 days
  randomDate() {
    const today = new Date();
    const pastDate = new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    return pastDate;
  }

  // Generate random vehicle data
  generateRandomVehicles(count: number) {
    const locations = [
      { lat: 31.629472, lng: -7.981084, name: 'Marrakech' },
      { lat: 33.5731104, lng: -7.5898434, name: 'Casablanca' },
      { lat: 34.020882, lng: -6.841650, name: 'Rabat' },
      { lat: 35.759465, lng: -5.833954, name: 'Tangier' },
      { lat: 34.261036, lng: -6.580200, name: 'Kenitra' },
      { lat: 34.01325, lng: -6.83255, name: 'Salé' },
      { lat: 32.295917, lng: -9.236549, name: 'Safi' },
      { lat: 31.515714, lng: -9.76336, name: 'Essaouira' },
      { lat: 34.053103, lng: -4.999988, name: 'Fes' },
      { lat: 34.685001, lng: -1.910000, name: 'Oujda' },
      { lat: 31.791702, lng: -7.080311, name: 'Beni Mellal' },
      { lat: 30.421256, lng: -9.598107, name: 'Agadir' },
      { lat: 32.880787, lng: -6.906296, name: 'Khouribga' },
      { lat: 30.931030, lng: -6.943480, name: 'Ouarzazate' },
      { lat: 34.249833, lng: -6.589958, name: 'Khemisset' }
    ];

    const availableDrivers = [
      {id : 1, name :'Ahmed Hassan'},
      {id : 2, name :'Omar El Khattabi'},
      {id : 3, name :'Abdelkader Mansouri'},
      {id : 4, name : 'Mohamed Amrani'}
    ];
    

    for (let i = 0; i < count; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomLocationName = locations[Math.floor(Math.random() * locations.length)];
      const randomDrivers = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];



      this.vehicles.push(
        new Vehicle(
          `Vehicle ${i + 1}`,
          this.randomDate(),
          randomLocation.lat,
          randomLocation.lng,
          randomLocationName.name,
          randomLocation.name,
          randomDrivers.name,
          Number.parseInt(this.handleDistance(randomLocation.name,randomLocationName.name).toString()), // Distance (random)
          this.handleDuration(randomLocation.name,randomLocationName.name), // Duration (random)
          Math.random() > 0.5 ? 'driving' : 'parked' // Driving or Parked
        )
      );
    }
    console.log(this.vehicles);
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.data = {
      action : 'Add',
    }
    const dialogRef = this.dialog.open(ShippingChildComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    
    const sub = dialogRef.componentInstance.onAddShipping.subscribe((response)=>{
      this.vehicles.push(response);
      this.addMarkers(); // Update markers after adding a new vehicle
    })
  }

  handleEditAction(value : any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";
    dialogConfig.data = {
      action : 'Edit',
      data : value
    }

    console.log(dialogConfig.data)

    const dialogRef = this.dialog.open(ShippingChildComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    
    const sub = dialogRef.componentInstance.onAddShipping.subscribe((response)=>{
    })
  }

  getCityCoordinates(cityName: string) {
    const locations = [
      { lat: 31.629472, lng: -7.981084, name: 'Marrakech' },
      { lat: 33.5731104, lng: -7.5898434, name: 'Casablanca' },
      { lat: 34.020882, lng: -6.841650, name: 'Rabat' },
      { lat: 35.759465, lng: -5.833954, name: 'Tangier' },
      { lat: 34.261036, lng: -6.580200, name: 'Kenitra' },
      { lat: 34.01325, lng: -6.83255, name: 'Salé' },
      { lat: 32.295917, lng: -9.236549, name: 'Safi' },
      { lat: 31.515714, lng: -9.76336, name: 'Essaouira' },
      { lat: 34.053103, lng: -4.999988, name: 'Fes' },
      { lat: 34.685001, lng: -1.910000, name: 'Oujda' },
      { lat: 31.791702, lng: -7.080311, name: 'Beni Mellal' },
      { lat: 30.421256, lng: -9.598107, name: 'Agadir' },
      { lat: 32.880787, lng: -6.906296, name: 'Khouribga' },
      { lat: 30.931030, lng: -6.943480, name: 'Ouarzazate' },
      { lat: 34.249833, lng: -6.589958, name: 'Khemisset' }
    ];
    return locations.find(city => city.name === cityName);
  }

  haversineDistance(coord1: any, coord2: any) {
    const toRad = (x: number) => x * Math.PI / 180;

    const lat1 = coord1.lat;
    const lon1 = coord1.lng;
    const lat2 = coord2.lat;
    const lon2 = coord2.lng;

    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  handleDistance(fromCity: string, toCity: string): number {
    const fromCoord = this.getCityCoordinates(fromCity);
    const toCoord = this.getCityCoordinates(toCity);

    if (fromCoord && toCoord) {
      return this.haversineDistance(fromCoord, toCoord);
    } else {
      return 0;
    }
  }

  handleDuration(fromCity: string, toCity: string): string {
    const distance = this.handleDistance(fromCity, toCity);
    const avgSpeed = 80; // Average speed in km/h
    const durationInHours = distance / avgSpeed;
    const hours = Math.floor(durationInHours);
    const minutes = Math.round((durationInHours - hours) * 60);
    return `${hours}h ${minutes}min`;
  }
}
