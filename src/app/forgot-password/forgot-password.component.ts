import { Component, OnInit } from '@angular/core';
import { FieldsService } from '../fields.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from "jquery";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private FieldsList: FieldsService, private router: Router) { }

  error: string = null;
  resetLink : string = null;
  adminToken : string = null;

  forgotPass(form: NgForm) {
    // console.log(form.value);
    this.error = null;
    this.resetLink = null;

    let adminId = $("#adminId").val();
    if (adminId !== "") {

      this.FieldsList.EmployeeForgotPassword(form.value).subscribe((result) => {
        //console.log("reset Token--->"+result.resetToken);
        this.resetLink = "http://localhost:4200/reset-password/"+result.resetToken;

      }, err => {
        this.error =  err.error.message;
      });
      
    }else{
      this.error = "Sorry!!! Please enter valid Admin Id.";
    }
    

  }

  ngOnInit(): void {
    this.isLoggedIn();
  }

  isLoggedIn(): boolean {
    const userDetails = localStorage.getItem('token');
    if (userDetails) {
      this.FieldsList.CheckSessionToken().subscribe((result) => {
        this.router.navigateByUrl('/home-page');
        return true;
      }, err => {
        //this.router.navigateByUrl('/forgot-password');
        return true;
      });
    } else {
      //this.router.navigateByUrl('/forgot-password');
      return true;
    }
  }
}
