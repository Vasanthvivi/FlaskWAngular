import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest-service.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MessageService } from 'primeng/api';
import { Todo } from 'src/app/classes/todos';
import { User } from 'src/app/classes/user';

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
  public blockedDocument: boolean = false;

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

  adminLogin(){
    this.blockDoc()
    if( (this.userName == "admin" || this.userName == "Admin") && (this.password == "admin" || this.password == "Admin") )
    {
      this.restService.logAdmin({"username" : this.userName, "password" : this.password}).subscribe({
        next: ((response) => {
          this.initializeAdmin(response)
          this.unblockDoc()
          return;
        }),error: ((error) => {
          this.unblockDoc()
          this.messageService.add({severity:"info", detail:`${error.error.message}`, life:1300})
        })
      })
    }else{
      this.unblockDoc()
      this.messageService.add({severity:"info", detail:`Valid credentials needed!`})
    }
  }

  authenticate(){
    if(this.userName.length <= 0 || this.password.length <= 0){
      this.messageService.add({severity:"info", detail:"Enter valid credentials", life:1300})
      return;
    }
    if(this.isLoginPage){
      if(this.userName == "admin" || this.userName == "Admin")
      {
        this.adminLogin();
        return;
      }
      this.restService.initiateLogin(this.userName, this.password).subscribe({
        next: ((response) => {
          // if(this.userName == "admin" || this.userName == "Admin"){
          //   this.initializeAdmin(response)
          //   return;
          // }
          console.log("after if else");
          this.global.token = JSON.parse(JSON.stringify(response))["token"]
          console.log(`token ${this.global.token}`)
          this.global.isLoggedIn = true;
          this.global.login.next(true)
          this.global.currentUser = this.userName
          this.global.userId = JSON.parse(JSON.stringify(response))["userId"]
        }),error: ((error) => {
          this.messageService.add({severity:"info", detail:`${error.error.message}`, life:1300})
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
          this.messageService.add({severity:"info", detail:`${error.error.message}`, life:1300})
        })
     })
    }else{
      this.messageService.add({severity:"info", detail:"Enter UserName"})
      return; 
    }
  }

  forgotPassword(){
    if(this.userName.length <= 0){
      this.messageService.add({severity:"info", detail:"Enter UserName", life:1300})
      return;
    }
    this.blockDoc()
    this.restService.initiateForgotPassword(this.userName).subscribe({
      next: ((response) => {
        this.messageService.add({severity:"info", detail:`${"Password : " + JSON.parse(JSON.stringify(response))["password"]}`, life:1300})
        this.unblockDoc()
      }),error: ((error) => {
        this.unblockDoc()
        this.messageService.add({severity:"info", detail:`${error.error.message}`, life:1300})
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

  blockDoc(){
    this.blockedDocument = true
  }
  
  unblockDoc(){
    this.blockedDocument = false
  }

  initializeAdmin(response:any){
    this.global.isAdmin = true;
    let users = JSON.parse(JSON.stringify(response))["users"]
    this.global.usersCount = users.length;
    let todos = JSON.parse(JSON.stringify(response))["todos"]
    this.global.globalTodosCount = todos.length;
    for(let i = 0; i < users.length; i++){
      let userId = users[i][0];
      let nots = 0;
      let todostemp:Todo[] = [];
      for(let j = 0; j < todos.length;j++){
        if(userId == todos[j][1]){
          nots++;
          let todo:Todo = { todoId:todos[j][0], userId:todos[j][1], todo: todos[j][2], todoDescription: todos[j][3] }
          todostemp.push(todo)
        }
      }
      let user:User = { userId:userId, userName:users[i][1], todos: todostemp, numberOfTodos: nots }
      this.global.globalUsers.push(user);
    }

    console.log(this.global.globalUsers)
    this.global.token = JSON.parse(JSON.stringify(response))["token"]
    console.log(`token ${this.global.token}`)
    this.global.isLoggedIn = true;
    this.global.login.next(true)
    this.global.currentUser = this.userName
  }

}
