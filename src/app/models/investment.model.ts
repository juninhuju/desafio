// Corresponde a um item de investimento dentro do GET /investimentos/{clienteld} [cite: 56]
export interface InvestmentHistoryItem {
  id: number; 
  tipo: string; // Ex: "CDB" ou "Fundo Multimercado" [cite: 63, 69]
  valor: number; // Ex: 5000 [cite: 64, 70]
  rentabilidade: number; // Taxa como decimal (Ex: 0.12 para 12%) [cite: 65, 71]
  data: string; // Data da aplicação (Ex: "2025-01-15") [cite: 66, 72]
}