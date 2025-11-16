import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // Corrigido para MatCardModule

interface ProfileDefinition {
  key: 'conservador' | 'moderado' | 'agressivo';
  title: string;
  imagePath: string;
  definition: string;
}

@Component({
  selector: 'app-risk-profile',
  standalone: true,
  // Usa MatCardModule para garantir que MatCardTitle e MatCardContent funcionem
  imports: [CommonModule, MatButtonModule, MatCardModule], 
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements OnInit {
  
  profiles: ProfileDefinition[] = [];
  selectedProfile: ProfileDefinition | null = null;

  ngOnInit(): void {
    this.profiles = [
      {
        key: 'conservador',
        title: 'Conservador',
        imagePath: 'conservador.jpeg',
        definition: 'É o investidor que busca segurança em primeiro lugar e espera preservar o patrimônio que possui. Prefere correr os menores riscos possíveis e prioriza segurança e liquidez. É o perfil comum para iniciantes ou aqueles próximos da aposentadoria.',
      },
      {
        key: 'moderado',
        title: 'Moderado',
        imagePath: 'moderado.jpeg',
        definition: 'Este investidor busca equilibrar segurança, liquidez e rentabilidade. Ele aceita correr um nível médio de risco, estando disposto a se arriscar um pouco mais para buscar um potencial maior de ganhos, mas sem abrir mão de aplicações mais sólidas. Tende a diversificar sua carteira, balanceando risco e retorno.',
      },
      {
        key: 'agressivo',
        title: 'Agressivo',
        imagePath: 'agressivo.jpeg',
        definition: 'Também chamado de arrojado, este investidor possui maior tolerância ao risco e aceita potenciais perdas temporárias em busca dos maiores retornos. Direciona seus recursos para investimentos de maior volatilidade, com foco no crescimento expressivo no longo prazo. Geralmente, possui maior conhecimento do mercado.',
      },
    ];
    // Seleciona o primeiro perfil por padrão
    this.selectedProfile = this.profiles[0]; 
  }

  selectProfile(profile: ProfileDefinition): void {
    this.selectedProfile = profile;
  }
}