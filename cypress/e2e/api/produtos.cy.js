describe('API - Produtos', () => {
  let produto
  let usuario
  let token

  before(() => {
    cy.fixture('produto').then((fixtureProduto) => {
      produto = fixtureProduto
    })

    cy.fixture('usuario').then((fixtureUsuario) => {
      usuario = fixtureUsuario
    })
  })

  beforeEach(() => {
    const emailUnico = `cypress_produto_${Date.now()}@teste.com`

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: {
        nome: usuario.cadastro.nome,
        email: emailUnico,
        password: usuario.cadastro.password,
        administrador: 'true',
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
        token = response.body.authorization
      })
    })
  })

  it('CT06 - Deve criar um produto com sucesso utilizando token de autenticação', () => {
    const nomeProdutoUnico = `${produto.novo.nome} ${Date.now()}`

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/produtos`,
      headers: { Authorization: token },
      body: {
        nome: nomeProdutoUnico,
        preco: produto.novo.preco,
        descricao: produto.novo.descricao,
        quantidade: produto.novo.quantidade,
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id').and.to.be.a('string').and.to.not.be.empty
    })
  })
})
