import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RiskProfile } from '../models/profile.model'; // use o modelo unificado

@Injectable({
  providedIn: 'root'
})
export class PerfilRiscoService {

  private readonly API_URL = 'http://localhost:3000/api/v1/perfil-risco';

  constructor(private http: HttpClient) {}

  getPerfilRisco(clienteId: number): Observable<RiskProfile> {
    console.log(`Buscando perfil de risco para o cliente: ${clienteId}`);
    return this.http.get<RiskProfile[]>(`${this.API_URL}?id=${clienteId}`).pipe(
      map(data => data[0]) // retorna o primeiro item do array
    );
  }
}
