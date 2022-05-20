import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardGuard implements CanActivate{
    constructor(private global:GlobalService, private router:Router){
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.global.isLoggedIn){
            return true
        }else{
            this.router.navigate(["/login"])
            return false;
        }        
    }
}