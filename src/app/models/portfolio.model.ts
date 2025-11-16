export interface Investimento {
  id: number;
  tipo: string;
  valor: number;
  rentabilidade: number;
  data: string; // Usaremos string no mock, mas em um projeto real seria ideal usar Date
}