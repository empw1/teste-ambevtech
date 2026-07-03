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
- [@faker-js/faker](https://fakerjs.dev/) — geração de dados dinâmicos
- [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) — filtragem de testes por tags
- [ESLint](https://eslint.org/) + [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) — análise estática
- [GitHub Actions](https://github.com/features/actions) — CI/CD

---

## Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── cypress.yml         # Pipeline CI/CD com 3 jobs e agendamentos
├── cypress/
│   ├── e2e/
│   │   ├── frontend/
│   │   │   ├── cadastro.cy.js  # CT01b (@regressivo), CT01 (@smoke @regressivo)
│   │   │   └── login.cy.js     # CT02 (@smoke @regressivo), CT02b (@regressivo), CT03 (@regressivo)
│   │   └── api/
│   │       ├── usuarios.cy.js  # CT04 (@smoke @regressivo), CT04b (@regressivo), CT05 (@smoke @regressivo)
│   │       └── produtos.cy.js  # CT06 (@smoke @regressivo)
│   ├── fixtures/
│   │   └── usuario.json        # Dados base: password e administrador
│   ├── pages/
│   │   ├── CadastroPage.js     # Page Object - Cadastro
│   │   └── LoginPage.js        # Page Object - Login
│   └── support/
│       ├── commands.js         # Comandos customizados
│       └── e2e.js              # Configuração global e registro de plugins
├── cypress.config.js
├── eslint.config.js
└── package.json
```

---

## Cenários de Teste

### Frontend (E2E)

| ID | Tipo | Tags | Descrição |
|----|------|------|-----------|
| CT01b | Negativo | `@regressivo` `@frontend` | Não deve permitir cadastro com campos obrigatórios vazios |
| CT01 | Positivo | `@smoke` `@regressivo` `@frontend` | Deve cadastrar um novo usuário com sucesso |
| CT02 | Positivo | `@smoke` `@regressivo` `@frontend` | Deve realizar login com credenciais válidas |
| CT02b | Integração | `@regressivo` `@frontend` | Deve autenticar via API e manter sessão ativa no frontend |
| CT03 | Negativo | `@regressivo` `@frontend` | Deve exibir mensagem de erro ao tentar login com credenciais inválidas |

### API

| ID | Tipo | Tags | Descrição |
|----|------|------|-----------|
| CT04 | Positivo | `@smoke` `@regressivo` `@api` | Deve criar um novo usuário com sucesso via API |
| CT04b | Negativo | `@regressivo` `@api` | Não deve permitir cadastro com email já existente |
| CT05 | Positivo | `@smoke` `@regressivo` `@api` | Deve autenticar o usuário e retornar token Bearer válido |
| CT06 | Positivo | `@smoke` `@regressivo` `@api` | Deve criar um produto com sucesso utilizando token de autenticação |

---

## Padrões Adotados

- **Page Objects** — encapsulamento dos seletores e ações de cada página
- **Fixtures** — dados de teste centralizados em arquivos JSON (apenas o essencial)
- **Custom Commands** — comandos reutilizáveis (`cy.criarUsuarioViaApi`, `cy.deletarUsuarioViaApi`, `cy.loginViaApi`, `cy.criarUsuarioELoginViaApi`)
- **Faker** — geração de dados dinâmicos para evitar conflitos entre execuções
- **Tags de execução** — `@smoke`, `@regressivo`, `@frontend`, `@api` para filtragem granular
- **Limpeza pós-teste** — remoção de dados criados via `after/afterEach` para manter o ambiente limpo
- **Retry automático** — reexecução de testes falhos na pipeline (`runMode: 2`)
- **ESLint** — análise estática com regras específicas para Cypress
- **Conventional Commits** — mensagens de commit padronizadas (`test:`, `ci:`, `fix:`, `docs:`, `config:`, `chore:`)

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

### Verificar qualidade do código

```bash
npm run lint
```

---

## Executando por Tags

O projeto utiliza o plugin [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) para filtrar cenários por tag. Isso permite executar subconjuntos específicos dos testes sem alterar nenhum arquivo.

### Tags disponíveis

| Tag | Descrição | Cenários incluídos |
|-----|-----------|-------------------|
| `@smoke` | Caminhos críticos do sistema | CT01, CT02, CT04, CT05, CT06 |
| `@regressivo` | Cobertura completa | Todos os 9 cenários |
| `@frontend` | Apenas testes de interface | CT01b, CT01, CT02, CT02b, CT03 |
| `@api` | Apenas testes de API | CT04, CT04b, CT05, CT06 |

### Como usar localmente

```bash
# Executar apenas cenários @smoke
npx cypress run --env grepTags=@smoke

# Executar apenas cenários @regressivo
npx cypress run --env grepTags=@regressivo

# Executar apenas cenários de @frontend
npx cypress run --env grepTags=@frontend

# Executar apenas cenários de @api
npx cypress run --env grepTags=@api

# Combinar tags (frontend E smoke)
npx cypress run --env grepTags="@smoke @frontend"
```

---

## Fluxo de Branches

O projeto adota um **Git Flow simplificado** com duas branches protegidas para garantir qualidade e rastreabilidade.

```
feature/* ──→ PR ──→ develop  (smoke: 5 cenários)
                         │
                         └──→ PR ──→ main  (regressivo: 9 cenários)
```

### Regras de contribuição

| Branch | Aceita push direto? | Aceita PR de | Testes exigidos |
|--------|---------------------|--------------|-----------------|
| `develop` | ❌ | `feature/*` | `@smoke` deve passar |
| `main` | ❌ | `develop` | `@regressivo` deve passar |

### Passo a passo para contribuir

```bash
# 1. Crie sua branch a partir do develop
git checkout develop
git pull origin develop
git checkout -b feature/minha-feature

# 2. Implemente e commite suas alterações
git add .
git commit -m "test: descrição da alteração"

# 3. Abra um PR para develop (smoke roda automaticamente)
git push origin feature/minha-feature
# → Abra o PR no GitHub apontando para develop

# 4. Após aprovação e merge no develop,
#    abra um PR de develop para main (regressivo roda automaticamente)
```

---

## CI/CD — GitHub Actions

A pipeline possui **2 jobs** com triggers baseados na branch de destino:

### Job 1 — Smoke Tests (develop)

Disparado em **push** ou **pull request** para `develop` e também **a cada 4 horas** via cron. Executa os 5 cenários críticos com a tag `@smoke`.

**Objetivo:** validação rápida e contínua durante o desenvolvimento, com custo reduzido de CI.

### Job 2 — Regressivo Completo (main)

Disparado em **push** ou **pull request** para `main` e também **todo dia ao meio-dia** via cron. Executa todos os 9 cenários com a tag `@regressivo`.

**Objetivo:** garantia total de qualidade antes de qualquer código chegar à branch de produção.

### Resumo dos triggers

| Trigger | Branch | Job | Tag executada | Cenários |
|---------|--------|-----|---------------|----------|
| Push / PR | `develop` | Smoke | `@smoke` | 5 |
| Push / PR | `main` | Regressivo | `@regressivo` | 9 |
| Cron (a cada 4h) | — | Smoke | `@smoke` | 5 |
| Cron (meio-dia) | — | Regressivo | `@regressivo` | 9 |

### Etapas executadas em ambos os jobs

1. Checkout do repositório
2. Configuração do Node.js v20
3. Instalação das dependências (`npm ci`)
4. Análise estática do código (`npm run lint`)
5. Execução dos testes de API com a tag correspondente
6. Execução dos testes de Frontend com a tag correspondente
7. Upload de screenshots em caso de falha (artefato)
