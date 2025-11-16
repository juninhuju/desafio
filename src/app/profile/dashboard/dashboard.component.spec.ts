// src/app/profile/dashboard/dashboard.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; 

// Importações dos modelos, necessários para tipagem correta no mock
// (Assumindo que estas interfaces existem em seus respectivos paths)
import { RiskProfile } from '../../models/profile.model'; 
import { InvestmentHistoryItem } from '../../models/investment.model'; 


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: any;
  let mockProfileService: any;
  let mockRouter: any; 

  const mockProfile: RiskProfile = { clienteld: 123, perfil: 'Moderado', descricao: 'Teste', pontuacao: 65 };
  const mockHistory: InvestmentHistoryItem[] = [
    { id: 1, tipo: 'CDB', valor: 5000, rentabilidade: 0.12, data: '2025-01-15' },
    { id: 2, tipo: 'Fundo', valor: 3000, rentabilidade: 0.08, data: '2025-03-10' },
    { id: 3, tipo: 'CDB', valor: 2000, rentabilidade: 0.10, data: '2025-05-20' }
  ];

  beforeEach(async () => {
    // 1. Mock do ProfileService
    mockProfileService = {
      // Garantir que as funções retornam Observables válidos para o teste
      getRiskProfile: jest.fn().mockReturnValue(of(mockProfile)),
      getInvestmentHistory: jest.fn().mockReturnValue(of(mockHistory))
    };
    
    // 2. Mock do AuthService
    mockAuthService = {
      logout: jest.fn(),
      getClientId: jest.fn().mockReturnValue(123)
    };

    // 3. Mock do Router
    mockRouter = { navigate: jest.fn() }; 

    await TestBed.configureTestingModule({
      // Se DashboardComponent for Standalone
      imports: [DashboardComponent], 
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter } 
      ],
      // Ignora sub-componentes (PortfolioComponent, RiskProfileComponent, etc.)
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    
    // IMPORTANTE: Se as propriedades não existirem no .ts, 
    // defina-as aqui para satisfazer o TypeScript/Jest durante o teste.
    // Isso é necessário apenas se você não as tiver no .ts ainda, 
    // mas é melhor adicioná-las no DashboardComponent.ts
    if (!(component as any).profile$) (component as any).profile$ = of(mockProfile);
    if (!(component as any).history$) (component as any).history$ = of(mockHistory);
    if (!(component as any).investmentDistribution) (component as any).investmentDistribution = [];
    if (!(component as any).isSimulatorOpen) (component as any).isSimulatorOpen = false;
    if (!(component as any).selectedProduct) (component as any).selectedProduct = null;

    fixture.detectChanges(); // Chama ngOnInit (que inicia as chamadas do serviço)
  });

  // ----------------------------------------------------------------------------------
  // TESTES
  // ----------------------------------------------------------------------------------

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
  
  it('deve chamar os serviços na inicialização (ngOnInit)', () => {
    expect(mockAuthService.getClientId).toHaveBeenCalled();
    expect(mockProfileService.getRiskProfile).toHaveBeenCalledWith(123);
    expect(mockProfileService.getInvestmentHistory).toHaveBeenCalledWith(123);
  });
  
  it('deve preencher profile$ e history$ com dados retornados (usando subscribe)', (done) => {
    // Certifique-se de que o DashboardComponent.ts implementa profile$ e history$ como Observables!
    component.profile$.subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });
    component.history$.subscribe(history => {
      expect(history.length).toBe(3);
      done(); // Sinaliza que o teste assíncrono terminou
    });
  });

  it('deve mapear o histórico para os dados de distribuição do gráfico', () => {
    // Este teste depende de uma função de mapeamento dentro do DashboardComponent
    // A propriedade investmentDistribution é verificada
    expect(component.investmentDistribution.length).toBe(2);
    expect(component.investmentDistribution).toEqual([
      { name: 'CDB', value: 7000 }, 
      { name: 'Fundo', value: 3000 }
    ]);
  });
  
  it('deve fazer logout e navegar para /home', () => {
    component.logout();
    
    // Verifica que o serviço de autenticação foi chamado para limpar o estado
    expect(mockAuthService.logout).toHaveBeenCalled(); 
    
    // Verifica que o Router foi chamado para redirecionar o usuário
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']); 
  });
  
  it('deve abrir o simulador e definir o produto selecionado quando openSimulator for chamado', () => {
    const product = { id: 101, tipo: 'CDB' };
    component.openSimulator(product);
    
    expect(component.isSimulatorOpen).toBe(true);
    // Assumindo que selectedProduct é do tipo InvestmentHistoryItem ou similar:
    expect(component.selectedProduct).toEqual(product); 
  });

  it('deve fechar o simulador e limpar o produto selecionado quando closeSimulator for chamado', () => {
    // Setup inicial
    component.isSimulatorOpen = true;
    component.selectedProduct = { id: 101, tipo: 'CDB' };
    
    component.closeSimulator();
    
    expect(component.isSimulatorOpen).toBe(false);
    expect(component.selectedProduct).toBeNull();
  });
});