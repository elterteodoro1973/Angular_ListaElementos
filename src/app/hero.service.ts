import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertType } from './alert.model';
import { Hero } from './hero.model';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = `${environment.baseUrl}/heroes`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    }),
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  // GET /heroes
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl, this.httpOptions).pipe(
      tap((heroes) => {
        this.log(`encontrado ${heroes.length} elementos`);
      }),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // GET /heroes/id
  getHero(id: number): Observable<Hero> {
    return this.http
      .get<Hero>(`${this.heroesUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(() => this.log(`elemento encontrado id=${id}.`)),
        catchError(this.handleError<Hero>('getHero'))
      );
  }

  // PUT /heroes/id
  updateHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http.put<Hero>(url, hero, this.httpOptions).pipe(
      tap(() => this.log(`elemento atualizado id=${hero.id}.`, AlertType.success)),
      catchError(this.handleError<Hero>('updateHero'))
    );
  }

  // POST /heroes
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero) =>
        this.log(`elemento adicionado w/ id=${newHero.id}.`, AlertType.success)
      ),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  // DELETE /heroes/id
  deleteHero(hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(() => this.log(`elemento excluído id=${hero.id}.`, AlertType.success)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  // GET /heroes/?term=xxx
  searchHeroes(term: string): Observable<Hero[]> {
    if (!(term && term.trim())) {
      return of([]);
    }

    return this.http
      .get<Hero[]>(this.heroesUrl, {
        ...this.httpOptions,
        params: {
          name: term,
        },
      })
      .pipe(
        tap((heroes) => {
          heroes && heroes.length
            ? this.log(`Presente ${heroes.length} elementos =${term}`)
            : this.log(`nenhum termo de correspondência de elemento${term}`, AlertType.warning);
        }),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private log(message: string, type = AlertType.info) {
    this.messageService.add({
      message: `Serviço: ${message}`,
      type,
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);

      this.log(`${operation} falha: ${error.message}`, AlertType.danger);

      return of(result);
    };
  }
}
