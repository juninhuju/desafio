import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 
import { tap, map } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/auth.model'; 
import { RiskProfile } from '../models/profile.model'; 
import { Investimento } from '../models/investment.model';
import { RecommendedProduct } from '../models/product.model';

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

  // --- DADOS DO PERFIL ---
  getRiskProfile(clientId: number): Observable<RiskProfile> {
    return this.http.get<RiskProfile[]>(`${this.API_URL}/perfil-risco?id=${clientId}`).pipe(
      map(data => data[0])
    );
  }

  getInvestmentHistory(clientId: number): Observable<Investimento[]> {
    return this.http.get<Investimento[]>(`${this.API_URL}/investimentos?clienteId=${clientId}`);
  }

  getRecommendedProducts(perfil: string): Observable<RecommendedProduct[]> {
    return this.http.get<RecommendedProduct[]>(`${this.API_URL}/produtos-recomendados?perfil=${perfil}`);
  }

  private checkLoginStatus(): void {
    const token = this.getToken();
    this.loggedInSubject.next(!!token);
  }
}
