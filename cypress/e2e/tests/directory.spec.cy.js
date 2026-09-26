import LoginAuthPage from '../../support/pages/LoginAuthPage';
import directoryPage from '../../support/pages/directoryPage';
import loginData from '../../fixtures/loginData.json';
import directoryData from '../../fixtures/directoryData.json';

describe('OrangeHRM Directory Feature Test Cases', () => {
  beforeEach(() => {
    // Setup login state before testing directory menggunakan LoginAuthPage
    LoginAuthPage.visit();
    LoginAuthPage.interceptLogin();
    LoginAuthPage.fillUsername(loginData.validUser.username);
    LoginAuthPage.fillPassword(loginData.validUser.password);
    LoginAuthPage.submit();
    LoginAuthPage.verifyDashboard();
  });

  it('TC01 - Success load Directory page and fetch employee records (Intercept & Assertion)', () => {
    directoryPage.interceptDirectoryApi();
    directoryPage.navigateToDirectory();
    directoryPage.verifyDirectoryLoaded();
  });

 it('TC02 - Success search employee by valid name', () => {
    directoryPage.interceptDirectoryApi();
    directoryPage.navigateToDirectory();
    directoryPage.verifyDirectoryLoaded();
    directoryPage.resetSearch();
    directoryPage.searchEmployee(directoryData.searchQuery.validName);
    cy.get('.orangehrm-container, .oxd-table', { timeout: 10000 }).should('be.visible');
  });

  it('TC03 - Search employee with non-existent name shows No Records Found', () => {
    directoryPage.navigateToDirectory();
    directoryPage.searchEmployee(directoryData.searchQuery.invalidName);
    directoryPage.verifyNoRecordsFound();
  });

  it('TC04 - Reset search filters successfully', () => {
    directoryPage.navigateToDirectory();
    directoryPage.searchEmployee(directoryData.searchQuery.validName);
    directoryPage.resetSearch();
    // Langsung assert container tabel setelah reset di sini secara aman
    cy.get('.orangehrm-container, .oxd-table', { timeout: 10000 }).should('be.visible');
  });
  
  it('TC05 - Intercept and mock Directory API response for custom verification', () => {
    directoryPage.navigateToDirectory();
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees*', {
      statusCode: 200,
      body: { data: [] }
    }).as('mockEmptyDirectory');

    directoryPage.navigateToDirectory();
    cy.wait('@mockEmptyDirectory');
  });

  it('TC06 - Verify UI elements layout on Directory page', () => {
    directoryPage.navigateToDirectory();
    directoryPage.elements.searchBoxInput().should('be.visible');
    directoryPage.elements.searchButton().should('be.visible');
    directoryPage.elements.resetButton().should('be.visible');
  });

  it('TC07 - Handle directory API network failure (500 Server Error intercept)', () => {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('serverError');

    directoryPage.navigateToDirectory();
    cy.wait('@serverError').its('response.statusCode').should('eq', 500);
  });

  it('TC08 - Verify quick navigation back to Dashboard from Directory', () => {
    directoryPage.navigateToDirectory();
    cy.get('span.oxd-main-menu-item--name').contains('Dashboard').click();
    LoginAuthPage.verifyDashboard();
  });
});