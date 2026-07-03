import './commands'
import registerCypressGrep from '@cypress/grep/src/support'

registerCypressGrep()

Cypress.on('uncaught:exception', () => false)
