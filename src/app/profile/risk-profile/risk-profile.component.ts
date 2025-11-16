// src/app/components/risk-profile/risk-profile.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar NgIf
import { PerfilRiscoService } from '../../services/perfil-risco.service';
import { PerfilRisco } from '../../models/perfil-risco';

@Component({
  selector: 'app-risk-profile',
  standalone: true,
  imports: [CommonModule], // Importe o CommonModule para usar diretivas como *ngIf
  template: `
    <div class="risk-profile-card">
      <h2>Seu Perfil de Investimento</h2>
      
      <div *ngIf="perfil; else loading">
        
        <p class="profile-name">{{ perfil.perfil }} ({{ perfil.pontuacao }} pts)</p>
        <p class="description">{{ perfil.descricao }} </p>
        
        <hr>
        <p class="client-info">ID do Cliente: #{{ perfil.clienteId }}</p>
      </div>

      <ng-template #loading>
        <p>Carregando perfil de risco...</p>
      </ng-template>

    </div>
  `,
  styles: [`
    .risk-profile-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px;
      max-width: 400px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .profile-name {
      font-size: 1.5em;
      font-weight: bold;
      color: #007bff; /* Cor primária */
    }
    .description {
      font-style: italic;
      color: #555;
    }
    .client-info {
      font-size: 0.8em;
      color: #999;
    }
  `]
})
export class RiskProfileComponent implements OnInit {

  // O serviço é injetado usando 'inject' (Angular 14+)
  private perfilRiscoService = inject(PerfilRiscoService);
  
  // Variável para armazenar os dados do perfil
  public perfil: PerfilRisco | null = null;
  
  // ID do cliente fixo para o mock. Em um projeto real, viria de um serviço de autenticação.
  private readonly CLIENTE_ID = 123; 

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.perfilRiscoService.getPerfilRisco(this.CLIENTE_ID).subscribe({
      next: (data) => {
        this.perfil = data; // Armazena os dados
      },
      error: (err) => {
        console.error('Erro ao buscar o perfil de risco:', err);
        // Implementar tratamento de erro na interface, se necessário
      }
    });
  }
}