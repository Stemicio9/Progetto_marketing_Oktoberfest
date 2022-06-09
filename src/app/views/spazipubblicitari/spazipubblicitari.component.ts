import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Spaziopubblicitario} from '../services/spaziopubblicitario';
import {map, Subject} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataTableDirective} from 'angular-datatables';
import {update} from '@angular/fire/database';

declare var Email: any;



@Component({
  selector: 'app-spazipubblicitari',
  templateUrl: './spazipubblicitari.component.html',
  styleUrls: ['./spazipubblicitari.component.scss'],
  animations: [
        trigger('rowExpansionTrigger', [
            state('void', style({
                transform: 'translateX(-10%)',
                opacity: 0
            })),
            state('active', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class SpazipubblicitariComponent implements OnInit {


  listaspazi: Spaziopubblicitario [] = [];

  listautenti: any [] = [];



  constructor(public firebase:FirebaseService) {

  }

  ngOnInit(): void {

      console.log('ON INIT del component');


      this.firebase.getSpazi().snapshotChanges().pipe(
          map(
              changes => changes.map(
                  c => ({key: c.payload.key, ...c.payload.val()})
              )
          )
      ).subscribe(data => {
          this.listaspazi = data;
      });

      this.prendilistautenti();


  }



   updateACazzo(){
      this.listaspazi.forEach(async spazio => {
          spazio.posizione = spazio.altreinfo![0].posizione;
          this.updatecazzocazzo(spazio);
          await new Promise(f => setTimeout(f, 100));
          console.log('Aggiornato ' + spazio.idspazio);
      });
  }

    updatecazzocazzo(spaziopubb : Spaziopubblicitario) {
        this.firebase.update(spaziopubb.key!, {'posizione': spaziopubb.posizione});
    }



  update(spaziopubb : Spaziopubblicitario){
    this.firebase.update(spaziopubb.key! , {'stato' : spaziopubb.stato});

    let utenteDaInserire = '';
    for(let utente of this.listautenti){
        if(utente.email === this.firebase.userData.email){
            utenteDaInserire = utente.nome;
            break;
        }
    }

    this.firebase.update(spaziopubb.key! , {'operatore' : utenteDaInserire});

  }

  inviatuttelemail(spaziopubb: Spaziopubblicitario, utenteDaInserire: string){
      let idspaziomodificato = spaziopubb.idspazio;
      let operatoremodificante = utenteDaInserire;
      let statodellospazio = spaziopubb.stato;
      let subject = "Spazio pubblicitario " + idspaziomodificato + " modificato: " + statodellospazio;
      let body = "Lo spazio pubblicitario " + idspaziomodificato + " è stato modificato da " + operatoremodificante + ". Adesso " + idspaziomodificato + " è " + statodellospazio;

      for(let utente of this.listautenti){
          if(utente.email !== operatoremodificante){
              this.inviaemail(utente.email,subject,body);
          }
      }
  }


  prendilistautenti(){
      this.firebase.getUtenti().snapshotChanges().pipe(
          map(
              changes => changes.map(
                  c=>({key:c.payload.key, ...c.payload.val()})
              )
          )
      ).subscribe(data => {
          this.listautenti = data;
      });
  }


  inviaemail(emaildestinatario:string, subject: string, body: string){
      Email.send({
          Host: "smtp.gmail.com",
          Username: "oktoberfestmarketingauto@gmail.com",
          Password: "repbqkohopkysspe",
          To: emaildestinatario,
          From: "oktoberfestmarketingauto@gmail.com",
          Subject: subject,
          Body: body,
      }).then(
          (message:any) => console.log(message)
      );
  }



  getValueFromEvent(event:any){
      return (event.target as HTMLInputElement).value;
  }

}
