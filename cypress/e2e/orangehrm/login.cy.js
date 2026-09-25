import LoginPage from '../../support/pages/LoginPage'

describe('OrangeHRM - Login Feature with Page Object Model (POM)', () => {
    let testData;

    beforeEach(() => {
        // Memuat data dari fixtures sebelum setiap test case berjalan
        cy.fixture('orangehrm_data.json').then((data) => {
            testData = data;
        })
        LoginPage.navigate();
    })

    // TC-01
    it('TC-01: Login dengan username dan password valid', () => {
        LoginPage.login(testData.validUsername, testData.validPassword);
        LoginPage.verifyDashboard();
    })

    // TC-02
    it('TC-02: Login dengan username valid dan password salah', () => {
        LoginPage.login(testData.validUsername, testData.invalidPassword);
        LoginPage.verifyErrorMessage('Invalid credentials');
    })

    // TC-03
    it('TC-03: Login dengan username tidak terdaftar', () => {
        LoginPage.login(testData.unregisteredUser, testData.validPassword);
        LoginPage.verifyErrorMessage('Invalid credentials');
    })

    // TC-04
    it('TC-04: Login dengan username kosong', () => {
        LoginPage.login('', testData.validPassword);
        LoginPage.verifyRequiredField();
    })

    // TC-05
    it('TC-05: Login dengan password kosong', () => {
        LoginPage.login(testData.validUsername, '');
        LoginPage.verifyRequiredField();
    })

   
    

    // TC-06
    it('TC-06: Login dengan username menggunakan spasi di awal dan akhir', () => {
        LoginPage.login(testData.spacedUsername, testData.validPassword);
        LoginPage.verifyErrorMessage('Invalid credentials');
    })

    // TC-07
    it('TC-07: Password bersifat tersembunyi saat diketik', () => {
        LoginPage.enterPassword(testData.validPassword);
        LoginPage.verifyPasswordAttribute('password');
    })

    
    // TC-08
    it('TC-08: Tombol Login aktif dan dapat diklik', () => {
        LoginPage.verifyLoginButtonState();
        LoginPage.login(testData.validUsername, testData.validPassword);
        LoginPage.verifyDashboard();
    })

    
    // TC-09
    it('TC-09: Login dengan password sangat pendek', () => {
        LoginPage.login(testData.validUsername, testData.shortPassword);
        LoginPage.verifyErrorMessage('Invalid credentials');
    })
})