import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { RiskProfile } from '../models/profile.model';
import { InvestmentHistoryItem } from '../models/investment.model';
import { RecommendedProduct } from '../models/product.model';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  let mockAuthService: any;

  const MOCK_CLIENT_ID = 123;
  const API_BASE = 'http://localhost:3000/api/v1';

  const mockProfile: RiskProfile = { clienteld: MOCK_CLIENT_ID, perfil: 'Moderado', descricao: 'Perfil equilibrado.', pontuacao: 65 };
  const mockHistory: InvestmentHistoryItem[] = [
    { id: 1, tipo: 'CDB', valor: 5000, rentabilidade: 0.12, data: '2025-01-15' },
    { id: 2, tipo: 'Fundo', valor: 3000, rentabilidade: 0.08, data: '2025-03-10' }
  ];
  const mockProducts: RecommendedProduct[] = [
    { id: 101, nome: 'CDB Caixa 2026', tipo: 'CDB', rentabilidade: 0.13, risco: 'Baixo' },
    { id: 102, nome: 'Fundo Agressivo XPTO', tipo: 'Fundo', rentabilidade: 0.18, risco: 'Alto' }
  ];

  beforeEach(() => {
    // 1. Define o mock do AuthService e o spy no método getClientId
    mockAuthService = {
      getClientId: jest.fn().mockReturnValue(MOCK_CLIENT_ID)
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProfileService,
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  // ------------------------------------------------------------------
  // TESTE 1: GET /perfil-risco/{clienteld}
  // ------------------------------------------------------------------
  it('deve buscar o perfil de risco com o clienteld correto', (done) => {
    service.getRiskProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
      done();
    });

    const req = httpMock.expectOne(`${API_BASE}/perfil-risco/${MOCK_CLIENT_ID}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  // ------------------------------------------------------------------
  // TESTE 2: GET /investimentos/{clienteld}
  // ------------------------------------------------------------------
  it('deve buscar o histórico de investimentos', (done) => {
    service.getInvestmentHistory().subscribe(history => {
      expect(history.length).toBe(2);
      expect(history).toEqual(mockHistory);
      done();
    });

    const req = httpMock.expectOne(`${API_BASE}/investimentos/${MOCK_CLIENT_ID}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });

  // ------------------------------------------------------------------
  // TESTE 3: GET /produtos-recomendados/{perfil}
  // ------------------------------------------------------------------
  it('deve buscar produtos recomendados com base no perfil (em minúsculas)', (done) => {
    const perfil = 'Moderado'; // Simula a entrada com maiúscula
    const expectedUrl = 'moderado'; // Verifica se foi convertido para minúscula na URL

    service.getRecommendedProducts(perfil).subscribe(products => {
      expect(products).toEqual(mockProducts);
      done();
    });

    const req = httpMock.expectOne(`${API_BASE}/produtos-recomendados/${expectedUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  // ------------------------------------------------------------------
  // TESTE 4: Tratamento de erro (Cobertura da lógica de getClientUrlSegment)
  // ------------------------------------------------------------------
  it('deve lançar erro se o clientID não for encontrado (usuário deslogado)', () => {
    // Configura o mock do AuthService para retornar null
    mockAuthService.getClientId.mockReturnValue(null);

    const errorMessage = 'Client ID não encontrado. Usuário não autenticado.';

    // Utiliza 'as any' para forçar o TypeScript a aceitar o toThrowError em Observable
    (expect(() => service.getRiskProfile()) as any).toThrowError(errorMessage);
    (expect(() => service.getInvestmentHistory()) as any).toThrowError(errorMessage);
  });
});