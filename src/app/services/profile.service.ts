import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RiskProfile } from '../models/profile.model';
import { InvestmentHistoryItem } from '../models/investment.model';
import { RecommendedProduct } from '../models/product.model'; // Mantenha este import para o próximo passo
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = 'http://localhost:3000/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getClientUrlSegment(): string {
    const clientId = this.authService.getClientId();
    if (!clientId) {
      throw new Error('Client ID não encontrado. Usuário não autenticado.');
    }
    return clientId.toString();
  }

  /**
   * Busca o Perfil de Risco atual do cliente.
   * Endpoint: GET /perfil-risco/{clienteld} [cite: 47]
   */
  getRiskProfile(): Observable<RiskProfile> {
    const clientIdSegment = this.getClientUrlSegment();
    const endpoint = `${this.API_URL}/perfil-risco/${clientIdSegment}`;
    // A propriedade getRiskProfile é definida aqui:
    return this.http.get<RiskProfile>(endpoint);
  }

  /**
   * Busca o Histórico de Investimentos do cliente.
   * Endpoint: GET /investimentos/{clienteld} [cite: 56]
   */
  getInvestmentHistory(): Observable<InvestmentHistoryItem[]> {
    const clientIdSegment = this.getClientUrlSegment();
    const endpoint = `${this.API_URL}/investimentos/${clientIdSegment}`;
    // A propriedade getInvestmentHistory é definida aqui:
    return this.http.get<InvestmentHistoryItem[]>(endpoint);
  }
  
  /**
   * Busca a lista de produtos de investimento recomendados.
   * Endpoint: GET /produtos-recomendados/{perfil} [cite: 75]
   */
  getRecommendedProducts(perfil: string): Observable<RecommendedProduct[]> {
    const perfilSegment = perfil.toLowerCase(); 
    const endpoint = `${this.API_URL}/produtos-recomendados/${perfilSegment}`;
    return this.http.get<RecommendedProduct[]>(endpoint); 
  }
}