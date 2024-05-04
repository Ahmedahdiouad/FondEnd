import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // this form group is needed to store the data from the inputs in some kind of a set (set means an ordred list)
  formGroup : any  = FormGroup ;
  responseMessage : any;
  hide = true;

  constructor(private ngxService : NgxUiLoaderService,
              private authService : AuthService,
              private routerService : Router){}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.formGroup = new FormGroup({
      username : new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required])
    });
  }

  loginProcess(){
    var formData = this.formGroup.value;
    var data = {
      username : formData.username,
      password : formData.password
    }
    this.ngxService.start();
    this.authService.login(data).subscribe((response : any) => {
      this.ngxService.stop();
      console.log(response.token);
      if(response.token != null){
        localStorage.setItem("currentUser",JSON.stringify(response));
        console.log("connected");
        this.routerService.navigate(['/home']);
      }
    },(error : any) => {
        console.log("not connected")
        this.routerService.navigate(['/']);
    });
    this.ngxService.stop();
  }

}
