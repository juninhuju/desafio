import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { InvestmentService } from './investment.service';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let httpMock: HttpTestingController;

  const API_BASE = 'http://localhost:3000/api/v1';
  const SIMULATOR_URL = `${API_BASE}/simular-investimento`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [InvestmentService]
    });

    service = TestBed.inject(InvestmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  // ------------------------------------------------------------------
  // TESTE 1: Simulação de CDB
  // ------------------------------------------------------------------
  it('deve simular CDB corretamente', (done) => {
    const mockRequest: SimulationRequest = { valor: 10000, prazoMeses: 12, tipo: 'CDB' };
    const mockResponse: SimulationResponse = { valorFinal: 11200, rentabilidade: 0.12, detalhes: 'Simulação baseada em CDB com taxa de 12% ao ano.' };

    service.simulateInvestment(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(SIMULATOR_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  // ------------------------------------------------------------------
  // TESTE 2: Simulação de LCI
  // ------------------------------------------------------------------
  it('deve simular LCI corretamente', (done) => {
    const mockRequest: SimulationRequest = { valor: 10000, prazoMeses: 12, tipo: 'LCI' };
    const mockResponse: SimulationResponse = { valorFinal: 10900, rentabilidade: 0.09, detalhes: 'Simulação baseada em LCI com taxa líquida de 9% ao ano.' };

    service.simulateInvestment(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(SIMULATOR_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  // ------------------------------------------------------------------
  // TESTE 3: Simulação de Tesouro Direto
  // ------------------------------------------------------------------
  it('deve simular Tesouro Direto corretamente', (done) => {
    const mockRequest: SimulationRequest = { valor: 10000, prazoMeses: 12, tipo: 'Tesouro' };
    const mockResponse: SimulationResponse = { valorFinal: 11500, rentabilidade: 0.15, detalhes: 'Simulação baseada em Tesouro Direto com taxa de 15% ao ano.' };

    service.simulateInvestment(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(SIMULATOR_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  // ------------------------------------------------------------------
  // TESTE 4: Erro na simulação
  // ------------------------------------------------------------------
  it('deve lidar com erro ao simular investimento', (done) => {
    const mockRequest: SimulationRequest = { valor: 10000, prazoMeses: 12, tipo: 'CDB' };
    const errorMsg = 'Erro interno do servidor';

    service.simulateInvestment(mockRequest).subscribe({
      next: () => fail('Deveria ter falhado com erro 500'),
      error: (error: any) => {
        expect(error.status).toEqual(500);
        done();
      }
    });

    const req = httpMock.expectOne(SIMULATOR_URL);
    expect(req.request.method).toBe('POST');
    req.flush(null, { status: 500, statusText: errorMsg });
  });
});
