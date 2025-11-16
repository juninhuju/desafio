const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rota customizada de login
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

// Outras rotas do db.json
server.use('/api/v1', router);

server.listen(3000, () => {
  console.log('Mock API rodando em http://localhost:3000');
});
