import { Component } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  messaggio = '';

  constructor(public firebase: FirebaseService, public router: Router) {
  }

  ngOnInit(): void {
  }

  mostrareMessaggio(): boolean {
    if (this.messaggio === '') {
      return false;
    }
    return true;
  }

  async login() {
      var err = await this.firebase.signIn(this.email, this.password);
      console.log(err);
  //    this.messaggio = 'Credenziali errate!';
    this.router.navigate(['/spazi']);
  }
}
