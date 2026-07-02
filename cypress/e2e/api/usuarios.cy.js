describe('API - Usuários', () => {
  let usuario

  before(() => {
    cy.fixture('usuario').then((fixture) => {
      usuario = fixture
    })
  })

  it('CT04 - Deve criar um novo usuário com sucesso via API', () => {
    const emailUnico = `cypress_api_${Date.now()}@teste.com`

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: usuario.cadastro.nome,
        email: emailUnico,
        password: usuario.cadastro.password,
        administrador: usuario.cadastro.administrador,
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string').and.to.not.be.empty
    })
  })

  it('CT05 - Deve autenticar o usuário e retornar token Bearer válido', () => {
    const emailUnico = `cypress_login_${Date.now()}@teste.com`

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: usuario.cadastro.nome,
        email: emailUnico,
        password: usuario.cadastro.password,
        administrador: usuario.cadastro.administrador,
      },
    }).then(() => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
          email: emailUnico,
          password: usuario.cadastro.password,
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Login realizado com sucesso')
        expect(response.body).to.have.property('authorization')
          .and.to.match(/^Bearer\s.+/)
      })
    })
  })
})
