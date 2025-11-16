import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private readonly API_BASE = 'http://localhost:3000/api/v1';
  private readonly SIMULATOR_URL = `${this.API_BASE}/simular-investimento`;

  constructor(private http: HttpClient) {}

  /**
   * Envia requisição de simulação de investimento para o backend.
   * @param request Dados da simulação (valor, prazo, tipo)
   * @returns Observable com a resposta da simulação
   */
  simulateInvestment(request: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(this.SIMULATOR_URL, request);
  }
}
