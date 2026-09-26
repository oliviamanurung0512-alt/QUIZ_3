class DirectoryPage {
  // ELEMENTS
  elements = {
    directoryMenu: () => cy.get('span.oxd-main-menu-item--name').contains('Directory'),
    searchBoxInput: () => cy.get("input[placeholder='Type for hints...']"),
    searchButton: () => cy.get("button[type='submit']"),
    resetButton: () => cy.get("button[type='reset']"),
    employeeCard: () => cy.get('.orangehrm-directory-card'),
    noRecordsFound: () => cy.get('.oxd-text').contains('No Records Found')
  }

  // ACTIONS
  navigateToDirectory() {
    this.elements.directoryMenu().click();
  }

  searchEmployee(name) {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees*').as('getEmployees');
    this.elements.searchBoxInput().clear().type(name);
    cy.wait('@getEmployees');
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-autocomplete-dropdown').length > 0) {
        cy.get('.oxd-autocomplete-dropdown', { timeout: 10000 }) 
          .contains(name)
          .click({ force: true });
      }
    });
    this.elements.searchButton().click();
  }

  resetSearch() {
    this.elements.resetButton().click();
  }

  // INTERCEPT
  interceptDirectoryApi() {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees*').as('directoryApi');
  }

  // ASSERTIONS
  verifyDirectoryLoaded() {
    cy.wait('@directoryApi').its('response.statusCode').should('eq', 200);
  }

  verifyEmployeeResultVisible() {
    cy.get('.orangehrm-card-container').should('be.visible');
  }

  verifyNoRecordsFound() {
    this.elements.noRecordsFound().should('be.visible');
  }
}

export default new DirectoryPage();