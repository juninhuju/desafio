import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private readonly API_URL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  simulateInvestment(payload: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(`${this.API_URL}/simular-investimento`, payload).pipe(
      map(response => ({
        rentabilidade: response.rentabilidade,
        detalhes: response.detalhes,
        valorFinal: 0 
      }))
    );
  }
}
