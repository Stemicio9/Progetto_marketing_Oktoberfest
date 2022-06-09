import { Component } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  Roles: any = ['Admin', 'Author', 'Reader'];
  nomecompleto = '';
  email = '';
  password = '';
  constructor(public firebase: FirebaseService) { }



  registrazioneCompleta(){
    this.firebase.signUp(this.email,this.password).then(
        () => {
          this.firebase.creaUtente({
            nome: this.nomecompleto,
            email: this.email,
            password: this.password
          })
        }
    );
  }
}
