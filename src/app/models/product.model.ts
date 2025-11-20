export interface RecommendedProduct {
  id: number;
  perfil: string;
  nome: string;  
  tipo: string;  
  rentabilidade: number; 
  risco: 'Baixo' | 'Médio' | 'Alto';
}