/**
 * Cria um usuário via API e realiza login, retornando o token de autenticação.
 * Útil para preparar o estado antes dos testes de frontend.
 */
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

/**
 * Cria um usuário administrador via API para uso nos testes.
 * Gera email único por timestamp para evitar conflitos.
 */
Cypress.Commands.add('criarUsuarioViaApi', (usuario) => {
  const emailUnico = `cypress_${Date.now()}@teste.com`
  const payload = { ...usuario, email: emailUnico }

  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    body: payload,
  }).then((response) => {
    return { ...payload, _id: response.body._id }
  })
})
