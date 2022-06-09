import { Component, OnInit } from '@angular/core';
import {Spaziopubblicitario} from '../services/spaziopubblicitario';
import {map} from 'rxjs';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-tabellautenti',
  templateUrl: './tabellautenti.component.html',
  styleUrls: ['./tabellautenti.component.scss']
})
export class TabellautentiComponent implements OnInit {
  listautenti: any [] = [];

  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {

    console.log('ON INIT del component');
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

}
