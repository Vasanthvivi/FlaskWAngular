import { Route } from "@angular/router";
import { LoginComponent } from "../common/login/login.component";
import { DashboardGuard } from "../guards/dashboard.guard";
import { DashboardComponent } from "./dashboard.component";


export const DashboardRoutes: Route[] = 
[
   { path:"", redirectTo:"/home", pathMatch:"full" },
   { path:"login", component: LoginComponent },
   { path:"home", component: DashboardComponent, canActivate:[DashboardGuard]  }
   // canActivate:[DashboardGuard]
]