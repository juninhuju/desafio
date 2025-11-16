// Corresponde a um item na lista de produtos do GET /produtos-recomendados/{perfil}
export interface RecommendedProduct {
  id: number; 
  nome: string; // Ex: "CDB Caixa 2026"
  tipo: string; // Ex: "CDB" ou "Fundo"
  rentabilidade: number; // Taxa como decimal (Ex: 0.13 para 13%)
  risco: 'Baixo' | 'Médio' | 'Alto'; // Ex: "Baixo"
}