import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RiskProfile } from '../../models/profile.model';
import { InvestmentHistoryItem } from '../../models/investment.model';
import { Router } from '@angular/router'; // NOVO: Importa o Router

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: any;
  let mockProfileService: any;
  let mockRouter: any; // NOVO: Referência para o mock do Router

  const mockProfile: RiskProfile = { clienteld: 123, perfil: 'Moderado', descricao: 'Teste', pontuacao: 65 };
  const mockHistory: InvestmentHistoryItem[] = [
    { id: 1, tipo: 'CDB', valor: 5000, rentabilidade: 0.12, data: '2025-01-15' },
    { id: 2, tipo: 'Fundo', valor: 3000, rentabilidade: 0.08, data: '2025-03-10' },
    { id: 3, tipo: 'CDB', valor: 2000, rentabilidade: 0.10, data: '2025-05-20' }
  ];

  beforeEach(async () => {
    // 1. Mock do ProfileService
    mockProfileService = {
      getRiskProfile: jest.fn().mockReturnValue(of(mockProfile)),
      getInvestmentHistory: jest.fn().mockReturnValue(of(mockHistory))
    };
    
    // 2. Mock do AuthService
    mockAuthService = {
      logout: jest.fn(),
      getClientId: jest.fn().mockReturnValue(123)
    };

    // 3. Mock do Router (necessário mesmo que não seja usado diretamente no Dashboard)
    mockRouter = { navigate: jest.fn() }; 

    await TestBed.configureTestingModule({
      // REMOÇÃO: RouterTestingModule foi removido
      imports: [DashboardComponent], 
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter } // ADICIONADO: Mock explícito do Router
      ],
      // Ignora sub-componentes (ProductListComponent, InvestmentSimulatorComponent, ngx-charts)
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Chama ngOnInit
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
  
  it('deve chamar os serviços na inicialização (ngOnInit)', () => {
    expect(mockProfileService.getRiskProfile).toHaveBeenCalled();
    expect(mockProfileService.getInvestmentHistory).toHaveBeenCalled();
  });
  
  it('deve preencher profile$ e history$ com dados retornados', (done) => {
    component.profile$.subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });
    component.history$.subscribe(history => {
      expect(history.length).toBe(3);
      done();
    });
  });

  it('deve mapear o histórico para os dados de distribuição do gráfico', () => {
    // O mapeamento ocorre no ngOnInit (após o subscribe do history$)
    fixture.detectChanges(); 
    
    expect(component.investmentDistribution.length).toBe(2);
    expect(component.investmentDistribution).toEqual([
      { name: 'CDB', value: 7000 }, // 5000 + 2000
      { name: 'Fundo', value: 3000 }
    ]);
  });
  
  it('deve chamar AuthService.logout quando logout() for chamado', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    // O redirecionamento após o logout é tratado pelo AuthGuard, não pelo DashboardComponent
  });
  
  it('deve abrir o simulador e definir o produto selecionado quando openSimulator for chamado', () => {
    const product = { id: 101, tipo: 'CDB' };
    component.openSimulator(product);
    
    expect(component.isSimulatorOpen).toBe(true);
    expect(component.selectedProduct).toEqual(product);
  });

  it('deve fechar o simulador e limpar o produto selecionado quando closeSimulator for chamado', () => {
    component.isSimulatorOpen = true;
    component.selectedProduct = { id: 101, tipo: 'CDB' };
    
    component.closeSimulator();
    
    expect(component.isSimulatorOpen).toBe(false);
    expect(component.selectedProduct).toBeNull();
  });
});