class LoginPage {
    // Locators
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        submitButton: () => cy.get('button[type="submit"]'),
        errorMessage: (text) => cy.contains(text),
        requiredMessage: () => cy.contains('Required'),
        dashboardHeader: () => cy.contains('Dashboard'),
        showPasswordIcon: () => cy.get('.oxd-icon-button').last()
    }

    // Actions
    navigate() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    }

    enterUsername(username) {
        if (username) {
            this.elements.usernameInput().should('be.visible').type(username)
        }
    }

    enterPassword(password) {
        if (password) {
            this.elements.passwordInput().should('be.visible').type(password)
        }
    }

    clickLogin() {
        this.elements.submitButton().should('be.visible').click()
    }

    login(username, password) {
        this.enterUsername(username)
        this.enterPassword(password)
        this.clickLogin()
    }

    verifyDashboard() {
        cy.url().should('include', '/dashboard')
        this.elements.dashboardHeader().should('be.visible')
    }

    verifyErrorMessage(message) {
        this.elements.errorMessage(message).should('be.visible')
    }

    verifyRequiredField() {
        this.elements.requiredMessage().should('be.visible')
    }

    verifyUsernameParentRequired() {
        this.elements.usernameInput().parent().should('contain', 'Required')
    }

    verifyPasswordParentRequired() {
        this.elements.passwordInput().parent().should('contain', 'Required')
    }

    verifyPasswordAttribute(type) {
        this.elements.passwordInput().should('have.attr', 'type', type)
    }

    toggleShowPassword() {
        this.elements.showPasswordIcon().click()
    }

    verifyLoginButtonState() {
        this.elements.submitButton()
            .should('be.visible')
            .and('contain', 'Login')
            .and('not.be.disabled')
    }
}

export default new LoginPage()