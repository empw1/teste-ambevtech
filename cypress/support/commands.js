import { faker } from '@faker-js/faker/locale/pt_BR'

Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      window.localStorage.setItem('token', response.body.authorization)
    }
    return response
  })
})

Cypress.Commands.add('criarUsuarioViaApi', (usuario) => {
  const payload = {
    ...usuario,
    email: faker.internet.email(),
  }

  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    body: payload,
  }).then((response) => {
    return { ...payload, _id: response.body._id }
  })
})
