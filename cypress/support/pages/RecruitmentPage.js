class RecruitmentPage {
  // ELEMENTS
  elements = {
    recruitmentMenu: () => cy.get('span.oxd-main-menu-item--name').contains('Recruitment'),
    addButton: () => cy.get('.orangehrm-header-container button.oxd-button'), // Selector tombol Add yang lebih spesifik
    firstNameInput: () => cy.get("input[name='firstName']"),
    lastNameInput: () => cy.get("input[name='lastName']"),
    emailInput: () => cy.get(".oxd-form input[type='text']").eq(3),
    saveButton: () => cy.get("button[type='submit']").contains('Save'),
    searchCandidateInput: () => cy.get(".oxd-autocomplete-text-input > input"),
    selectDropdown: () => cy.get('.oxd-select-text'),
    table: () => cy.get('.oxd-table')
  }

  // ACTIONS
  visit() {
    this.elements.recruitmentMenu().click();
  }

  clickAddButton() {
    this.elements.addButton().should('be.visible').click();
    cy.url().should('include', '/recruitment/addCandidate');
  }

  // ASSERTIONS
  verifyRecruitmentPageLoaded() {
    cy.url().should('include', '/recruitment');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Recruitment');
  }
}

export default new RecruitmentPage();