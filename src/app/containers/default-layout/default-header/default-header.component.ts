import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import {Location} from '@angular/common';

import {navItems} from '../_nav';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService, public location:Location) {
    super();
  }

  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
      titlee = titlee.slice( 1 );
    }
    for(var item = 0; item < navItems.length; item++){
      if(navItems[item].url === titlee){
        return navItems[item].name;
      }
    }
    return 'No page';
  }

}
