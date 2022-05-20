import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
public login:Subject<boolean> = new Subject();
public token:string = "";
public currentUser: string = "Guest";
public isLoggedIn: boolean = false;
public userId:number = -1;
public currentUserTodosCount:number = 0;
constructor() { }
   
}
