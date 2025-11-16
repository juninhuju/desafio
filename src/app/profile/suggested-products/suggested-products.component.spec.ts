import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestedProductsComponent } from './suggested-products.component';
import { InvestmentService } from '../../services/investment.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RecommendedProduct } from '../../models/product.model';

// Mock do InvestmentService para isolar a chamada HTTP
const mockInvestmentService = {
  simulateInvestment: jest.fn()
};

// Mock do AuthService (para o setup inicial do ngOnInit)
const mockAuthService = {
    getClientId: jest.fn(() => 'client-123'),
    getRiskProfile: jest.fn(() => of({ perfil: 'Agressivo' })),
    getRecommendedProducts: jest.fn(() => of([
        { nome: 'CDB Teste', tipo: 'CDB', risco: 'Baixo', rentabilidade: 0.13 } as RecommendedProduct
    ])),
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
        })
        .compileComponents();

        fixture = TestBed.createComponent(SuggestedProductsComponent);
        component = fixture.componentInstance;
        investmentService = TestBed.inject(InvestmentService);
        // Garante que o ngOnInit execute antes dos testes
        fixture.detectChanges(); 
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ----------------------------------------------------------------------
    // NOVO TESTE PARA A FUNÇÃO simulateInvestment
    // ----------------------------------------------------------------------
    
    it('should call simulateInvestment on service and display result on success', () => {
        // Arrange
        const mockProduct = { nome: 'CDB Mock', tipo: 'CDB', risco: 'Baixo', rentabilidade: 0.13 } as RecommendedProduct;
        const mockResult = { valorFinal: 11200, rentabilidade: 0.12, detalhes: 'Simulação OK.' };
        
        // Simula o retorno de sucesso do service
        (investmentService.simulateInvestment as jest.Mock).mockReturnValue(of(mockResult));
        
        // Spy no alert (já que a função displaySimulationResult usa alert)
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        // Act
        component.simulateInvestment(mockProduct);

        // Assert
        // Verifica se o service foi chamado com o payload correto
        expect(investmentService.simulateInvestment).toHaveBeenCalledWith({
            valor: 10000,
            prazoMeses: 12,
            tipo: 'CDB'
        });
        
        // Verifica se a função de exibir resultado (alert) foi chamada
        expect(window.alert).toHaveBeenCalled();
    });

    it('should show an error alert when simulateInvestment fails', () => {
        // Arrange
        const mockProduct = { nome: 'CDB Mock', tipo: 'CDB', risco: 'Baixo', rentabilidade: 0.13 } as RecommendedProduct;
        
        // Simula o retorno de erro do service
        (investmentService.simulateInvestment as jest.Mock).mockReturnValue(
            throwError(() => new Error('API Error'))
        );
        
        // Spy no console.error e no alert
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        // Act
        component.simulateInvestment(mockProduct);

        // Assert
        // Verifica se o service foi chamado
        expect(investmentService.simulateInvestment).toHaveBeenCalled();
        // Verifica se a mensagem de erro foi exibida
        expect(window.alert).toHaveBeenCalledWith(
            expect.stringContaining('Erro ao simular o investimento.')
        );
        // Verifica se o erro foi logado
        expect(console.error).toHaveBeenCalled();
    });
    // ----------------------------------------------------------------------

});