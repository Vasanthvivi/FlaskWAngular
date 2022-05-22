import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  buildTodo(payload:Object){
    return this.http.post("http://localhost:5000/api/createTodo", payload)
  }

  editUser(payload:Object):Observable<Object>{
    return this.http.post("http://localhost:5000/api/edit-user", payload)
  }
   
  removeUser(payload:Object){
    return this.http.post("http://localhost:5000/api/remove-user", payload)
  }

  addUser(payload:Object){
    return this.http.post("http://localhost:5000/api/add-user", payload)
  }

  logAdmin(payload:Object){
    return this.http.post("http://localhost:5000/api/auth/admin-login", payload)
  }

  editTodo(payload: Object){
    return this.http.post("http://localhost:5000/api/edit-todo", payload)
  }

  markAsComplete(todos:number[]){
    return this.http.post("http://localhost:5000/api/mark-as-complete", { "todos" : todos })
  }

  markAsPending(todos:number[]){
    return this.http.post("http://localhost:5000/api/mark-as-pending", { "todos" : todos })
  }
  
}

