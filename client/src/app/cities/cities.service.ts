import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {
    url = 'http://localhost:3030/';

    constructor(private http: HttpClient) { }

    getCities(offset: number, limit: number, filter: string): Observable<any> {
        return this.http.get(`${this.url}cities?offset=${offset}&limit=${limit}&filter=${filter}`);
    }

    getPreferencesCities(offset: number, limit: number): Observable<any> {
        return this.http.get(`${this.url}preferences/cities?offset=${offset}&limit=${limit}`);
    }

    getCity(cityId: string): Observable<any> {
        return this.http.get(`${this.url}cities/${cityId}`);
    }

    saveSelectedCities(preferredCitiesPatch: any): Observable<any> {
        return this.http.patch(`${this.url}preferences/cities`, preferredCitiesPatch);
    }
}
