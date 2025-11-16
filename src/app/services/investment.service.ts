// src/app/services/investment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model'; 

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  
  // CORREÇÃO: Removendo o prefixo '/api/v1' para simplificar a conexão com o Mock Server
  private readonly API_BASE = 'http://localhost:3000';
  
  // A URL agora será: http://localhost:3000/simular-investimento
  private readonly SIMULATOR_URL = `${this.API_BASE}/simular-investimento`;

  constructor(private http: HttpClient) {}

  /**
   * Envia requisição de simulação de investimento para o backend.
   */
  simulateInvestment(request: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(this.SIMULATOR_URL, request);
  }
}