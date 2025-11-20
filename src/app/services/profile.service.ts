import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RiskProfile } from '../models/profile.model';
import { Investimento } from '../models/investment.model';
import { RecommendedProduct } from '../models/product.model';
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

  private getClientId(): number {
    const clientId = this.authService.getClientId();
    if (!clientId) {
      throw new Error('Client ID não encontrado. Usuário não autenticado.');
    }
    return clientId;
  }

  getRiskProfile(): Observable<RiskProfile> {
    const clientId = this.getClientId();
    const endpoint = `${this.API_URL}/perfil-risco?id=${clientId}`;
    return this.http.get<RiskProfile[]>(endpoint).pipe(
      map(profiles => profiles[0]) // retorna o primeiro item
    );
  }

  getInvestmentHistory(): Observable<Investimento[]> {
    const clientId = this.getClientId();
    const endpoint = `${this.API_URL}/investimentos?clienteId=${clientId}`;
    return this.http.get<Investimento[]>(endpoint);
  }

  /** GET /api/v1/produtos-recomendados?perfil={perfil} */
  getRecommendedProducts(perfil: string): Observable<RecommendedProduct[]> {
    const endpoint = `${this.API_URL}/produtos-recomendados?perfil=${perfil}`;
    return this.http.get<RecommendedProduct[]>(endpoint);
  }
}
