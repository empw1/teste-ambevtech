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
    const emailUnico = `cypress_${Date.now()}@teste.com`

    cadastroPage.fillNome(usuario.cadastro.nome)
    cadastroPage.fillEmail(emailUnico)
    cadastroPage.fillPassword(usuario.cadastro.password)
    cadastroPage.submit()

    cy.url().should('include', '/home')
    cy.contains('Serverest Store').should('be.visible')
  })
})
