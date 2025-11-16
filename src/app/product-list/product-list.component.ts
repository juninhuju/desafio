import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, MatCardModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'] // crie este arquivo ou remova
})
export class ProductListComponent {
  @Input() riskProfile: string = ''; // ✅ adiciona o input

  produtos = [
    { tipo: 'CDB', nome: 'Certificado de Depósito Bancário', preco: 1000.5 },
    { tipo: 'LCI', nome: 'Letra de Crédito Imobiliário', preco: 2500 },
    { tipo: 'Tesouro', nome: 'Tesouro Direto', preco: 5000.75 }
  ];

  simulateInvestment(produto: any) {
    console.log('Simulando investimento:', produto, 'Perfil:', this.riskProfile);
    // Aqui você pode chamar o InvestmentService
  }
}
