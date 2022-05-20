import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest-service.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[MessageService]
})
export class LoginComponent implements OnInit {
  public userName:string = "";
  public password:string = "";
  public isLoginPage:boolean = true;
  public isSignUpPage:boolean = false;
  public isForgotPasswordPage:boolean = false;
  public isLoggedIn:boolean = false;
  constructor(private restService:RestService, private global:GlobalService, private router:Router, private messageService:MessageService) {
     this.global.login.subscribe({
       next: ((isLoggedIn) => {
          this.isLoggedIn = isLoggedIn;
          if(isLoggedIn){
            this.gotoDashBoard()
          }
       })
     })
  }

  ngOnInit() {
  }

  gotoDashBoard(){
    this.router.navigate(["/home"])
  }

  authenticate(){
    if(this.userName.length <= 0 && this.password.length <= 0){
      this.messageService.add({severity:"info", detail:"Enter valid credentials"})
      return;
    }
    if(this.isLoginPage){
      this.restService.initiateLogin(this.userName, this.password).subscribe({
        next: ((response) => {
          this.global.token = JSON.parse(JSON.stringify(response))["token"]
          console.log(`token ${this.global.token}`)
          this.global.isLoggedIn = true;
          this.global.login.next(true)
          this.global.currentUser = this.userName
          this.global.userId = JSON.parse(JSON.stringify(response))["userId"]
        }),error: ((error) => {
          this.messageService.add({severity:"info", detail:`${error.error.message}`})
        })
     })
    }else if(this.isSignUpPage){
      this.restService.initiateSignUp(this.userName, this.password).subscribe({
        next: ((response) => {
          this.global.token = JSON.parse(JSON.stringify(response))["token"]
          this.global.isLoggedIn = true;
          this.global.login.next(true)
          this.global.currentUser = this.userName
          this.global.userId = JSON.parse(JSON.stringify(response))["userId"]
        }),error: ((error) => {
          this.messageService.add({severity:"info", detail:`${error.error.message}`})
        })
     })
    }else{
      this.messageService.add({severity:"info", detail:"Enter UserName"})
      return; 
    }
  }


  forgotPassword(){
    if(this.userName.length <= 0){
      this.messageService.add({severity:"info", detail:"Enter UserName"})
      return;
    }
    this.restService.initiateForgotPassword(this.userName).subscribe({
      next: ((response) => {
        this.messageService.add({severity:"info", detail:`${"Password : " + JSON.parse(JSON.stringify(response))["password"]}`})
      }),error: ((error) => {
        this.messageService.add({severity:"info", detail:`${error.error.message}`})
      }), complete: (() => {
        console.log("completed")
      }) 
   }) 
  }

  switchPage(option:string){
    if(option == "login"){
      this.isLoginPage = true; this.isSignUpPage = false; this.isForgotPasswordPage = false;
    }else if(option == "forgotpassword"){
      this.isForgotPasswordPage = true; this.isSignUpPage = false; this.isLoginPage = false;
    }else{
      this.isSignUpPage = true; this.isLoginPage = false; this.isForgotPasswordPage = false;
    }
  }

}
