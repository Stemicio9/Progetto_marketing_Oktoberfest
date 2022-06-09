import { Component, OnInit } from '@angular/core';
import {Spaziopubblicitario} from '../services/spaziopubblicitario';
import {FirebaseService} from '../services/firebase.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Altreinfo} from '../services/altreinfo';

@Component({
  selector: 'app-creaspaziopubblicitario',
  templateUrl: './creaspaziopubblicitario.component.html',
  styleUrls: ['./creaspaziopubblicitario.component.scss']
})
export class CreaspaziopubblicitarioComponent implements OnInit {
  spaziodaaggiungere = new Spaziopubblicitario();
  file:any;

  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {
    this.spaziodaaggiungere.altreinfo!.push(new Altreinfo());



  }
  crea(spazio:Spaziopubblicitario){
    this.firebase.creaSpazio(spazio);
  }
  onFileInput(event:any){
    console.log('evento');
    console.log(event.srcElement.files[0]);
    this.file = event.srcElement.files[0];
    this.caricaSuFirebase();
  }






    caricaSuFirebase(){
    let reader = new FileReader();
    reader.readAsText(this.file);
    reader.onload = async () => {
      let csv = reader.result;
      let csvrecords = (<string>csv).split('\r\n');
      let headers = this.getHeaders(csvrecords);
      let records = this.getdata(csvrecords);
      for (let singlerecord of records) {
        this.crea(singlerecord);
        await new Promise(f => setTimeout(f, 1000));
      }
    }
  }






  getHeaders(records:any){
    let headers = records[0].split(',');
    let array = [];
    for (let i=0; i<headers.length; i++){
      array.push(headers[i]);
    }
    return array;
  }
  getdata(records:any){
    let csvarray = [];
    for(let i=1; i<records.length; i++){
      let currentrecord = records[i].split(',');
      let singlerecord = new Spaziopubblicitario();
      singlerecord.altreinfo!.push(new Altreinfo());
      singlerecord.altreinfo![0].descrizione = currentrecord[0];
      singlerecord.altreinfo![0].posizione = currentrecord[1];
      singlerecord.idspazio = currentrecord[2];
      singlerecord.altreinfo![0].codice2 = currentrecord[3];
      singlerecord.altreinfo![0].periodo = currentrecord[4];
      singlerecord.altreinfo![0].modulo = currentrecord[5];
      singlerecord.altreinfo![0].misura = currentrecord[6];
      singlerecord.altreinfo![0].moduli = currentrecord[7];

      singlerecord.prezzo = currentrecord[8].replace('\"', '').trim() + ',' + currentrecord[9].replace('\"', '').trim();

      singlerecord.altreinfo![0].importototale = currentrecord[10].replace('\"', '').trim() + ',' + currentrecord[11].replace('\"', '').trim();
      if(currentrecord[12] === undefined){
        singlerecord.altreinfo![0].note = "";
      } else {
        singlerecord.altreinfo![0].note = currentrecord[12];
      }

      if(currentrecord[13] === undefined) {
        singlerecord.altreinfo![0].note2 = "";
      }else {
        singlerecord.altreinfo![0].note2 = currentrecord[13];
      }

      singlerecord.stato = '1';
      csvarray.push(singlerecord);
    }
    for(let j=0; j<99; j++){
      console.log(csvarray[j]);
    }
    return csvarray;
  }


  delay(ms: number){
    return new Promise(resolve => setTimeout(resolve,ms));
  }
}



