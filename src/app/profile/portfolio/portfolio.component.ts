import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service'; 
import { Investimento } from '../../models/portfolio.model';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts'; // ✅ importar ScaleType
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [NgxChartsModule, CommonModule]
})
export class PortfolioComponent implements OnInit {
  investimentos: Investimento[] = [];
  chartData: any[] = [];
  totalCarteira: number = 0;

  view: [number, number] = [500, 300];

  // ✅ esquema de cores corrigido
  scheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal, // ✅ usar enum correto
    domain: [
      '#5AA454', // verde
      '#A10A28', // vermelho
      '#C7B42C', // amarelo
      '#AAAAAA', // cinza
      '#1F77B4', // azul
      '#FF7F0E', // laranja
      '#2CA02C', // verde claro
      '#D62728'  // vermelho escuro
    ]
  };

  gradient = false;
  tooltipDisabled = false;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.getPortfolioDoCliente(123).subscribe({
      next: (dados) => {
        this.investimentos = dados;
        this.atualizarChartData();
      },
      error: (err) => console.error('Erro ao buscar carteira', err)
    });
  }

  atualizarChartData(): void {
    this.totalCarteira = this.investimentos.reduce((acc, inv) => acc + inv.valor, 0);
    this.chartData = this.investimentos.map(inv => ({
      name: inv.tipo,
      value: inv.valor
    }));
  }

  getPercentual(valor: number | undefined): string {
    if (!valor || this.totalCarteira === 0) return '0%';
    return ((valor / this.totalCarteira) * 100).toFixed(1) + '%';
  }

  onSelect(event: any): void {
    console.log('Selecionado:', event);
  }
}
