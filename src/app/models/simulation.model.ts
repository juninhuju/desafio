export interface SimulationRequest {
  valor: number;
  prazoMeses: number;
  tipo: string; 
}

export interface SimulationResponse {
  valorFinal: number;
  rentabilidade: number; 
  detalhes: string;
}