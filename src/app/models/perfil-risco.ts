export interface RiskProfile {
  clienteId: number;
  perfil: 'Conservador' | 'Moderado' | 'Arrojado';
  descricao: string;
  pontuacao: number;
}