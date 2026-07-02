class CadastroPage {
  get nomeInput() { return cy.get('[data-testid="nome"]') }
  get emailInput() { return cy.get('[data-testid="email"]') }
  get passwordInput() { return cy.get('[data-testid="password"]') }
  get adminCheckbox() { return cy.get('[data-testid="checkbox"]') }
  get submitButton() { return cy.get('[data-testid="cadastrar"]') }
  get successMessage() { return cy.get('.alert-success, [class*="success"]') }

  visit() {
    cy.visit('/cadastrarusuarios')
  }

  fillNome(nome) {
    this.nomeInput.clear().type(nome)
  }

  fillEmail(email) {
    this.emailInput.clear().type(email)
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password)
  }

  checkAdmin() {
    this.adminCheckbox.check()
  }

  submit() {
    this.submitButton.click()
  }

  cadastrar({ nome, email, password }) {
    this.fillNome(nome)
    this.fillEmail(email)
    this.fillPassword(password)
    this.submit()
  }
}

module.exports = new CadastroPage()
