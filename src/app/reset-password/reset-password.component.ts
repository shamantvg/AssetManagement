import { Component, OnInit } from '@angular/core';
import { FieldsService } from '../fields.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private FieldsList: FieldsService, private router: Router, private routerActive: ActivatedRoute) { }

  error: string = null;
  resetStatus: boolean = false;
  adminToken: string = null;
  AdminName: string = null;

  ResetPassword(form: NgForm) {
    // console.log(form.value);
    // return false;
    
    this.resetStatus = false;
    this.error = null;

    let pass = $("#pswd").val();
    let confir_pass = $("#confir_pass").val();
    if ((pass === '') || (confir_pass === '')) {
      this.error = "Both Passwords are mandatory.";
    } else if (pass !== confir_pass) {
      this.error = "Sorry!!! Confirm password entry is mismatching.";
    }
    else {
      this.FieldsList.EmployeeResetPassword(form.value).subscribe((result) => {
        this.resetStatus = true;
        form.resetForm();
      }, err => {
        this.error =  err.error.message;
      });
      
    }

  }
  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn(): boolean {
    const userDetails = localStorage.getItem('token');
    if (userDetails) {
      this.FieldsList.CheckSessionToken().subscribe((result) => {
        this.router.navigateByUrl('/home-page');
        return true;
      }, err => {
        this.getResetUser();
        return true;
      });
    } else {
      this.getResetUser();
      return true;
    }
  } 
  
  getResetUser(): boolean {
    this.routerActive.paramMap
      .subscribe(params => {
        let adminUniq = params.get('adminUniq');
        //console.log("adminUniq---->"+adminUniq);

        if (adminUniq !== "") {
          this.FieldsList.getResetUser(adminUniq).subscribe((result) => {
            //console.log("reset Token--->"+result.resetToken);
            this.AdminName = result.firstname;
            this.adminToken = adminUniq;
          }, err => {
            this.error =  err.error.message;
          });
          
        }

      });
      return true;
  } 

}


