import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Todo } from '../classes/todos';
import { User } from '../classes/user';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
public login:Subject<boolean> = new Subject();
public token:string = "";
public isAdmin:boolean = false;
public currentUser: string = "Guest";
public isLoggedIn: boolean = false;
public userId:number = -1;
public currentUserTodosCount:number = 0;
public usersCount:number = -1;
public globalUsers:User[] = [];
public globalTodos:Todo[] = [];
public globalTodosCount:number = 0;
constructor() { }
   
}
