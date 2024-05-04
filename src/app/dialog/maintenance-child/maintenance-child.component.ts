import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MaintenanceService } from '../../services/maintenance.service';


@Component({
  selector: 'app-maintenance-child',
  templateUrl: './maintenance-child.component.html',
  styleUrl: './maintenance-child.component.scss'
})
export class MaintenanceChildComponent implements OnInit {
  onAddMaintenance = new EventEmitter();
  machines : any[] =[];
  maintenanceTypes : any[] =[];
  formGroup :any = FormGroup;
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  refresh = new Subject<void>;



  constructor(private maintenanceService : MaintenanceService,private dialogRef: MatDialogRef<MaintenanceChildComponent>){
  
  }


  ngOnInit(): void {
    this.loadMachines();
    this.loadMaintenanceTypes();
    this.initialiserFormGroup();
  }

  initialiserFormGroup(){
    this.formGroup = new FormGroup({
      title : new FormControl(),
      machine : new FormControl(),
      maintenanceType : new FormControl(),
      startDate : new FormControl(),
      startTime : new FormControl(),
      endDate : new FormControl(),
      endTime : new FormControl(),
      description : new FormControl()
    });
  }

  addMaintenance(){
    const formData = this.formGroup.value;
    const startDate = new Date(formData.startDate);
    const startTime = this.parseTime(formData.startTime);
    // Create a new date object with the date from startDate and time from startTime
    const startDateWithTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());

    const endDate = new Date(formData.endDate);
    const endTime = this.parseTime(formData.endTime);
    // Create a new date object with the date from startDate and time from startTime
    const endDateWithTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes());

    var dataTosend = {
      title : formData.title,
      machine : formData.machine,
      maintenance_type : formData.maintenanceType,
      start : startDateWithTime.toISOString(),
      end : endDateWithTime.toISOString(),
      description : formData.description
    }
    
    this.maintenanceService.addMaintenance(dataTosend).subscribe(() => {
      console.log("Maintenance added");
      // Emit an event to notify the parent component to refresh the calendar
      this.onAddMaintenance.emit();
      // Close the dialog
      this.refresh.next();
      this.dialogRef.close();
    });
  }

  loadMachines() {
    this.maintenanceService.getMachines().subscribe((data : any) =>{
      this.machines = data;
    })
  }

  loadMaintenanceTypes(){
    this.maintenanceService.getMaintenanceType().subscribe((data : any) => {
      this.maintenanceTypes = data;
    })
  }

  private parseTime(timeStr: string): Date {
    // Split the time string into hours, minutes, and AM/PM indicator
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
  
    // Convert hours to 24-hour format if necessary
    let adjustedHours = hours;
    if (period.toLowerCase() === 'pm' && adjustedHours < 12) {
      adjustedHours += 12;
    }
  
    // Create a new Date object with adjusted hours, minutes, and seconds
    const parsedTime = new Date();
    parsedTime.setHours(adjustedHours, minutes, 0); // Set seconds to 0
    
    return parsedTime;
  }
  
  
}
