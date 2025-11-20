import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service'; 
import { Investimento } from '../../models/portfolio.model';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts'; 
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
  chartData: { name: string; value: number }[] = [];
  totalCarteira = 0;

  view: [number, number] = [500, 300];

  scheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA',
      '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728'
    ]
  };

  gradient = false;
  tooltipDisabled = false;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.carregarCarteira();
  }

  private carregarCarteira(): void {
    this.portfolioService.getPortfolioDoCliente(123).subscribe({
      next: (dados) => {
        this.investimentos = dados;
        this.atualizarChartData();
      },
      error: (err) => {
        console.error('Erro ao buscar carteira:', err);
      }
    });
  }

  private atualizarChartData(): void {
    this.totalCarteira = this.investimentos.reduce((acc, inv) => acc + inv.valor, 0);
    this.chartData = this.investimentos.map(inv => ({
      name: inv.tipo,
      value: inv.valor
    }));
  }

  getPercentual(valor?: number): string {
    if (!valor || this.totalCarteira === 0) return '0%';
    return ((valor / this.totalCarteira) * 100).toFixed(1) + '%';
  }

  onSelect(event: { name: string; value: number }): void {
    console.log('Selecionado:', event);
  }
}
