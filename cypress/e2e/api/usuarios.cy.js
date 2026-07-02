import { faker } from '@faker-js/faker/locale/pt_BR'

describe('API - Usuários', () => {
  let usuario
  const usuariosIds = []

  before(() => {
    cy.fixture('usuario').then((fixture) => {
      usuario = fixture
    })
  })

  after(() => {
    usuariosIds.forEach((id) => cy.deletarUsuarioViaApi(id))
  })

  it('CT04 - Deve criar um novo usuário com sucesso via API', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: usuario.cadastro.password,
        administrador: usuario.cadastro.administrador,
      },
    }).then((response) => {
      usuariosIds.push(response.body._id)

      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string').and.to.not.be.empty
    })
  })

  it('CT05 - Deve autenticar o usuário e retornar token Bearer válido', () => {
    const email = faker.internet.email()

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: faker.person.fullName(),
        email,
        password: usuario.cadastro.password,
        administrador: usuario.cadastro.administrador,
      },
    }).then((response) => {
      usuariosIds.push(response.body._id)

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
          email,
          password: usuario.cadastro.password,
        },
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200)
        expect(loginResponse.body).to.have.property('message', 'Login realizado com sucesso')
        expect(loginResponse.body).to.have.property('authorization')
          .and.to.match(/^Bearer\s.+/)
      })
    })
  })
})
