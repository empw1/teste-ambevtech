import { faker } from '@faker-js/faker/locale/pt_BR'
import cadastroPage from '../../pages/CadastroPage'

describe('Frontend - Cadastro de Usuário', () => {
  let usuario
  let usuarioId

  before(() => {
    cy.fixture('usuario').then((fixture) => {
      usuario = fixture
    })
  })

  beforeEach(() => {
    cadastroPage.visit()
  })

  after(() => {
    if (usuarioId) {
      cy.deletarUsuarioViaApi(usuarioId)
    }
  })

  it('CT01b - Não deve permitir cadastro com campos obrigatórios vazios', { tags: ['@regressivo', '@frontend'] }, () => {
    cadastroPage.submit()

    cy.url().should('include', '/cadastrarusuarios')
    cy.contains('Nome é obrigatório').should('be.visible')
    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
  })

  it('CT01 - Deve cadastrar um novo usuário com sucesso', { tags: ['@smoke', '@regressivo', '@frontend'] }, () => {
    const email = faker.internet.email()

    cadastroPage.fillNome(faker.person.fullName())
    cadastroPage.fillEmail(email)
    cadastroPage.fillPassword(usuario.cadastro.password)
    cadastroPage.submit()

    cy.url().should('include', '/home')
    cy.contains('Serverest Store').should('be.visible')

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/usuarios?email=${email}`,
    }).then((response) => {
      usuarioId = response.body.usuarios[0]._id
    })
  })
})
