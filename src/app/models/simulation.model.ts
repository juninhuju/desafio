export interface SimulationRequest {
  valor: number;        // Valor inicial investido
  prazoMeses: number;   // Prazo em meses
  tipo: string;         // Tipo de investimento (CDB, LCI, Tesouro, etc.)
}

export interface SimulationResponse {
  valorFinal: number;   // Valor final após simulação
  rentabilidade: number; // Rentabilidade anual
  detalhes: string;     // Texto explicativo da simulação
}
