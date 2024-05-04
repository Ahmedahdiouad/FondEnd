import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSideBarForMe : EventEmitter<any> = new EventEmitter<void>();

  constructor(private route : Router,
    private ngxService : NgxUiLoaderService){

  }

  darkMode = false;

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    // Store the user preference in local storage
    //localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
  }

  sideBarToggle(){
    this.toggleSideBarForMe.emit();
  }

  logout(){
    this.ngxService.start();
    localStorage.setItem("currentUser","");
    this.route.navigateByUrl("/");
    this.ngxService.stop();
  }
}
