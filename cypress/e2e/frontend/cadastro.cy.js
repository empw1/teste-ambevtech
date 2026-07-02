import { faker } from '@faker-js/faker/locale/pt_BR'
import cadastroPage from '../../pages/CadastroPage'

describe('Frontend - Cadastro de Usuário', () => {
  let usuario

  before(() => {
    cy.fixture('usuario').then((fixture) => {
      usuario = fixture
    })
  })

  beforeEach(() => {
    cadastroPage.visit()
  })

  it('CT01 - Deve cadastrar um novo usuário com sucesso', () => {
    const emailUnico = faker.internet.email()

    cadastroPage.fillNome(faker.person.fullName())
    cadastroPage.fillEmail(emailUnico)
    cadastroPage.fillPassword(usuario.cadastro.password)
    cadastroPage.submit()

    cy.url().should('include', '/home')
    cy.contains('Serverest Store').should('be.visible')
  })
})
