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

  it('CT04 - Deve criar um novo usuário com sucesso via API', { tags: ['@smoke', '@regressivo', '@api'] }, () => {
    const nome = faker.person.fullName()
    const email = faker.internet.email()

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome,
        email,
        password: usuario.cadastro.password,
        administrador: usuario.cadastro.administrador,
      },
    }).then((response) => {
      usuariosIds.push(response.body._id)

      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string').and.to.not.be.empty
      expect(response.duration).to.be.lessThan(3000)

      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/usuarios?email=${email}`,
      }).then((getResponse) => {
        const criado = getResponse.body.usuarios[0]
        expect(criado.nome).to.eq(nome)
        expect(criado.email).to.eq(email)
        expect(criado.administrador).to.eq(usuario.cadastro.administrador)
      })
    })
  })

  it('CT04b - Não deve permitir cadastro com email já existente', { tags: ['@regressivo', '@api'] }, () => {
    const email = faker.internet.email()
    const payload = {
      nome: faker.person.fullName(),
      email,
      password: usuario.cadastro.password,
      administrador: usuario.cadastro.administrador,
    }

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: payload,
    }).then((response) => {
      usuariosIds.push(response.body._id)

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/usuarios`,
        body: payload,
        failOnStatusCode: false,
      }).then((duplicadoResponse) => {
        expect(duplicadoResponse.status).to.eq(400)
        expect(duplicadoResponse.body).to.have.property('message', 'Este email já está sendo usado')
      })
    })
  })

  it('CT05 - Deve autenticar o usuário e retornar token Bearer válido', { tags: ['@smoke', '@regressivo', '@api'] }, () => {
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
        expect(loginResponse.duration).to.be.lessThan(3000)

        const token = loginResponse.body.authorization.split(' ')[1]
        expect(token).to.be.a('string').and.to.have.length.greaterThan(10)
      })
    })
  })
})
