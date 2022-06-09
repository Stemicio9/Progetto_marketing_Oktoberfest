import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, CollectionReference, DocumentData} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {Fileupload} from './fileupload';
import {finalize, Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';
import {Spaziopubblicitario} from './spaziopubblicitario';
import {object, ref, set} from '@angular/fire/database';
import {spawn} from 'child_process';
import {addDoc, collection, Firestore, getDocs, getFirestore, doc} from '@angular/fire/firestore';


export interface User{
  uid:string;
  email:string;
  displayName:string;
  photoURL:string;
  emailVerified:boolean;
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  app:any;
  analytics:any;
  userData:any;

  constructor(public afs:AngularFirestore, public afAuth:AngularFireAuth,public router:Router, public ngZone:NgZone, public firestorage: AngularFireStorage, public firedata: AngularFireDatabase) {

    this.spaziRef = firedata.list(this.dbPath);
    this.utentiRef = firedata.list(this.dbPathUtenti);

    //@todo salvare utente in local storage
    this.afAuth.authState.subscribe(
        user=>{
          if(user){
            this.userData = user;
            localStorage.setItem('user',JSON.stringify(this.userData));
          } else {
            localStorage.setItem('user', 'null');
          }
        }
    )
    // this.app = initializeApp(this.firebaseConfig);
    // this.analytics = getAnalytics(this.app);
  }
  signIn(email:string, password:string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
        result => {
          console.log('UTENTE');
          console.log(result);
          this.userData = result.user;
          localStorage.setItem('user',JSON.stringify(this.userData));
          this.ngZone.run(() => {
            this.router.navigate(['/admin/spazipubblicitari']);
          });
          this.setUserData(result.user);
        }
    )
        .catch(error => {
          console.log('Stampo errore');
          console.log(error.code)
          return error.code;
        })
  }
  SendVerificationEmail(){
    return this.afAuth.currentUser.then(
        (user:any)=>{
          user.sendEmailVerification()
        }
    )
        .then(()=>{
          //@todo navigazione verso pagina recupero password
        })
  }
  setUserData(user:any){
    const userRef: AngularFirestoreDocument<any>=this.afs.doc('users/${user.uid}');
    this.userData = {
      uid:user.uid,
      email:user.email,
      displayName:user.displayName,
      photoURL:user.photoURL,
      emailVerified:user.emailVerified,
    }
    return userRef.set(this.userData, {merge:true});
  }
  signOut(){
    return this.afAuth.signOut().then(()=>{
      this.userData=undefined;
      return this.afAuth.signOut().then(
          () =>{
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }
      )
    })
  }
  get isLoggedIn() : boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user != null;

  }
  signUp(email:string, password:string){
    return this.afAuth.createUserWithEmailAndPassword(email,password).then(
        result=>{
          console.log(result);
          this.SendVerificationEmail();
          this.setUserData(result.user);
          this.afs.collection('user').add({uid: result.user?.uid}).catch(
              error =>{
                console.log(error)
              }
          )
        })
        .catch(error => {
          console.log(error)
        })
  }
  salvaImmagine(event: any){

      console.log("stampo target");
      console.log(event);
      var file = event.target.files[0];
      const filepath = '/gallery/' + file.name;
      const storageref = this.firestorage.ref(filepath);
      const upload = this.firestorage.upload(filepath, file);
      upload.snapshotChanges().pipe(
          finalize(
              ()=>{
                  storageref.getDownloadURL().subscribe(
                      result=>{
                           console.log('STAMPO URL DOWNLOAD');
                           console.log(result);
                      }
                  )
              }
          )
      ).subscribe();
  }
   getImages(){
      console.log("Chiamo la rest");
    //  return this.firestorage.ref('/gallery').list()
      return this.firestorage.ref('/gallery').list();

     /* listresult.forEach(
          val =>  {
              val.items[0].getDownloadURL()
          }
      ) */
   /*   return this.firedata.list(
          '/gallery', ref => {
              return ref.limitToLast(50)
          }
      ); */
  }



    //Sezione relativa agli spazi pubblicitari

    private dbPath = '/spazi';
    spaziRef: AngularFireList<Spaziopubblicitario>;


     getSpazi() {
       return this.spaziRef;
    }
     creaSpazio(spazio:Spaziopubblicitario){
       this.spaziRef.push(spazio).catch(error => {
           console.log('Errore');
           console.log(error);
       });
    }
    deleteSpazi(id:string){

    }
    updateSpazi(spazio:Spaziopubblicitario){

    }
    update(key:string, value:any){
         this.spaziRef.update(key,value);
    }

    // Sezione relativa alla Gallery


    getDirectories(){
        return this.firestorage.ref('/').list();
    }

    getImagesInDirectory(value: string){
        return this.firestorage.ref('/' + value).list();
    }


    private dbPathUtenti = '/utenti';
    utentiRef: AngularFireList<any>;

    getUtenti() {
        return this.utentiRef;
    }
    creaUtente(utente:any){
        this.utentiRef.push(utente).catch(error => {
            console.log('Errore');
            console.log(error);
        });
    }

}
