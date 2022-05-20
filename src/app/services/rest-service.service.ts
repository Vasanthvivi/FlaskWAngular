import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  constructor(private http: HttpClient, private global:GlobalService) { }

  initiateLogin(userName: string, password: string) {
    let payload = { "username": userName, "password": password }
    return this.http.post("http://localhost:5000/api/auth/login", payload)
  }

  initiateSignUp(userName:string, password:string){
    let payload = { "username": userName, "password": password }
    return this.http.post("http://localhost:5000/api/auth/signup", payload)
  }

  initiateForgotPassword(userName:string){
    let payload = { "username": userName }
    return this.http.post("http://localhost:5000/api/auth/forgotpassword", payload)
  }

  getTodos(){
    return this.http.post("http://localhost:5000/api/getTodos", { "userId" : this.global.userId })
  }

  deleteTodos(todosToBeDeleted:number[]){
    let payload = { "todos" : todosToBeDeleted }
    return this.http.post("http://localhost:5000/api/deleteTodos", payload)
  }

  buildTodo(payload:any){
    return this.http.post("http://localhost:5000/api/createTodo", payload)
  }
}

