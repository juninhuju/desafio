// src/app/profile/dashboard/dashboard.component.ts

import { Component, OnInit, inject } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { Observable, of } from 'rxjs'; 
import { tap } from 'rxjs/operators'; // ✅ Importação correta do operador 'tap'

// Importação dos serviços e componentes
import { AuthService } from '../../services/auth.service';
// REMOVIDO: import { ProfileService } from '../../services/profile.service'; 
import { RiskProfileComponent } from '../risk-profile/risk-profile.component';
import { PortfolioComponent } from "../portfolio/portfolio.component";

// Importações dos modelos
import { RiskProfile } from '../../models/profile.model'; 
import { InvestmentHistoryItem } from '../../models/investment.model';
import { SuggestedProductsComponent } from "../suggested-products/suggested-products.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RiskProfileComponent,
    PortfolioComponent,
    SuggestedProductsComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit { 
  
  // --- INJEÇÕES ---
  private authService = inject(AuthService);
  private router = inject(Router);
  // REMOVIDO: private profileService = inject(ProfileService); <--- ESTE ERRO FOI ELIMINADO

  // --- PROPRIEDADES DE DADOS E ESTADO ---
  
  public profile$: Observable<RiskProfile | null> = of(null);
  public history$: Observable<InvestmentHistoryItem[]> = of([]);

  public investmentDistribution: { name: string, value: number }[] = [];
  public isSimulatorOpen: boolean = false;
  public selectedProduct: any = null; 
  
  // --- CICLO DE VIDA ---

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // --- MÉTODOS DE DADOS ---

  loadDashboardData(): void {
    const clientId = this.authService.getClientId();
    
    if (clientId) {
        // ✅ CORRIGIDO: Chamando agora no AuthService
        this.profile$ = this.authService.getRiskProfile(clientId);
        
        // ✅ CORRIGIDO: Chamando agora no AuthService
        this.history$ = this.authService.getInvestmentHistory(clientId).pipe(
            // ✅ CORRIGIDO: Tipagem de 'history' para resolver o erro 'any'
            tap((history: InvestmentHistoryItem[]) => { 
                this.investmentDistribution = this.mapHistoryToDistribution(history);
            })
        );
    }
  }

  // ... (mapHistoryToDistribution, logout, openSimulator, closeSimulator)
    private mapHistoryToDistribution(history: InvestmentHistoryItem[]): { name: string, value: number }[] {
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