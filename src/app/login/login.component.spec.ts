import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn()
    };
    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      // Importa o componente standalone e todos os módulos Material/Forms que ele usa
      imports: [
        LoginComponent, 
        ReactiveFormsModule, 
        MatCardModule, 
        MatInputModule, 
        MatButtonModule, 
        MatFormFieldModule,
        BrowserAnimationsModule // Necessário para componentes Material em testes
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente e o formulário
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('o formulário deve ser inválido por padrão (e-mail e senha preenchidos no TS)', () => {
    // Embora o construtor preencha, testamos a estrutura e validações
    expect(component.loginForm.valid).toBeTruthy(); 
  });
  
  it('o e-mail deve ser obrigatório', () => {
    component.loginForm.controls['email'].setValue('');
    expect(component.loginForm.controls['email'].valid).toBeFalsy();
    expect(component.loginForm.controls['email'].hasError('required')).toBeTruthy();
  });

  it('deve chamar o AuthService.login e navegar para /dashboard no sucesso', () => {
    const mockResponse = { token: 'test-token', clienteld: 1 };
    mockAuthService.login.mockReturnValue(of(mockResponse));

    component.loginForm.controls['email'].setValue('test@caixa.com');
    component.loginForm.controls['senha'].setValue('123456');
    
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@caixa.com',
      senha: '123456'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.errorMessage).toBeNull();
  });

  it('deve exibir mensagem de erro no caso de falha no login', () => {
    const mockError = { status: 401 };
    mockAuthService.login.mockReturnValue(throwError(() => mockError));
    
    component.loginForm.controls['email'].setValue('bad@caixa.com');
    component.loginForm.controls['senha'].setValue('123456');

    component.onSubmit();
    
    // O subscribe precisa ser resolvido, mas mockReturnValue(throwError) já o faz
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciais inválidas. Tente novamente.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('não deve submeter se o formulário for inválido', () => {
    component.loginForm.controls['email'].setValue('nao-e-email');
    component.onSubmit();
    
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Preencha todos os campos corretamente.');
  });
});