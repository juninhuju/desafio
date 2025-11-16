export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  clientId: number; // ✅ Corrigido de clienteld para clientId
}
