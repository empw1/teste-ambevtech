import { faker } from '@faker-js/faker/locale/pt_BR'

Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      window.localStorage.setItem('serverest/userToken', response.body.authorization)
      window.localStorage.setItem('serverest/userEmail', email)
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

Cypress.Commands.add('deletarUsuarioViaApi', (id) => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/usuarios/${id}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('criarUsuarioELoginViaApi', (dadosUsuario) => {
  return cy.criarUsuarioViaApi(dadosUsuario).then((usuarioCriado) => {
    return cy.loginViaApi(usuarioCriado.email, usuarioCriado.password).then((response) => {
      if (response.status === 200) {
        window.localStorage.setItem('serverest/userNome', usuarioCriado.nome)
      }
      return { ...usuarioCriado, authorization: response.body.authorization }
    })
  })
})
