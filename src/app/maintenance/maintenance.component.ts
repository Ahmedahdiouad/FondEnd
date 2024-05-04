import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { Subject } from 'rxjs';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MaintenanceChildComponent } from '../dialog/maintenance-child/maintenance-child.component';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss'
})
export class MaintenanceComponent implements OnInit{
  viewDate: Date = new Date();
  view : CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  events : CalendarEvent[] =[];
  activeDayIsOpen: boolean = true;
  refresh = new Subject<void>;
  maintenanceElements : any[] = [];
  filteredMaintenanceElements: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private maintenanceService : MaintenanceService,
              public dialog : MatDialog,
              private router : Router){}

  ngOnInit(): void {
    this.maintenanceService.getAllMaintenance().subscribe((data: any) => {
      this.maintenanceElements = data;
      // Map each item in the response data to the format expected by the calendar component
        data.forEach((item: any) => {
          const event = {
            title: item.title,
            start: new Date(item.start), // Use the date string directly
            end: new Date(item.end),     // Use the date string directly
            description: item.description,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
        };
  
        // Push the event into the events array
        this.events.push(event);
      });
  
    },(error : any) =>{
      console.log(error);
    });
  }
  

  setView(view : CalendarView){
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventClicked(event : any) {
    console.log("event clicked" + event);
  }

  eventTimeChanged(event : any){
    console.log("time changed" + event);
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.refresh.next();
  }

  handleEditAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "700px";

    const dialogRef = this.dialog.open(MaintenanceChildComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    
    const sub = dialogRef.componentInstance.onAddMaintenance.subscribe((response)=>{
      this.refresh.next();
    })
  }

  refreshTable(){
    this.maintenanceService.getAllMaintenance().subscribe((data : any) => {
      this.maintenanceElements = data;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Filter the maintenanceElements array based on the filterValue
    this.filteredMaintenanceElements = this.maintenanceElements.filter(element =>
        element.title.toLowerCase().includes(filterValue) ||
        element.start.toLowerCase().includes(filterValue) ||
        element.end.toLowerCase().includes(filterValue) ||
        element.description.toLowerCase().includes(filterValue)
    );
}



  handleDeleteAction(value : any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message : 'supprimer ' + value.title ,confirmation : true
    }

    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.deleteMaintenance(value.id);
      dialogRef.close();
    })
  }

  deleteMaintenance(id: any) {
    this.maintenanceService.deleteMaintenance(id).subscribe(() =>{
      console.log("deleted successfully")
      this.refreshTable();
      this.refresh.next();
    });
  }
}
