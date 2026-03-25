const LoginActions = {
  visit() {
    cy.visit('/login')
  },

  fillUsername(value) {
    cy.get('#username').type(value)
  },

  fillPassword(value) {
    cy.get('#password').type(value)
  },

  submit() {
    cy.get('button[type="submit"]').click()
  },

  doLogin(user, pass) {
    cy.log('Acessa pagina de login')
    this.visit()
    
    cy.log(`Preenche username: ${user}`)
    this.fillUsername(user)
    
    cy.log('Preenche password')
    this.fillPassword(pass)
    
    cy.log('Submete formulário de login')
    this.submit()
  }
}

module.exports = LoginActions
