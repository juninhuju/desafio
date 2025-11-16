import { Component, Input } from '@angular/core'; // Adicionado Input
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select'; // Adicionado para melhor UX
import { InvestmentService } from '../services/investment.service';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';
import { Observable, switchMap, of, catchError } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-investment-simulator',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    MatFormFieldModule,
    MatSelectModule, // Novo Import
    CurrencyPipe,
    NgxChartsModule,
    MatDividerModule
  ],
  templateUrl: './investment-simulator.component.html',
  styleUrls: ['./investment-simulator.component.scss']
})
export class InvestmentSimulatorComponent { 
  
  // O DashboardComponent passa o produto recomendado (usado para preencher 'tipo')
  @Input() 
  set initialData(product: any) {
    if (product && product.tipo) {
      this.simulationForm.patchValue({ tipo: product.tipo });
    }
  }

  simulationForm: FormGroup;
  simulationResult$!: Observable<SimulationResponse | null>;
  isLoading = false;
  error: string | null = null;
  
  // Lista mockada de tipos de investimento para o Select
  investmentTypes = ['CDB', 'LCI', 'LCA', 'Tesouro Direto', 'Fundo Multimercado'];

  lineChartData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private investmentService: InvestmentService
  ) {
    this.simulationForm = this.fb.group({
      valor: [10000, [Validators.required, Validators.min(100)]],
      prazoMeses: [12, [Validators.required, Validators.min(1)]],
      tipo: ['CDB', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.simulationForm.invalid) {
      this.error = 'Por favor, preencha o formulário corretamente.';
      return;
    }

    // 1. Limpa erros e inicia carregamento
    this.isLoading = true;
    this.error = null;
    const request: SimulationRequest = this.simulationForm.value;

    // 2. Única chamada de API (Fluxo Corrigido)
    this.simulationResult$ = this.investmentService.simulateInvestment(request).pipe(
      switchMap(response => {
        this.isLoading = false;
        // Processa os dados para o Gráfico de Linha APÓS o sucesso da API
        this.lineChartData = this.mapSimulationToLineChart(response); 
        return of(response);
      }),
      catchError(err => {
        this.isLoading = false;
        this.error = 'Erro ao simular. Verifique os dados ou a conexão da API.';
        this.lineChartData = []; // Limpa o gráfico em caso de erro
        console.error(err);
        return of(null);
      })
    );
  }
  
  /**
   * Mapeia o resultado da simulação para o formato Line Chart do ngx-charts
   * (Esta função estava duplicada e foi mantida apenas na forma 'private' correta)
   */
  private mapSimulationToLineChart(result: SimulationResponse): any[] {
    // Busca o valor inicial do formulário no momento da simulação
    const initialInvestment = this.simulationForm.value.valor;
    const periodMonths = this.simulationForm.value.prazoMeses;

    // Calcula o retorno mensal médio para simular a curva
    const totalReturnAmount = result.valorFinal - initialInvestment;
    const monthlyReturn = totalReturnAmount / periodMonths;
    let accumulatedValue = initialInvestment;

    const series = [];
    
    // Adiciona o mês zero (investimento inicial)
    series.push({ name: 'Mês 0', value: initialInvestment });

    // Simula a evolução mês a mês
    for (let i = 1; i <= periodMonths; i++) {
        accumulatedValue += monthlyReturn;
        series.push({ name: `Mês ${i}`, value: accumulatedValue });
    }

    return [{
      name: 'Evolução do Investimento',
      series: series
    }];
  }
}