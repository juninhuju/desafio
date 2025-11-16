import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { InvestmentService } from '../services/investment.service';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

type RiskType = 'Conservador' | 'Moderado' | 'Agressivo';

// Tipos para o gráfico
interface ChartSeries {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  series: ChartSeries[];
}

interface Product {
  id: number;
  nome: string;
  descricao: string;
  tipoRisco: RiskType;
  rentabilidade: number; // ✅ numérico (fração, ex.: 0.12 -> 12%)

  // Campos de simulação
  simulationValue: number;
  simulationTermMonths: number;
  simulationLoading: boolean;
  simulationResult: SimulationResponse | null;
  simulationChartData: ChartData[];
}

@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    NgxChartsModule,
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent {
  simulate(productName: string) {
    throw new Error('Method not implemented.');
  }
  // Aba ativa
  activeTab: RiskType = 'Conservador';

  // Catálogo base com rentabilidade numérica
  allProducts: Product[] = [
    {
      id: 1,
      nome: 'CDB Pós 100% do CDI',
      descricao: 'Liquidez diária, ideal para reserva de emergência.',
      tipoRisco: 'Conservador',
      rentabilidade: 0.12, // 12% a.a
      simulationValue: 1000,
      simulationTermMonths: 12,
      simulationLoading: false,
      simulationResult: null,
      simulationChartData: []
    },
    {
      id: 2,
      nome: 'LCI 9,5% a.a (isenta IR)',
      descricao: 'Letra de Crédito Imobiliário com isenção de IR.',
      tipoRisco: 'Moderado',
      rentabilidade: 0.095, // 9,5% a.a
      simulationValue: 2000,
      simulationTermMonths: 12,
      simulationLoading: false,
      simulationResult: null,
      simulationChartData: []
    },
    {
      id: 3,
      nome: 'Tesouro IPCA+ 25% (exemplo educacional)',
      descricao: 'Proteção contra inflação com rentabilidade real.',
      tipoRisco: 'Agressivo',
      rentabilidade: 0.25, // 25% a.a
      simulationValue: 1500,
      simulationTermMonths: 12,
      simulationLoading: false,
      simulationResult: null,
      simulationChartData: []
    }
  ];

  // Lista corrente para a aba selecionada
  currentProducts: Product[] = this.allProducts.filter(p => p.tipoRisco === this.activeTab);

  constructor(private investmentService: InvestmentService) {}

  // Filtro pelas abas
  filterProducts(tab: RiskType): void {
    this.activeTab = tab;
    this.currentProducts = this.allProducts.filter(p => p.tipoRisco === tab);
  }

  // ✅ Simulação para um produto
  simulateInvestment(product: Product): void {
    if (product.simulationLoading) return;

    product.simulationLoading = true;
    product.simulationResult = null;
    product.simulationChartData = [];

    // Monta request
    const request: SimulationRequest = {
      valor: product.simulationValue,
      prazoMeses: product.simulationTermMonths,
      tipo: this.mapTipoFromNome(product.nome)
    };

    this.investmentService.simulateInvestment(request).subscribe({
      next: (response) => {
        product.simulationResult = response;

        // Constrói dados para o gráfico no formato correto
        const steps = 6;
        const base = product.simulationValue;
        
        // CORREÇÃO: Garante que valorFinal é um número. Se for NaN ou inválido, 
        // usa o valor inicial (base) como fallback para evitar "NaN" no cálculo.
        const valorFinalAPI = Number(response.valorFinal);
        const final = !isNaN(valorFinalAPI) && valorFinalAPI >= base 
            ? valorFinalAPI 
            : base; // Fallback para o valor inicial
        
        const increment = (final - base) / steps;

        product.simulationChartData = [
          {
            name: 'Simulação',
            series: Array.from({ length: steps + 1 }, (_, i) => ({
              name: `M${i}`,
              // O Number() é mantido para garantir que o valor final do cálculo seja numérico
              value: Math.max(0, Number((base + increment * i).toFixed(2)))
            }))
          }
        ];
      },
      error: (err) => {
        console.error('Erro na simulação:', err);
      },
      complete: () => {
        product.simulationLoading = false;
      }
    });
  }

  // Mapeia nome do produto para tipo esperado pelo backend
  private mapTipoFromNome(nome: string): 'CDB' | 'LCI' | 'Tesouro' {
    const n = nome.toLowerCase();
    if (n.includes('cdb')) return 'CDB';
    if (n.includes('lci')) return 'LCI';
    return 'Tesouro';
  }
}