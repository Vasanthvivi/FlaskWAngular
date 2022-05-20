import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-navigation-pane',
  templateUrl: './navigation-pane.component.html',
  styleUrls: ['./navigation-pane.component.scss']
})
export class NavigationPaneComponent implements OnInit {
  public currentUser:string = "";
  constructor(public global:GlobalService) {
    this.currentUser = this.global.currentUser;
  }
  
  ngOnInit() {
  }

}
