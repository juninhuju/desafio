// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ==========================================================
// 🚨 ROTA 1: Rota customizada de login (Permanece com /api/v1)
// ==========================================================
server.post('/api/v1/autenticacao/login', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = router.db.get('usuarios').value();

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    res.json({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…',
      clientId: 123
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// ==========================================================
// 🚀 ROTA 2: Rota customizada de Simulação (Retorna SÓ A TAXA)
// ==========================================================
server.post('/simular-investimento', (req, res) => {
    console.log('[MOCK] Simulação acionada.');
    
    // Apenas lemos o tipo de investimento para definir a taxa
    const { tipo: tipoInvestimento } = req.body;
    
    let rentabilidade = 0.12; // Taxa padrão (12% ao ano)
    let detalhes = '';
    
    switch (tipoInvestimento) {
        case 'LCI':
            rentabilidade = 0.14; 
            detalhes = 'Simulação LCI: Taxa de 14% a.a. (Isento de IR).';
            break;
        case 'Tesouro':
            rentabilidade = 0.15;
            detalhes = 'Simulação Tesouro: Taxa de 15% a.a. (Tesouro Selic + Inflação).';
            break;
        case 'CDB':
        default:
            rentabilidade = 0.12;
            detalhes = 'Simulação CDB: Taxa de 12% a.a. (100% CDI).';
            break;
    }

    // 🛑 Retorna APENAS a taxa e os detalhes. O cálculo será feito no frontend.
    res.json({
        rentabilidade: rentabilidade,
        detalhes: detalhes
    });
});
// Outras rotas do db.json (que usam o prefixo /api/v1)
server.use('/api/v1', router);

server.listen(3000, () => {
  console.log('Mock API rodando em http://localhost:3000');
});