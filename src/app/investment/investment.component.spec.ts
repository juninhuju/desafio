import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentComponent } from './investment.component'; // Importa a classe do componente
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

describe('InvestmentComponent', () => {
  let component: InvestmentComponent;
  let fixture: ComponentFixture<InvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importa o componente standalone e todas as suas dependências
      imports: [
        InvestmentComponent, 
        CommonModule, 
        MatCardModule, 
        MatButtonModule, 
        CurrencyPipe, 
        PercentPipe
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Chama o ngOnInit
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  // ------------------------------------------------------------------
  // TESTES DE INICIALIZAÇÃO (ngOnInit)
  // ------------------------------------------------------------------
  it('deve inicializar allProducts com a lista de dados mockados', () => {
    // Verifica se a lista mockada de 6 produtos foi carregada
    expect(component.allProducts.length).toBe(6); 
  });

  it('deve definir a aba inicial como "Conservador"', () => {
    // Verifica se a propriedade ativa foi definida corretamente
    expect(component.activeTab).toBe('Conservador'); 
  });

  it('deve inicializar currentProducts com produtos Conservadores', () => {
    // Verifica se o filtro inicial foi aplicado (2 produtos conservadores)
    expect(component.currentProducts.length).toBe(2);
    expect(component.currentProducts.every(p => p.tipoRisco === 'Conservador')).toBe(true);
  });
  
  // ------------------------------------------------------------------
  // TESTES DE LÓGICA (filterProducts)
  // ------------------------------------------------------------------
  it('deve filtrar para produtos Moderados corretamente', () => {
    component.filterProducts('Moderado');
    
    // Verifica a aba ativa
    expect(component.activeTab).toBe('Moderado');
    // Verifica a quantidade de produtos moderados
    expect(component.currentProducts.length).toBe(2); 
    // Verifica se todos são moderados
    expect(component.currentProducts.every(p => p.tipoRisco === 'Moderado')).toBe(true);
  });
  
  it('deve filtrar para produtos Agressivos corretamente', () => {
    component.filterProducts('Agressivo');
    
    expect(component.activeTab).toBe('Agressivo');
    expect(component.currentProducts.length).toBe(2);
    expect(component.currentProducts.every(p => p.tipoRisco === 'Agressivo')).toBe(true);
  });

  // ------------------------------------------------------------------
  // TESTE DE INTERAÇÃO (simulate)
  // ------------------------------------------------------------------
  it('deve logar a simulação no console quando simulate for chamado', () => {
    // Spy para monitorar o console.log
    const logSpy = jest.spyOn(console, 'log');
    
    const productName = 'Fundo Multimercado';
    component.simulate(productName);
    
    // Verifica se o método de simulação foi chamado e logou a mensagem esperada
    expect(logSpy).toHaveBeenCalledWith(`Simulação iniciada para: ${productName}.`);
  });
});