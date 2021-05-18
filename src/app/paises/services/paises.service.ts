import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = ['Africa','Americas','Europe','Oceania'];

  get regiones(): string[] {
    return [... this._regiones];
  }


  constructor( private _http: HttpClient ) { }

  getPaisesPorRegion( region: string): Observable<PaisSmall[]>{
    
    const url: string = `${ this._baseUrl }/region/${region}?fields=name;alpha3Code`;
    return this._http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {
    if( !codigo ) { return of( null ); }

    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this._http.get<Pais>( url );
  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
    const url: string = `${ this._baseUrl }/alpha/${codigo}?fields=name;alpha3Code`;
    return this._http.get<PaisSmall>( url );
  }

  getPaisesPorCodigos( fronteras: string[] ): Observable<PaisSmall[]>{
    if( !fronteras ){
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    fronteras.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall( codigo );
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );
  }

}
