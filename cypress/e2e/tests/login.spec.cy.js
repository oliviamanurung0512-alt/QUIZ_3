import LoginAuthPage from '../../support/pages/LoginAuthPage';

describe('Login Feature Test - OrangeHRM', () => {
  beforeEach(() => {
    LoginAuthPage.visit();
    LoginAuthPage.interceptLogin();
  });

  it('TC01: Login dengan kredensial valid', () => {
    cy.fixture('loginData').then((data) => {
      LoginAuthPage.fillUsername(data.validUser.username);
      LoginAuthPage.fillPassword(data.validUser.password);
      LoginAuthPage.submit();
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 302);
      LoginAuthPage.verifyDashboard();
    });
  });

  it('TC02: Login dengan username salah dan password valid', () => {
    LoginAuthPage.fillUsername('SalahUser');
    LoginAuthPage.fillPassword('admin123');
    LoginAuthPage.submit();
    LoginAuthPage.verifyErrorMessage('Invalid credentials');
  });

  it('TC03: Login dengan username valid dan password salah', () => {
    LoginAuthPage.fillUsername('Admin');
    LoginAuthPage.fillPassword('salahpassword');
    LoginAuthPage.submit();
    LoginAuthPage.verifyErrorMessage('Invalid credentials');
  });

  it('TC04: Login dengan mengosongkan semua field', () => {
    LoginAuthPage.submit();
    LoginAuthPage.verifyRequiredMessage();
  });

  it('TC05: Login dengan username kosong dan password terisi', () => {
    LoginAuthPage.fillPassword('admin123');
    LoginAuthPage.submit();
    LoginAuthPage.verifyRequiredMessage();
  });

  it('TC06: Login dengan username terisi dan password kosong', () => {
    LoginAuthPage.fillUsername('Admin');
    LoginAuthPage.submit();
    LoginAuthPage.verifyRequiredMessage();
  });

  it('TC07: Verifikasi tombol Forgot Password', () => {
    cy.get('.orangehrm-login-forgot-header').click();
    cy.url().should('include', '/requestPasswordResetCode');
  });

  it('TC08: Logout dari aplikasi', () => {
    cy.fixture('loginData').then((data) => {
      LoginAuthPage.fillUsername(data.validUser.username);
      LoginAuthPage.fillPassword(data.validUser.password);
      LoginAuthPage.submit();
      LoginAuthPage.interceptLogout();
      cy.get('.oxd-userdropdown-tab').click();
      cy.get('.oxd-dropdown-menu').contains('Logout').click();
      cy.wait('@logoutRequest');
      cy.url().should('include', '/auth/login');
    });
  });
});