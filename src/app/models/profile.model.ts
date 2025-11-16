// Corresponde à resposta do GET /perfil-risco/{clienteld} [cite: 47]
export interface RiskProfile {
  clienteld: number; 
  perfil: 'Conservador' | 'Moderado' | 'Agressivo'; // Ex: "Moderado" [cite: 53, 25]
  descricao: string; // Ex: "Perfil equilibrado entre segurança e rentabilidade." [cite: 54, 26]
  pontuacao: number; // Ex: 65 [cite: 55]
}