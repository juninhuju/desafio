// src/app/components/risk-profile/risk-profile.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilRiscoService } from '../../services/perfil-risco.service';
import { RiskProfile } from '../../models/profile.model'; 

@Component({
  selector: 'app-risk-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss'],
})
export class RiskProfileComponent implements OnInit {

  private perfilRiscoService = inject(PerfilRiscoService);

  public perfil: RiskProfile | null = null;

  private readonly CLIENTE_ID = 123;

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.perfilRiscoService.getPerfilRisco(this.CLIENTE_ID).subscribe({
      next: (data: RiskProfile) => {
        this.perfil = data;
      },
      error: (err) => {
        console.error('Erro ao buscar o perfil de risco:', err);
      }
    });
  }

  get imagemPerfilPath(): string {
    if (!this.perfil) {
      return '';
    }

    const nomePerfil = this.perfil.perfil.toLowerCase().trim();

    switch (nomePerfil) {
      case 'moderado':
        return '/moderado.png';
      case 'arrojado':
      case 'agressivo':
        return '/agressivo.png';
      case 'conservador':
        return '/conservador.png';
      default:
        return '/default.png';
    }
  }
}
