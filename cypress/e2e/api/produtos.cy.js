import { faker } from '@faker-js/faker/locale/pt_BR'

describe('API - Produtos', () => {
  let usuario
  let token
  let usuarioId
  let produtoId

  before(() => {
    cy.fixture('usuario').then((fixtureUsuario) => {
      usuario = fixtureUsuario
    })
  })

  beforeEach(() => {
    const email = faker.internet.email()

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: faker.person.fullName(),
        email,
        password: usuario.cadastro.password,
        administrador: 'true',
      },
    }).then((response) => {
      usuarioId = response.body._id

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
          email,
          password: usuario.cadastro.password,
        },
      }).then((loginResponse) => {
        token = loginResponse.body.authorization
      })
    })
  })

  afterEach(() => {
    if (produtoId) {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/produtos/${produtoId}`,
        headers: { Authorization: token },
        failOnStatusCode: false,
      })
    }
    if (usuarioId) {
      cy.deletarUsuarioViaApi(usuarioId)
    }
  })

  it('CT06 - Deve criar um produto com sucesso utilizando token de autenticação', { tags: ['@smoke', '@regressivo', '@api'] }, () => {
    const nomeProduto = faker.commerce.productName()
    const preco = faker.number.int({ min: 1, max: 1000 })
    const quantidade = faker.number.int({ min: 1, max: 100 })

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/produtos`,
      headers: { Authorization: token },
      body: {
        nome: nomeProduto,
        preco,
        descricao: faker.commerce.productDescription(),
        quantidade,
      },
    }).then((response) => {
      produtoId = response.body._id

      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string').and.to.not.be.empty
      expect(response.duration).to.be.lessThan(3000)

      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/produtos/${produtoId}`,
      }).then((getResponse) => {
        expect(getResponse.body.nome).to.eq(nomeProduto)
        expect(getResponse.body.preco).to.eq(preco)
        expect(getResponse.body.quantidade).to.eq(quantidade)
      })
    })
  })
})
