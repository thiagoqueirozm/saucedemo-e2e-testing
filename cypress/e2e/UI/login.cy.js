import LoginPage from '../../../pages/LoginPage'

describe('Login - SauceDemo', () => {
  it('should allow login with valid credentials and redirect to inventory page', () => {
    cy.fixture('users').then((data) => {
      LoginPage.login(data.validUser.username, data.validUser.password)

      cy.url().should('include', '/inventory.html')
      cy.get('.title').should('have.text', 'Products')
      cy.get('.inventory_list').should('be.visible')
    })
  })

  it('should not allow login with invalid credentials and show error message', () => {
    cy.fixture('users').then((data) => {
      LoginPage.login(data.invalidUser.username, data.invalidUser.password)

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Username and password do not match')
    })
  })
})
