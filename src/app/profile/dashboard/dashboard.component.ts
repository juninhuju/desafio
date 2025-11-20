// src/app/profile/dashboard/dashboard.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOCALE_ID } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { RiskProfileComponent } from '../risk-profile/risk-profile.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { SuggestedProductsComponent } from '../suggested-products/suggested-products.component';

import { RiskProfile } from '../../models/profile.model';
import { Investimento } from '../../models/investment.model'; // ✅ modelo unificado

registerLocaleData(localePt);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RiskProfileComponent,
    PortfolioComponent,
    SuggestedProductsComponent,
    CurrencyPipe // ⚠️ remova se não usar no HTML
  ],
  providers: [
    CurrencyPipe, // ⚠️ remova se não usar no HTML
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  public profile$: Observable<RiskProfile | null> = of(null);
  public history$: Observable<Investimento[]> = of([]); // ✅ corrigido

  public investmentDistribution: { name: string, value: number }[] = [];
  public isSimulatorOpen: boolean = false;
  public selectedProduct: any = null;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const clientId = this.authService.getClientId();

    if (clientId) {
      this.profile$ = this.authService.getRiskProfile(clientId);
      this.history$ = this.authService.getInvestmentHistory(clientId).pipe(
        tap((history: Investimento[]) => { // ✅ corrigido
          this.investmentDistribution = this.mapHistoryToDistribution(history);
        })
      );
    }
  }

  private mapHistoryToDistribution(history: Investimento[]): { name: string, value: number }[] { // ✅ corrigido
    const distributionMap = new Map<string, number>();

    history.forEach(item => {
      const currentTotal = distributionMap.get(item.tipo) || 0;
      distributionMap.set(item.tipo, currentTotal + item.valor);
    });

    return Array.from(distributionMap, ([name, value]) => ({ name, value }));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  openSimulator(product: any): void {
    this.selectedProduct = product;
    this.isSimulatorOpen = true;
  }

  closeSimulator(): void {
    this.isSimulatorOpen = false;
    this.selectedProduct = null;
  }
}
