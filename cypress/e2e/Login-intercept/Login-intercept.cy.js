describe('OrangeHRM - Login Feature with Intercept', () => {

    // =========================================================
    // TC-01
    // Login dengan username dan password valid
    // =========================================================
    it('TC-01 - Login dengan username dan password valid', () => {

        cy.intercept('POST', '**/auth/validate').as('loginValid')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.get('input[name="username"]')
            .should('be.visible')
            .type('Admin')

        cy.get('input[name="password"]')
            .should('be.visible')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@loginValid')
            .its('response.statusCode')
            .should('eq', 302)

        cy.url()
            .should('include', '/dashboard')
    })


    // =========================================================
    // TC-02
    // Login dengan username valid dan password salah
    // =========================================================
    it('TC-02 - Login dengan username valid dan password salah', () => {

        cy.intercept('POST', '**/auth/validate', {
            statusCode: 401,
            body: {
                error: 'Invalid credentials'
            }
        }).as('loginWrongPassword')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.get('input[name="username"]')
            .type('Admin')

        cy.get('input[name="password"]')
            .type('password123')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@loginWrongPassword')

        cy.contains('Invalid credentials')
            .should('be.visible')
    })


    // =========================================================
    // TC-03
    // Login dengan username tidak terdaftar
    // =========================================================
    it('TC-03 - Login dengan username tidak terdaftar', () => {

        cy.intercept('POST', '**/auth/validate', {
            statusCode: 401,
            body: {
                error: 'Invalid credentials'
            }
        }).as('unregisteredUser')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.get('input[name="username"]')
            .type('UserTidakTerdaftar')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@unregisteredUser')
            .its('response.statusCode')
            .should('eq', 401)

        cy.contains('Invalid credentials')
            .should('be.visible')
    })


    // =========================================================
    // TC-04
    // Login dengan username kosong
    // =========================================================
    it('TC-04 - Login dengan username kosong', () => {

        cy.intercept('GET', '**/web/index.php/auth/login').as('loginPage')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.wait('@loginPage')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.get('input[name="username"]')
            .parent()
            .should('contain', 'Required')
    })


    // =========================================================
    // TC-05
    // Login dengan password kosong
    // =========================================================
    it('TC-05 - Login dengan password kosong', () => {

        cy.intercept('GET', '**/web/index.php/auth/login*', {
            statusCode: 200
        }).as('passwordEmptyPage')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.wait('@passwordEmptyPage')

        cy.get('input[name="username"]')
            .type('Admin')

        cy.get('button[type="submit"]')
            .click()

        cy.get('input[name="password"]')
            .parent()
            .should('contain', 'Required')
    })


    // =========================================================
    // TC-06
    // Login dengan username dan password kosong
    // =========================================================
    it('TC-06 - Login dengan username dan password kosong', () => {

        cy.intercept('GET', '**/web/index.php/auth/login*')
            .as('emptyCredentialPage')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.wait('@emptyCredentialPage')

        cy.get('button[type="submit"]')
            .click()

        cy.get('input[name="username"]')
            .parent()
            .should('contain', 'Required')

        cy.get('input[name="password"]')
            .parent()
            .should('contain', 'Required')
    })


    // =========================================================
    // TC-07
    // Login dengan username menggunakan spasi
    // =========================================================
    it('TC-07 - Login dengan username menggunakan spasi di awal dan akhir', () => {

        cy.intercept('POST', '**/auth/validate', {
            statusCode: 401,
            body: {
                error: 'Invalid credentials'
            }
        }).as('spaceUsername')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.get('input[name="username"]')
            .type('  Admin  ')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@spaceUsername')

        cy.contains('Invalid credentials')
            .should('be.visible')
    })


    // =========================================================
    // TC-08
    // Password tersembunyi saat diketik
    // =========================================================
    it('TC-08 - Password bersifat tersembunyi saat diketik', () => {

        cy.intercept('GET', '**/web/index.php/auth/login*')
            .as('passwordVisibilityPage')

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.wait('@passwordVisibilityPage')

        cy.get('input[name="password"]')
            .type('admin123')
            .should('have.attr', 'type', 'password')
    })

})