import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  nome: string;
  tipo: string;
  rentabilidade: number; 
  risco: string;
  perfil?: string;
}

interface SimulationResponse {
  valorFinal: number;
  rentabilidade: number;
  detalhes: string;
}

interface SimulationRequest {
  valor: number;
  prazoMeses: number;
  tipo: string;
}

interface SimulationResultWithChart extends SimulationResponse {
  chartData: any[];
}

interface ProductWithSimulation extends Product {
  valorInput?: number;
  prazoInput?: number;
  simulatedResult?: SimulationResultWithChart | null;
  isMismatched?: boolean;
  confirmedMismatch?: boolean;
}

@Component({
  selector: 'app-suggested-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './suggested-products.component.html',
  styleUrls: ['./suggested-products.component.scss']
})
export class SuggestedProductsComponent implements OnInit {
  private http = inject(HttpClient);
  private currencyPipe = inject(CurrencyPipe);

  readonly API_BASE = 'http://localhost:3000/api/v1';
  readonly CLIENT_ID = 123;

  userProfile: string = '';
  products: ProductWithSimulation[] = [];
  chartCustomColors: any[] = [{ name: 'Crescimento', value: '#004c98' }];

  simulador = {
    valor: 10000,
    prazoMeses: 12,
    tipo: 'CDB'
  };
  resultadoSimulador: SimulationResponse | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.http.get<any[]>(`${this.API_BASE}/perfil-risco?clienteId=${this.CLIENT_ID}`)
      .subscribe({
        next: (data) => {
          const profile = data[0];
          if (profile) {
            this.userProfile = profile.perfil;
            this.loadRecommendedProducts(profile.perfil);
          } else {
            alert('Perfil não encontrado para o cliente.');
          }
        },
        error: (err) => {
          console.error('Erro ao carregar perfil de risco:', err);
          alert('Não foi possível carregar o perfil do cliente.');
        }
      });
  }

  loadRecommendedProducts(perfil: string): void {
    this.http.get<Product[]>(`${this.API_BASE}/produtos-recomendados`)
      .subscribe({
        next: (products) => {
          const allowedRisks = this.getAllowedRisks(perfil);

          this.products = products.map(p => ({
            ...p,
            valorInput: 10000,
            prazoInput: 12,
            isMismatched: !allowedRisks.includes(p.risco),
            confirmedMismatch: false,
            simulatedResult: null
          }));
        },
        error: (err) => {
          console.error('Erro ao carregar produtos recomendados:', err);
          alert('Não foi possível carregar os produtos recomendados.');
        }
      });
  }

  private getAllowedRisks(perfil: string): string[] {
    return perfil === 'Conservador'
      ? ['Baixo']
      : perfil === 'Moderado'
      ? ['Baixo', 'Médio']
      : ['Baixo', 'Médio', 'Alto'];
  }

simularInvestimento(): void {
  this.http.get<SimulationResponse[]>(`${this.API_BASE}/simular-investimento`)
    .subscribe({
      next: (data) => {
        const resultado = data[0]; // pega o primeiro item do array
        this.resultadoSimulador = resultado;
      },
      error: (err) => {
        console.error('Erro ao carregar simulação do db.json:', err);
        alert('Não foi possível simular o investimento.');
      }
    });
}

  simulate(product: ProductWithSimulation): void {
    if (product.simulatedResult) {
      product.simulatedResult = null;
      product.confirmedMismatch = false;
      return;
    }

    if (!product.valorInput || !product.prazoInput || product.valorInput <= 0 || product.prazoInput <= 0) {
      alert('Preencha valor e prazo válidos.');
      return;
    }

    product.isMismatched = !this.getAllowedRisks(this.userProfile).includes(product.risco);
    if (product.isMismatched && !product.confirmedMismatch) return;

    const taxaAnual = product.rentabilidade; 
    const valor = product.valorInput!;
    const meses = product.prazoInput!;
    const detalhes = `Simulação baseada em ${product.tipo} com taxa de ${(taxaAnual * 100).toFixed(2)}% ao ano.`;

    const resp = this.composeSimulation(taxaAnual, valor, meses, product.tipo, detalhes);
    const chartData = this.generateChartDataEquivalente(valor, this.monthlyEquivalent(taxaAnual), meses);

    product.simulatedResult = {
      ...resp,
      chartData
    };
  }

  private findRateByTipo(tipo: string): number | null {
    const p = this.products.find(pr => pr.tipo.toLowerCase() === tipo.toLowerCase());
    return p ? p.rentabilidade : null;
  }

  private monthlyEquivalent(taxaAnual: number): number {
    return Math.pow(1 + taxaAnual, 1 / 12) - 1;
  }

  private composeSimulation(taxaAnual: number, valor: number, meses: number, tipo: string, detalhesOverride?: string): SimulationResponse {
    const rMensal = this.monthlyEquivalent(taxaAnual);
    const valorFinal = valor * Math.pow(1 + rMensal, meses);

    return {
      rentabilidade: taxaAnual,
      detalhes: detalhesOverride ?? `Simulação baseada em ${tipo} com taxa de ${(taxaAnual * 100).toFixed(2)}% a.a.`,
      valorFinal: Number(valorFinal.toFixed(2))
    };
  }

  private generateChartDataEquivalente(valorInicial: number, taxaMensalEq: number, meses: number): any[] {
    const series = [];
    for (let i = 0; i <= meses; i++) {
      const valor = valorInicial * Math.pow(1 + taxaMensalEq, i);
      const mes = new Date();
      mes.setMonth(mes.getMonth() - (meses - i));
      const nome = mes.toLocaleString('pt-BR', { month: 'short' }) + '/' + mes.getFullYear().toString().slice(2);
      series.push({ name: nome, value: Number(valor.toFixed(2)) });
    }
    return [{ name: 'Crescimento', series }];
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2') || '';
  }
}
