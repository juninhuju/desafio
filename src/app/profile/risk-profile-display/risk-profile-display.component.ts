// src/app/shared/risk-profile-display/risk-profile-display.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProfileDetail {
  title: string;
  description: string;
  imageSrc: string; // Caminho simulado para a imagem (ex: 'assets/images/conservative.jpg')
}

@Component({
  selector: 'app-risk-profile-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-profile-display.component.html',
  styleUrls: ['./risk-profile-display.component.scss']
})
export class RiskProfileDisplayComponent {
  
  // Dados dos três perfis de risco
  profiles: ProfileDetail[] = [
    {
      title: 'Conservador',
      description: 'Prioriza a segurança e a liquidez do patrimônio. Aceita retornos menores em troca de pouca ou nenhuma exposição a riscos de mercado. Foco em renda fixa e proteção.',
      imageSrc: 'conservador.png' 
      // NOTA: Troque pelos caminhos reais das suas imagens.
    },
    {
      title: 'Moderado',
      description: 'Busca o equilíbrio entre segurança e rentabilidade. Está disposto a correr um risco médio para obter retornos acima da inflação, alocando parte do capital em ativos de renda variável.',
      imageSrc: 'moderado.png'
    },
    {
      title: 'Agressivo',
      description: 'Visa alta rentabilidade, mesmo que isso implique alta volatilidade e risco de perda de capital no curto prazo. Maior alocação em ações, fundos de risco e investimentos internacionais.',
      imageSrc: 'agressivo.png'
    }
  ];
}