// src/app/profile/suggested-products/suggested-products.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ⬅️ NECESSÁRIO PARA [(ngModel)]
import { Observable, switchMap, tap, of } from 'rxjs'; 

import { AuthService } from '../../services/auth.service';
import { RecommendedProduct } from '../../models/product.model';
import { RiskProfile } from '../../models/profile.model';

import { InvestmentService } from '../../services/investment.service'; 
import { SimulationRequest, SimulationResponse } from '../../models/simulation.model'; 

// Interface para o resultado do CÁLCULO FEITO NO FRONTEND
interface SimulationCalculationResult {
    rentabilidade: number; 
    valorFinal: number; 
    detalhes: string;
    valorInicial: number;
    prazoMeses: number;
}

// Interface local que estende RecommendedProduct para incluir o campo de resultado
interface ProductWithSimulation extends RecommendedProduct {
    simulatedResult?: SimulationCalculationResult | null;
}

@Component({
  selector: 'app-suggested-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PercentPipe, FormsModule], // ⬅️ FormsModule Adicionado
  templateUrl: './suggested-products.component.html', 
  styleUrls: ['./suggested-products.component.scss']
})
export class SuggestedProductsComponent implements OnInit {

  private authService: AuthService = inject(AuthService);
  private investmentService: InvestmentService = inject(InvestmentService); 
  
  public suggestedProducts$!: Observable<ProductWithSimulation[]>;
  public userProfile: string = 'Carregando...';

  // ➡️ INPUTS BINDING
  public valorInput: number = 10000;
  public prazoInput: number = 12;

  ngOnInit(): void {
    this.loadSuggestedProducts();
  }

  loadSuggestedProducts(): void {
    const clientId = this.authService.getClientId();
    
    if (clientId) {
      this.suggestedProducts$ = this.authService.getRiskProfile(clientId).pipe(
        tap(profile => {
          this.userProfile = profile?.perfil || 'Não Definido'; 
        }),
        switchMap(profile => {
          if (profile?.perfil) {
            return this.authService.getRecommendedProducts(profile.perfil) as Observable<ProductWithSimulation[]>;
          }
          return of([]); 
        })
      );
    } else {
        this.userProfile = 'Usuário Não Identificado';
        this.suggestedProducts$ = of([]);
    }
  }

  /**
   * Função de cálculo que usa Juros Simples para obter o resultado linear (ex: 12% em 1 ano = 11.200).
   */
  private calculateFrontendResult(
    taxaAnual: number, 
    valorInicial: number, 
    prazoMeses: number, 
    detalhes: string
  ): SimulationCalculationResult {
      
      // Converte o prazo de meses para anos
      const tempoAnos = prazoMeses / 12;

      // Juros Simples: ValorFinal = ValorInicial * (1 + TaxaAnual * TempoAnos)
      const valorFinal = valorInicial * (1 + (taxaAnual * tempoAnos));

      return {
          rentabilidade: taxaAnual,
          valorFinal: Number(valorFinal.toFixed(2)),
          detalhes: detalhes,
          valorInicial: valorInicial,
          prazoMeses: prazoMeses
      };
  }

  simulateInvestment(product: ProductWithSimulation): void {
    // 1. TOGLE: Se a simulação já estiver visível, limpa e sai.
    if (product.simulatedResult) {
        product.simulatedResult = null;
        return;
    }
    
    // 2. Validação dos Inputs
    if (this.valorInput <= 0 || this.prazoInput <= 0 || !this.valorInput || !this.prazoInput) {
        alert("Por favor, insira um valor e prazo válidos para simulação.");
        return;
    }
    
    product.simulatedResult = undefined; 
    
    // 3. Cria o Payload com os valores do Input
    const requestPayload: SimulationRequest = {
      "valor": this.valorInput, 
      "prazoMeses": this.prazoInput, 
      "tipo": product.tipo
    };

    console.log(`Iniciando simulação para ${product.nome}. Payload:`, requestPayload);

    this.investmentService.simulateInvestment(requestPayload).subscribe({
      next: (result: SimulationResponse) => {
        console.log('✅ Taxa Recebida do Mock:', result);
        
        // 4. Realiza o cálculo no frontend usando Juros Simples
        const resultadoCalculado = this.calculateFrontendResult(
            result.rentabilidade, 
            this.valorInput, 
            this.prazoInput, 
            result.detalhes
        );
        
        product.simulatedResult = resultadoCalculado;
      },
      error: (error: any) => {
        console.error('❌ Erro na Simulação:', error);
        alert('Erro ao simular o investimento. Verifique o console e o status do backend.');
      }
    });
  }

  invest(product: RecommendedProduct): void {
    console.log(`Iniciando investimento no produto: ${product.nome}`);
  }
}