import { faker } from '@faker-js/faker/locale/pt_BR'
import loginPage from '../../pages/LoginPage'

describe('Frontend - Autenticação de Usuário', () => {
  let usuario
  let usuarioCriadoId

  before(() => {
    cy.fixture('usuario').then((fixture) => {
      usuario = fixture
    })
  })

  beforeEach(() => {
    loginPage.visit()
  })

  after(() => {
    if (usuarioCriadoId) {
      cy.deletarUsuarioViaApi(usuarioCriadoId)
    }
  })

  it('CT02 - Deve realizar login com credenciais válidas', () => {
    cy.criarUsuarioViaApi({
      nome: faker.person.fullName(),
      password: usuario.cadastro.password,
      administrador: usuario.cadastro.administrador,
    }).then((usuarioCriado) => {
      usuarioCriadoId = usuarioCriado._id
      loginPage.login(usuarioCriado.email, usuarioCriado.password)

      cy.url().should('include', '/admin/home')
      cy.contains('Bem Vindo').should('be.visible')
    })
  })

  it('CT02b - Deve autenticar via API e manter sessão ativa no frontend', () => {
    cy.criarUsuarioELoginViaApi({
      nome: faker.person.fullName(),
      password: usuario.cadastro.password,
      administrador: usuario.cadastro.administrador,
    }).then((sessao) => {
      usuarioCriadoId = sessao._id

      cy.visit('/admin/home')
      cy.url().should('include', '/admin/home')
      cy.contains('Bem Vindo').should('be.visible')
    })
  })

  it('CT03 - Deve exibir mensagem de erro ao tentar login com credenciais inválidas', () => {
    loginPage.login(
      faker.internet.email(),
      faker.internet.password()
    )

    cy.url().should('include', '/login')
    cy.contains('Email e/ou senha inválidos').should('be.visible')
  })
})
