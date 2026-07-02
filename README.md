# Teste AmbevTech — Automação com Cypress

Projeto de testes automatizados E2E desenvolvido como parte do processo seletivo da AmbevTech, utilizando [Cypress](https://www.cypress.io/) e JavaScript.

---

## Aplicação Testada

| Camada | URL |
|--------|-----|
| Frontend | https://front.serverest.dev |
| API (Swagger) | https://serverest.dev |

---

## Tecnologias

- [Node.js](https://nodejs.org/) v20+
- [Cypress](https://www.cypress.io/) v13
- [GitHub Actions](https://github.com/features/actions) — CI/CD

---

## Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── cypress.yml         # Pipeline CI/CD
├── cypress/
│   ├── e2e/
│   │   ├── frontend/
│   │   │   ├── cadastro.cy.js  # CT01
│   │   │   └── login.cy.js     # CT02, CT03
│   │   └── api/
│   │       ├── usuarios.cy.js  # CT04, CT05
│   │       └── produtos.cy.js  # CT06
│   ├── fixtures/
│   │   ├── usuario.json        # Dados de usuário
│   │   └── produto.json        # Dados de produto
│   ├── pages/
│   │   ├── CadastroPage.js     # Page Object - Cadastro
│   │   └── LoginPage.js        # Page Object - Login
│   └── support/
│       ├── commands.js         # Comandos customizados
│       └── e2e.js              # Configuração global
├── cypress.config.js
└── package.json
```

---

## Cenários de Teste

### Frontend (E2E)

| ID | Tipo | Descrição |
|----|------|-----------|
| CT01b | Negativo | Não deve permitir cadastro com campos obrigatórios vazios |
| CT01 | Positivo | Deve cadastrar um novo usuário com sucesso |
| CT02 | Positivo | Deve realizar login com credenciais válidas |
| CT02b | Integração | Deve autenticar via API e manter sessão ativa no frontend |
| CT03 | Negativo | Deve exibir mensagem de erro ao tentar login com credenciais inválidas |

### API

| ID | Tipo | Descrição |
|----|------|-----------|
| CT04 | Positivo | Deve criar um novo usuário com sucesso via API |
| CT04b | Negativo | Não deve permitir cadastro com email já existente |
| CT05 | Positivo | Deve autenticar o usuário e retornar token Bearer válido |
| CT06 | Positivo | Deve criar um produto com sucesso utilizando token de autenticação |

---

## Padrões Adotados

- **Page Objects** — encapsulamento dos seletores e ações de cada página
- **Fixtures** — dados de teste centralizados em arquivos JSON
- **Custom Commands** — comandos reutilizáveis (`cy.criarUsuarioViaApi`)
- **Conventional Commits** — mensagens de commit padronizadas (`feat`, `test`, `ci`)

---

## Como Executar Localmente

**Pré-requisitos:** Node.js v20+ instalado.

### Instalar dependências

```bash
npm install
```

### Executar todos os testes (headless)

```bash
npm run cy:run
```

### Executar apenas testes de API

```bash
npm run cy:run:api
```

### Executar apenas testes de Frontend

```bash
npm run cy:run:frontend
```

### Abrir interface gráfica

```bash
npm run cy:open
```

---

## CI/CD — GitHub Actions

A pipeline é disparada automaticamente em todo **push** ou **pull request** para a branch `main`.

**Etapas executadas:**
1. Checkout do repositório
2. Configuração do Node.js v20
3. Instalação das dependências (`npm ci`)
4. Execução dos testes de API
5. Execução dos testes de Frontend
6. Upload de screenshots em caso de falha (artefato)
