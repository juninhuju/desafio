// src/app/models/simulation.model.ts

/**
 * Interface para os dados enviados na requisição POST /simular-investimento.
 */
export interface SimulationRequest {
    valor: number;
    prazoMeses: number;
    tipo: string; // Ex: "CDB", "LCI", "Tesouro Direto"
}

/**
 * Interface para a resposta esperada da API /simular-investimento.
 */
export interface SimulationResponse {
    valorFinal: number;
    rentabilidade: number; // Valor decimal (ex: 0.12 para 12%)
    detalhes: string;
}