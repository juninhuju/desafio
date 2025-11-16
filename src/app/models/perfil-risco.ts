// src/app/models/perfil-risco.ts

export interface PerfilRisco {
  clienteId: number;
  perfil: 'Conservador' | 'Moderado' | 'Arrojado'; // Use tipos literais para perfis conhecidos
  descricao: string;
  pontuacao: number;
}