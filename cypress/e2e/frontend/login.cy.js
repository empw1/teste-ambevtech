import loginPage from '../../pages/LoginPage'

describe('Frontend - Autenticação de Usuário', () => {
  let usuario

  before(() => {
    cy.fixture('usuario').then((fixture) => {
      usuario = fixture
    })
  })

  beforeEach(() => {
    loginPage.visit()
  })

  it('CT02 - Deve realizar login com credenciais válidas', () => {
    cy.criarUsuarioViaApi({
      nome: usuario.cadastro.nome,
      password: usuario.cadastro.password,
      administrador: usuario.cadastro.administrador,
    }).then((usuarioCriado) => {
      loginPage.login(usuarioCriado.email, usuarioCriado.password)

      cy.url().should('include', '/admin/home')
      cy.contains('Bem Vindo').should('be.visible')
    })
  })

  it('CT03 - Deve exibir mensagem de erro ao tentar login com credenciais inválidas', () => {
    loginPage.login(
      usuario.loginInvalido.email,
      usuario.loginInvalido.password
    )

    cy.url().should('include', '/login')
    cy.contains('Email e/ou senha inválidos').should('be.visible')
  })
})
