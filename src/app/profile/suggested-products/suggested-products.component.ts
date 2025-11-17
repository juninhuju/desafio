// src/app/profile/suggested-products/suggested-products.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, switchMap, tap, of } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // ⬅️ NOVO: Importe o módulo ngx-charts

import { AuthService } from '../../services/auth.service';
import { RecommendedProduct } from '../../models/product.model';
// import { RiskProfile } from '../../models/profile.model'; // Removido para simplificar

import { InvestmentService } from '../../services/investment.service';
import { SimulationRequest, SimulationResponse } from '../../models/simulation.model';

// Interface para dados de um ponto no gráfico
interface ChartSeriesItem {
    name: string; // Mês/Ano (ex: Jan/25)
    value: number; // Valor do Patrimônio naquele mês
}

// Interface para a série de dados do ngx-charts
interface NgxChartData {
    name: string; // Nome da série (ex: Crescimento)
    series: ChartSeriesItem[];
}

// Interface para o resultado do CÁLCULO FEITO NO FRONTEND (Atualizada para incluir dados do gráfico)
interface SimulationCalculationResult {
    rentabilidade: number;
    valorFinal: number;
    detalhes: string;
    valorInicial: number;
    prazoMeses: number;
    chartData: NgxChartData[]; // ⬅️ NOVO: Dados para o ngx-charts
}

// Interface local que estende RecommendedProduct para incluir o campo de resultado
interface ProductWithSimulation extends RecommendedProduct {
    simulatedResult?: SimulationCalculationResult | null;
}

@Component({
  selector: 'app-suggested-products',
  standalone: true,
  // ⬅️ ATUALIZAÇÃO: Adicionado NgxChartsModule
  imports: [CommonModule, CurrencyPipe, PercentPipe, FormsModule, NgxChartsModule], 
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

  // ➡️ CONFIGURAÇÃO DO GRÁFICO (Mover para o componente se for complexo, mas manter aqui por enquanto)
  chartView: [number, number] = [400, 300]; // Dimensões do gráfico no card
  chartCustomColors: any[] = [{ name: "Crescimento", value: "#004c98" }];
  chartYAxisLabel: string = 'Patrimônio (R$)';

  ngOnInit(): void {
    this.loadSuggestedProducts();
  }

  loadSuggestedProducts(): void {
    const clientId = this.authService.getClientId();
    
    // ... (Lógica de Carregamento) ...
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
   * NOVO: Gera a série de dados mês a mês para o gráfico.
   * Assume juros simples linear para fins de simulação de front-end.
   */
  private generateChartData(valorInicial: number, taxaAnual: number, prazoMeses: number): NgxChartData[] {
      const taxaMensal = taxaAnual / 12;
      let valorAtual = valorInicial;
      const series: ChartSeriesItem[] = [];
      const currentDate = new Date(); // Mês de referência 0
      
      for (let i = 0; i <= prazoMeses; i++) {
          let date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
          
          // Formata o nome do mês (ex: Jan/25)
          const name = `${date.toLocaleString('pt-BR', { month: 'short' })}/${date.getFullYear().toString().slice(2)}`;
          
          if (i > 0) {
              // Aplica o crescimento linear mês a mês (juros simples)
              // Valor do juros acumulado até o mês 'i': ValorInicial * TaxaMensal * i
              valorAtual = valorInicial * (1 + taxaMensal * i);
          }
          
          series.push({
              name: name,
              value: Number(valorAtual.toFixed(2))
          });
      }
      
      return [{
          name: "Crescimento",
          series: series
      }];
  }


  /**
   * Função de cálculo que usa Juros Simples.
   * ATUALIZADO: Chama generateChartData.
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

      // ⬅️ NOVO: Geração dos dados do gráfico
      const chartData = this.generateChartData(valorInicial, taxaAnual, prazoMeses);

      return {
          rentabilidade: taxaAnual,
          valorFinal: Number(valorFinal.toFixed(2)),
          detalhes: detalhes,
          valorInicial: valorInicial,
          prazoMeses: prazoMeses,
          chartData: chartData // ⬅️ Retorna os dados do gráfico
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

    this.investmentService.simulateInvestment(requestPayload).subscribe({
      next: (result: SimulationResponse) => {
        
        // 4. Realiza o cálculo no frontend usando Juros Simples e gera os dados do gráfico
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