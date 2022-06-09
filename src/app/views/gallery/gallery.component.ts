import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Reference} from '@angular/fire/compat/storage/interfaces';
import firebase from 'firebase/compat';
import ListResult = firebase.storage.ListResult;
import {GalleryItem, ImageItem} from 'ng-gallery';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  filecaricato = false;
  files?:any[] = [];


  images: Array<object> = [];
  size = {
      width: '400px',
      height: '200px',
      space: 4
  };

  listacartelle: any[] = [];
  cartellaselezionata = 'Area Business';

  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {

    this.firebase.getDirectories().subscribe(result => {
        result.prefixes.forEach(
            value => {
                this.listacartelle.push(value);
            }
        );

        this.cartellaselezionata = this.listacartelle[0].name;
        this.updatecartella();
    });

  }

   riempilista(result: ListResult){
      this.files = [];
      this.images = [];
      result.items.forEach(
          curr => {
              var current = curr.getDownloadURL();
              current.then(url => {
                  console.log("URL PER URL");
                  console.log(url);
                  this.files?.push(url);
                  this.images?.push(
                      { image: url, thumbImage: url }
                  )
              })
          }
      )
  }



  immaginecambiata($event:any){
      this.firebase.salvaImmagine($event);
      this.filecaricato = true;
  }

    updatecartella(){
      console.log("Cerco le immagini : " + this.cartellaselezionata);
      this.firebase.getImagesInDirectory(this.cartellaselezionata).subscribe(result => {
          this.riempilista(result);
      })
    }

}
