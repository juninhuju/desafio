import jsonServer from 'json-server';
import { Request, Response } from 'express';

const server = jsonServer.create();
const router = jsonServer.router('db.json'); 
const middlewares = jsonServer.defaults(); 

// Define as rotas originais (enviadas pelo Angular) para referência no console
const LOGIN_PATH_ORIGINAL = '/api/v1/autenticacao/login';
const SIMULATION_PATH_ORIGINAL = '/api/v1/simular-investimento';


server.use(middlewares); // O middleware padrão deve vir primeiro (para body-parser, etc.)

// =========================================================================
// ✅ CORREÇÃO DE ORDEM: Colocamos as rotas customizadas ANTES da reescrita
//    e elas escutam o PATH ORIGINAL enviado pelo Angular.
// =========================================================================

// ROTA 1: LOGIN
// Intercepta a rota de login para autenticação (POST /api/v1/autenticacao/login)
server.post(LOGIN_PATH_ORIGINAL, (req: Request, res: Response): void => {
  // DEBUG: Confirma que o handler foi acessado
  console.log(`[AUTH] Tentativa de Login para: ${req.body.email}`);
  
  const { email, senha } = req.body;

  if (email === 'example@mail.com' && senha === '123456') {
    console.log('[AUTH] Sucesso. Retornando 200.');
    // Retorno de SUCESSO 200 OK
    const responseBody = {
      token: 'jwt.mock.token.' + btoa(email), // Token simulado
      userId: 'user-' + email.split('@')[0],
      nome: 'Usuário Caixa',
    };
    res.status(200).json(responseBody);
    return;
  } else {
    console.log('[AUTH] Falha. Retornando 401.');
    // Retorno de FALHA 401 Unauthorized (Não Autorizado)
    res.status(401).json({ 
      error: 'Credenciais inválidas. Verifique e-mail e senha.',
      code: 'AUTH_FAILED' 
    });
    return;
  }
});

// ROTA 2: SIMULAÇÃO
// Intercepta a rota de simulação (POST /api/v1/simular-investimento)
server.post(SIMULATION_PATH_ORIGINAL, (req: Request, res: Response): void => {
  
  // Destruturação direta.
  const { valor: valorInicial, prazoMeses, tipo: tipoInvestimento } = req.body;
  
  const meses = prazoMeses || 12; 
  const valor = valorInicial; 
  
  // Taxa de Rentabilidade Hardcoded (Simulando uma chamada ao db.json ou lógica interna)
  let taxaAnual = 0.10; // Taxa base de 10%
  
  if (typeof valor !== 'number' || typeof meses !== 'number' || typeof tipoInvestimento !== 'string') {
    res.status(400).json({ error: 'Parâmetros inválidos. Esperado: valor, prazoMeses e tipo.', debug: req.body });
    return;
  }

  let taxaMensal = taxaAnual / 12;
  let detalhes = '';

  switch (tipoInvestimento) {
    case 'CDB':
      // 100% CDI
      detalhes = `Simulação CDB: 100% CDI. Taxa anual: ${(taxaAnual * 100).toFixed(2)}%.`;
      break;
    case 'LCI':
      // LCI é isento de IR, então a taxa líquida pode ser ligeiramente melhor para o cliente
      taxaAnual = taxaAnual * 1.05; // Ajuste para simular isenção
      taxaMensal = taxaAnual / 12;
      detalhes = `Simulação LCI: Isenta de IR. Taxa anual líquida: ${(taxaAnual * 100).toFixed(2)}%.`;
      break;
    case 'Tesouro':
      // Tesouro pode ter uma taxa mais agressiva
      taxaAnual = 0.15; 
      taxaMensal = taxaAnual / 12;
      detalhes = `Simulação Tesouro: Rentabilidade real + Inflação. Taxa anual: ${(taxaAnual * 100).toFixed(2)}%.`;
      break;
    default:
      detalhes = 'Tipo de investimento não reconhecido. Usando taxa padrão.';
  }

  // Cálculo de Juros Compostos (mensal)
  const valorFinal = valor * Math.pow(1 + taxaMensal, meses);

  res.json({
    valorInicial: valor,
    prazoMeses: meses,
    valorFinal: Number(valorFinal.toFixed(2)), // Garante que é um número formatado
    detalhes: detalhes
  });
});

// =========================================================================
// REESCRITA DE ROTA: Colocada AQUI para garantir que as rotas customizadas
//                    acima sejam processadas primeiro.
server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1'
}));
// =========================================================================


// Usa o roteador padrão para demais endpoints (Este é o último middleware)
server.use(router);

server.listen(3000, () => {
  console.log('✅ JSON Server rodando em http://localhost:3000');
  console.log(`   Rota de Login: POST ${LOGIN_PATH_ORIGINAL}`);
  console.log(`   Rota de Simulação: POST ${SIMULATION_PATH_ORIGINAL}`);
});