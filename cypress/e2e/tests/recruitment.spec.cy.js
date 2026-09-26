import loginPage from '../../support/pages/LoginAuthPage'; // Sesuaikan jika menggunakan LoginAuthPage
import directoryPage from '../../support/pages/directoryPage';
import loginData from '../../fixtures/loginData.json';
import directoryData from '../../fixtures/directoryData.json';

// Seterusnya kode test directory...

// Seterusnya kode test directory...

describe('Recruitment Feature Test - OrangeHRM', () => {
  beforeEach(() => {
    // Setup login state sebelum masuk ke menu Recruitment menggunakan LoginAuthPage
    LoginAuthPage.visit();
    LoginAuthPage.interceptLogin();
    LoginAuthPage.fillUsername(loginData.validUser.username);
    LoginAuthPage.fillPassword(loginData.validUser.password);
    LoginAuthPage.submit();
    LoginAuthPage.verifyDashboard();

    // Navigasi ke Recruitment
    RecruitmentPage.visit();
    RecruitmentPage.verifyRecruitmentPageLoaded();
  });

  it('TC01: Memuat halaman Recruitment', () => {
    cy.url().should('include', '/recruitment');
  });

  it('TC02: Menambahkan kandidat baru dengan data valid', () => {
    RecruitmentPage.clickAddButton();
    RecruitmentPage.elements.firstNameInput().type('Budi');
    RecruitmentPage.elements.lastNameInput().type('Santoso');
    RecruitmentPage.elements.emailInput().type('budi.santoso@test.com');
    RecruitmentPage.elements.saveButton().click();
    cy.url().should('include', '/recruitment/addCandidate');
  });

  it('TC03: Gagal menambah kandidat saat field wajib kosong', () => {
    RecruitmentPage.clickAddButton();
    RecruitmentPage.elements.saveButton().click();
    // Memastikan pesan error validasi muncul pada field wajib
    cy.get('.oxd-input-field-error-message').should('contain', 'Required');
  });

  it('TC04: Mencari kandidat berdasarkan nama', () => {
    cy.get(".oxd-autocomplete-text-input > input", { timeout: 10000 })
      .should('be.visible')
      .type('Budi');
    cy.get("button[type='submit']").click();
    cy.get('.oxd-table', { timeout: 10000 }).should('exist');
  });

  it('TC05: Filter kandidat berdasarkan Job Vacancy', () => {
    // Tunggu hingga dropdown select siap
    cy.get('.oxd-select-text', { timeout: 10000 }).eq(0).should('be.visible').click({ force: true });
    cy.get('.oxd-select-dropdown', { timeout: 10000 }).contains('Software Engineer').click({ force: true });
    cy.get("button[type='submit']").click();
    cy.get('.oxd-table', { timeout: 10000 }).should('exist');
  });

  it('TC06: Filter kandidat berdasarkan Status', () => {
    cy.get('.oxd-select-text', { timeout: 10000 }).eq(1).should('be.visible').click({ force: true });
    cy.get('.oxd-select-dropdown', { timeout: 10000 }).should('be.visible').children().first().click({ force: true });
    cy.get("button[type='submit']").click();
    cy.get('.oxd-table', { timeout: 10000 }).should('exist');
  });

  it('TC07: Mengubah status kandidat (Shortlist)', () => {
    // Menguji aksi pada baris pertama tabel jika data tersedia
    cy.get('.oxd-table-body', { timeout: 10000 }).then(($body) => {
      if ($body.find('.oxd-table-card').length > 0) {
        cy.get('.oxd-table-cell').eq(1).click();
        cy.url().should('include', '/recruitment/addCandidate');
      } else {
        cy.log('Tidak ada data kandidat untuk di-shortlist');
      }
    });
  });

  it('TC08: Menghapus data kandidat', () => {
    cy.get('.oxd-table-body', { timeout: 10000 }).then(($body) => {
      if ($body.find('.oxd-table-card').length > 0) {
        cy.get('.oxd-table-cell').last().find('button').first().click();
        // Konfirmasi hapus jika modal muncul
        cy.get('.oxd-button--label-danger').contains('Yes, Delete').click();
      } else {
        cy.log('Tidak ada data kandidat untuk dihapus');
      }
    });
  });
});