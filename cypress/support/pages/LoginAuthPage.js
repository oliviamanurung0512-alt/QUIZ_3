class LoginAuthPage {
  visit() {
    cy.visit('/web/index.php/auth/login');
  }

  fillUsername(username) {
    cy.get("input[name='username']").clear().type(username);
  }

  fillPassword(password) {
    cy.get("input[name='password']").clear().type(password);
  }

  submit() {
    cy.get("button[type='submit']").click();
  }

  interceptLogin() {
    cy.intercept('POST', '**/auth/validate').as('loginRequest');
  }

  interceptLogout() {
    cy.intercept('GET', '**/auth/logout').as('logoutRequest');
  }

  verifyDashboard() {
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
  }

  verifyErrorMessage(message) {
    cy.get('.oxd-alert-content-text').should('contain', message);
  }

  verifyRequiredMessage() {
    cy.get('.oxd-input-field-error-message').should('contain', 'Required');
  }
}

export default new LoginAuthPage();