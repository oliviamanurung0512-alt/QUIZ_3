describe('OrangeHRM - Login Feature', () => {

    beforeEach(() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })

    // TC-01
    it('Login dengan username dan password valid', () => {
        cy.get('input[name="username"]')
            .should('be.visible')
            .type('Admin')

        cy.get('input[name="password"]')
            .should('be.visible')
            .type('admin123')

        cy.get('button[type="submit"]')
            .should('be.visible')
            .click()

        cy.url().should('include', '/dashboard')
        cy.contains('Dashboard').should('be.visible')
    })

    // TC-02
    it('Login dengan username valid dan password salah', () => {
        cy.get('input[name="username"]')
            .type('Admin')

        cy.get('input[name="password"]')
            .type('password123')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Invalid credentials').should('be.visible')
    })

    // TC-03
    it('Login dengan username tidak terdaftar', () => {
        cy.get('input[name="username"]')
            .type('UserTidakTerdaftar')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Invalid credentials').should('be.visible')
    })

    // TC-04
    it('Login dengan username kosong', () => {
        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Required').should('be.visible')
    })

    // TC-05
    it('Login dengan password kosong', () => {
        cy.get('input[name="username"]')
            .type('Admin')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Required').should('be.visible')
    })

    // TC-06
    it('Login dengan username dan password kosong', () => {
        cy.get('button[type="submit"]')
            .click()

        cy.get('input[name="username"]')
            .parent()
            .should('contain', 'Required')

        cy.get('input[name="password"]')
            .parent()
            .should('contain', 'Required')
    })

    // TC-07
    it('Login dengan username menggunakan spasi di awal dan akhir', () => {
        cy.get('input[name="username"]')
            .type('  Admin  ')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Invalid credentials').should('be.visible')
    })

    // TC-08
    it('Password bersifat tersembunyi saat diketik', () => {
        cy.get('input[name="password"]')
            .type('admin123')
            .should('have.attr', 'type', 'password')
    })

    // TC-09
    it('Menampilkan dan menyembunyikan password jika fitur tersedia', () => {
        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password')

        cy.get('.oxd-icon-button')
            .last()
            .click()

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'text')

        cy.get('.oxd-icon-button')
            .last()
            .click()

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password')
    })

    // TC-10
    it('Tombol Login aktif dan dapat diklik', () => {
        cy.get('button[type="submit"]')
            .should('be.visible')
            .and('contain', 'Login')
            .and('not.be.disabled')

        cy.get('input[name="username"]')
            .type('Admin')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.url().should('include', '/dashboard')
    })

    // TC-11
    it('Login dengan perubahan kapitalisasi username', () => {
        cy.get('input[name="username"]')
            .type('admin')

        cy.get('input[name="password"]')
            .type('admin123')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Invalid credentials').should('be.visible')
    })

    // TC-12
    it('Login dengan password sangat pendek', () => {
        cy.get('input[name="username"]')
            .type('Admin')

        cy.get('input[name="password"]')
            .type('123')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Invalid credentials').should('be.visible')
    })

})