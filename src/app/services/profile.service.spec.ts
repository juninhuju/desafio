import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { RiskProfile } from '../models/profile.model';
import { Investimento } from '../models/investment.model';
import { RecommendedProduct } from '../models/product.model';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  let mockAuthService: any;

  const MOCK_CLIENT_ID = 123;
  const API_BASE = 'http://localhost:3000/api/v1'; 

  const mockProfile: RiskProfile = { clienteId: MOCK_CLIENT_ID, perfil: 'Moderado', descricao: 'Perfil equilibrado.', pontuacao: 65 };
  const mockHistory: Investimento[] = [
    { id: 1, clienteId: MOCK_CLIENT_ID, tipo: 'CDB', valor: 5000, rentabilidade: 0.12, data: '2025-01-15' },
    { id: 2, clienteId: MOCK_CLIENT_ID, tipo: 'Fundo', valor: 3000, rentabilidade: 0.08, data: '2025-03-10' }
  ];
  const mockProducts: RecommendedProduct[] = [
    { id: 101, perfil: 'Moderado', nome: 'CDB Caixa 2026', tipo: 'CDB', rentabilidade: 0.12, risco: 'Baixo' },
    { id: 102, perfil: 'Moderado', nome: 'Fundo Agressivo XPTO', tipo: 'Fundo', rentabilidade: 0.18, risco: 'Alto' }
  ];

  beforeEach(() => {
    mockAuthService = {
      getClientId: jest.fn().mockReturnValue(MOCK_CLIENT_ID)
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProfileService,
        { provide: AuthService, useValue: mockAuthService }
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

  it('deve buscar o perfil de risco com o clientId correto', (done) => {
    service.getRiskProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
      done();
    });

    const req = httpMock.expectOne(`${API_BASE}/perfil-risco?id=${MOCK_CLIENT_ID}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockProfile]);
  });

  it('deve buscar o histórico de investimentos', (done) => {
    service.getInvestmentHistory().subscribe(history => {
      expect(history.length).toBe(2);
      expect(history).toEqual(mockHistory);
      done();
    });

    const req = httpMock.expectOne(`${API_BASE}/investimentos?clienteId=${MOCK_CLIENT_ID}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });

  it('deve buscar produtos recomendados com base no perfil', (done) => {
    const perfil = 'Moderado';

    service.getRecommendedProducts(perfil).subscribe(products => {
      expect(products).toEqual(mockProducts);
      done();
    });

    const req = httpMock.expectOne(`${API_BASE}/produtos-recomendados?perfil=${perfil}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('deve lançar erro se o clientID não for encontrado (usuário deslogado)', () => {
    mockAuthService.getClientId.mockReturnValue(null);
    const errorMessage = 'Client ID não encontrado. Usuário não autenticado.';

    (expect(() => service.getRiskProfile()) as any).toThrowError(errorMessage);
    (expect(() => service.getInvestmentHistory()) as any).toThrowError(errorMessage);
  });
});
