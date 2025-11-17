// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs'; 
import { tap } from 'rxjs/operators';

// Importações dos modelos
import { LoginRequest, LoginResponse } from '../models/auth.model'; 
import { RiskProfile } from '../models/profile.model'; 
import { InvestmentHistoryItem } from '../models/investment.model';
import { RecommendedProduct } from '../models/product.model';

// =================================================================
// ✅ NOVAS CONSTANTES PARA FILTRAGEM DINÂMICA
// =================================================================

// 1. Lista Unificada de TODOS os produtos disponíveis
const ALL_PRODUCTS: RecommendedProduct[] = [
  { id: 101, nome: "CDB Caixa 2026", tipo: "CDB", rentabilidade: 0.12, risco: "Baixo" },
  { id: 102, nome: "Fundo Agressivo XPTO", tipo: "Fundo", rentabilidade: 0.18, risco: "Alto" },
];

// 2. Mapa de Regras de Inclusão
const RISK_INCLUSION_MAP: { [key: string]: Array<'Baixo' | 'Médio' | 'Alto'> } = {
  // O perfil do mock está como 'Moderado', mas incluímos o padrão
  'Conservador': ['Baixo'],
  'Moderado': ['Baixo', 'Médio'],
  // Tratamos 'Agressivo' e 'Arrojado' como a mesma regra
  'Agressivo': ['Baixo', 'Médio', 'Alto'], 
};

// =================================================================

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly API_URL = 'http://localhost:3000/api/v1';
  private readonly LOGIN_ENDPOINT = `${this.API_URL}/autenticacao/login`;

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  // --- MÉTODOS DE AUTENTICAÇÃO E BÁSICOS ---

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.LOGIN_ENDPOINT, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('client_id', response.clientId.toString());
        this.loggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('client_id');
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getClientId(): number | null {
    const clientId = localStorage.getItem('client_id');
    return clientId ? parseInt(clientId, 10) : null; 
  }
  
  // --- MÉTODOS DE DADOS DO PERFIL ---
  
  getRiskProfile(clientId: number): Observable<RiskProfile> {
    const mockProfile: RiskProfile = { 
      clienteld: clientId, 
      perfil: 'Moderado', // Retorna Moderado para testes
      descricao: 'Perfil equilibrado entre segurança e rentabilidade.', 
      pontuacao: 65 
    };
    return of(mockProfile); 
  }

  getInvestmentHistory(clientId: number): Observable<InvestmentHistoryItem[]> {
    const mockHistory: InvestmentHistoryItem[] = [
      { id: 1, tipo: 'CDB', valor: 5000, rentabilidade: 0.12, data: '2025-01-15' },
      { id: 2, tipo: 'Fundo', valor: 3000, rentabilidade: 0.08, data: '2025-03-10' }
    ];
    return of(mockHistory);
  }

  /**
   * ✅ IMPLEMENTAÇÃO CORRETA: Filtra ALL_PRODUCTS com base no perfil.
   */
  getRecommendedProducts(perfil: string): Observable<RecommendedProduct[]> {
    // 1. Obtém os níveis de risco permitidos para o perfil
    const allowedRisks = RISK_INCLUSION_MAP[perfil];

    if (!allowedRisks) {
      // Se o perfil for desconhecido, retorna vazio
      return of([]);
    }
    
    // 2. Filtra a lista completa de produtos (ALL_PRODUCTS)
    const filteredProducts = ALL_PRODUCTS.filter(product => 
      // Verifica se o risco do produto está incluído nos riscos permitidos
      allowedRisks.includes(product.risco)
    );

    return of(filteredProducts);
  }

  // --- LÓGICA INTERNA ---

  private checkLoginStatus(): void {
    const token = this.getToken();
    this.loggedInSubject.next(!!token);
  }
}