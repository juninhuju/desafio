// Corresponde à resposta do GET /perfil-risco/{clienteld} [cite: 47]
export interface RiskProfile {
  clienteId: number; 
  perfil: string; 
  descricao: string; 
  pontuacao: number; 
}