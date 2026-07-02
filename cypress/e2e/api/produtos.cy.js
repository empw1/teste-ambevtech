import { faker } from '@faker-js/faker/locale/pt_BR'

describe('API - Produtos', () => {
  let usuario
  let token

  before(() => {
    cy.fixture('usuario').then((fixtureUsuario) => {
      usuario = fixtureUsuario
    })
  })

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: usuario.cadastro.password,
        administrador: 'true',
      },
    }).then((responseUsuario) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
          email: responseUsuario.requestBody.email,
          password: usuario.cadastro.password,
        },
      }).then((response) => {
        token = response.body.authorization
      })
    })
  })

  it('CT06 - Deve criar um produto com sucesso utilizando token de autenticação', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/produtos`,
      headers: { Authorization: token },
      body: {
        nome: faker.commerce.productName(),
        preco: faker.number.int({ min: 1, max: 1000 }),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.number.int({ min: 1, max: 100 }),
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string').and.to.not.be.empty
    })
  })
})
