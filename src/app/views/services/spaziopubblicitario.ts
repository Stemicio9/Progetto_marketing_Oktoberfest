import {Altreinfo} from './altreinfo';

export class Spaziopubblicitario {
    key?:string | null;
    prezzo?:string;
    stato?:string;
    operatore?:string;
    idspazio?:string;
    altreinfo?:Altreinfo[]=[];
    posizione?:string;
}
