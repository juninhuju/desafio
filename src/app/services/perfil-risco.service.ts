// src/app/services/perfil-risco.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PerfilRisco } from '../models/perfil-risco'; // Importe o modelo

@Injectable({
  providedIn: 'root'
})
export class PerfilRiscoService {

  // Dados mocados (simulação da resposta da API)
  private mockData: PerfilRisco = {
    clienteId: 123,
    perfil: "Moderado", // A API retorna este perfil
    descricao: "Perfil equilibrado entre segurança e rentabilidade.",
    pontuacao: 65
  };

  constructor() { }

  /**
   * Simula a chamada GET /perfil-risco/{clienteId}
   * @param clienteId O ID do cliente a ser buscado
   * @returns Um Observable que emite o PerfilRisco após um pequeno delay
   */
  getPerfilRisco(clienteId: number): Observable<PerfilRisco> {
    // Para simular a latência da rede, adicione um delay
    console.log(`Buscando perfil de risco para o cliente: ${clienteId}`);
    return of(this.mockData).pipe(
      delay(500) // 0.5 segundos de delay para simular a API
    );
  }
}