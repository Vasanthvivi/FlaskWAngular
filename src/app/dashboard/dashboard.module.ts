import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../common/login/login.component';
import { RestService } from '../services/rest-service.service';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { DashboardGuard } from '../guards/dashboard.guard';
import { NavigationPaneComponent } from './navigation-pane/navigation-pane.component';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import { InterceptorService } from '../services/interceptors.service';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {BlockUIModule} from 'primeng/blockui';
import {MultiSelectModule} from 'primeng/multiselect';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    HttpClientModule,
    MultiSelectModule,
    BlockUIModule,
    InputTextareaModule,
    PanelModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule
  ],
  declarations: [DashboardComponent, LoginComponent, NavigationPaneComponent, ContentComponent, HeaderComponent],
  providers: [RestService, GlobalService, DashboardGuard, 
    {provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true  }
  ]
})
export class DashboardModule { }
