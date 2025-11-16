// src/app/services/portfolio.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importamos 'of' e 'Observable'
import { Investimento } from '../models/portfolio.model'; // Importamos o modelo

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  // Dados mocados (Mock Data) que a "API" irá retornar para a carteira
  private mockCarteira: Investimento[] = [
    {
      "id": 1,
      "tipo": "CDB",
      "valor": 5000,
      "rentabilidade": 0.12,
      "data": "2025-01-15"
    },
    {
      "id": 2,
      "tipo": "Fundo Multimercado",
      "valor": 3000,
      "rentabilidade": 0.08,
      "data": "2025-03-10"
    },
  ];

  constructor() { }

  /**
   * Simula a chamada GET /portfolio/{clienteId}
   * @param clienteId O ID do cliente.
   * @returns Observable do array de Investimentos.
   */
  getPortfolioDoCliente(clienteId: number): Observable<Investimento[]> {
    console.log(`Buscando carteira para o cliente ID: ${clienteId} (Mock)`);
    // Retorna os dados mockados dentro de um Observable
    return of(this.mockCarteira);
  }
}