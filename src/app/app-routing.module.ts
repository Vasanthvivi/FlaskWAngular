import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard/dashboard.routing';


@NgModule({
  imports: [RouterModule.forRoot([ ...DashboardRoutes ], { useHash: true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
