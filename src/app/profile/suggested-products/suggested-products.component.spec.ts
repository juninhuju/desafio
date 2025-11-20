import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestedProductsComponent } from './suggested-products.component';
import { InvestmentService } from '../../services/investment.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RecommendedProduct } from '../../models/product.model';

const mockInvestmentService = {
  simulateInvestment: jest.fn()
};

// Mock do AuthService
const mockAuthService = {
  getClientId: jest.fn(() => 'client-123'),
  getRiskProfile: jest.fn(() => of({ perfil: 'Agressivo' })),
  getRecommendedProducts: jest.fn(() =>
    of([
      { nome: 'CDB Teste', tipo: 'CDB', risco: 'Baixo', rentabilidade: 0.12 } as RecommendedProduct
    ])
  ),
};

describe('SuggestedProductsComponent', () => {
  let component: SuggestedProductsComponent;
  let fixture: ComponentFixture<SuggestedProductsComponent>;
  let investmentService: InvestmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedProductsComponent],
      providers: [
        { provide: InvestmentService, useValue: mockInvestmentService },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestedProductsComponent);
    component = fixture.componentInstance;
    investmentService = TestBed.inject(InvestmentService);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call simulateInvestment on service and set resultadoSimulador on success', () => {
    const mockResult = { valorFinal: 11200, rentabilidade: 0.12, detalhes: 'Simulação OK.' };

    (investmentService.simulateInvestment as jest.Mock).mockReturnValue(of(mockResult));

    component.simulador = { valor: 10000, prazoMeses: 12, tipo: 'CDB' };

    component.simularInvestimento();

    expect(investmentService.simulateInvestment).toHaveBeenCalledWith({
      valor: 10000,
      prazoMeses: 12,
      tipo: 'CDB'
    });
    expect(component.resultadoSimulador).toEqual(mockResult);
  });

  it('should handle error when simularInvestimento fails', () => {
    (investmentService.simulateInvestment as jest.Mock).mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    jest.spyOn(console, 'error').mockImplementation(() => {});

    component.simulador = { valor: 10000, prazoMeses: 12, tipo: 'CDB' };
    component.simularInvestimento();

    expect(investmentService.simulateInvestment).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(component.resultadoSimulador).toBeUndefined();
  });


  it('should call simulateInvestment for a product and set simulatedResult', () => {
    const mockProduct = { nome: 'CDB Mock', tipo: 'CDB', risco: 'Baixo', rentabilidade: 0.12, valorInput: 5000, prazoInput: 6 } as any;
    const mockResult = { valorFinal: 5600, rentabilidade: 0.12, detalhes: 'Simulação Produto OK.' };

    (investmentService.simulateInvestment as jest.Mock).mockReturnValue(of(mockResult));

    component.simulate(mockProduct);

    expect(investmentService.simulateInvestment).toHaveBeenCalledWith({
      valor: 5000,
      prazoMeses: 6,
      tipo: 'CDB'
    });
    expect(mockProduct.simulatedResult).toEqual(mockResult);
  });

  it('should handle error when simulate(product) fails', () => {
    const mockProduct = { nome: 'CDB Mock', tipo: 'CDB', risco: 'Baixo', rentabilidade: 0.12, valorInput: 5000, prazoInput: 6 } as any;

    (investmentService.simulateInvestment as jest.Mock).mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    jest.spyOn(console, 'error').mockImplementation(() => {});

    component.simulate(mockProduct);

    expect(investmentService.simulateInvestment).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(mockProduct.simulatedResult).toBeUndefined();
  });
});
