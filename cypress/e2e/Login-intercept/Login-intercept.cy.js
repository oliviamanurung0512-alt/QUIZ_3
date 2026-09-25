describe('OrangeHRM - Login Feature with Intercepts', () => {

    beforeEach(() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })

    // TC-01: Intercept API/Request login sukses dengan penanganan redirect yang benar
    it('TC-01: Login dengan username dan password valid', () => {
        // Intercept ke endpoint proses login
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginValid')

        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        // Menunggu request intercept selesai diproses
        cy.wait('@loginValid')

        // Menambahkan timeout kustom agar Cypress menunggu proses redirect ke dashboard selesai
        cy.url({ timeout: 10000 }).should('include', '/dashboard')
        cy.contains('Dashboard', { timeout: 10000 }).should('be.visible')
    })

    // TC-02: Intercept request login gagal (password salah)
    it('TC-02: Login dengan username valid dan password salah', () => {
        cy.intercept('POST', '**/auth/validate*').as('loginWrongPassword')

        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('password123')
        cy.get('button[type="submit"]').click()

        cy.wait('@loginWrongPassword')
        cy.contains('Invalid credentials').should('be.visible')
    })

    // TC-03: Intercept endpoint CSS app utama (unik untuk TC-03 tanpa cy.wait yang memblokir)
    it('TC-03: Login dengan username tidak terdaftar', () => {
        cy.intercept('GET', '**/web/dist/css/app.css*').as('appCssIntercept')

        cy.get('input[name="username"]').type('UserTidakTerdaftar')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible')
    
     })      
        
    // TC-04: Login dengan username kosong
    it('TC-04: Login dengan username kosong', () => {
        cy.intercept('GET', '**/web/images/favicon.ico*').as('faviconIntercept')

        // Membersihkan kolom username secara total dari autofill browser
        cy.get('input[name="username"]')
            .click()
            .clear()
            .invoke('val', '')
            .trigger('input', { force: true })
            .trigger('change', { force: true })
        
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()    

        cy.contains('Required').should('be.visible')
    })

    // TC-05: Login dengan password kosong
    it('TC-05: Login dengan password kosong', () => {
        cy.intercept('GET', '**/web/images/ohrm_branding.png*').as('brandingIntercept')

        cy.get('input[name="username"]').type('Admin')
        
        // Membersihkan kolom password secara total dari autofill browser
        cy.get('input[name="password"]')
            .click()
            .clear()
            .invoke('val', '')
            .trigger('input', { force: true })
            .trigger('change', { force: true })
        
        cy.get('button[type="submit"]').click()

        cy.contains('Required').should('be.visible')
    })



    // TC-06: Intercept CSS theme dengan url berbeda (vendor.css) tanpa cy.wait
    it('TC-06: Login dengan username menggunakan spasi di awal dan akhir', () => {
        cy.intercept('GET', '**/web/dist/css/vendor.css*').as('vendorCssTC7')

        cy.get('input[name="username"]').type('  Admin  ')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        cy.contains('Invalid credentials').should('be.visible')
    })

    // TC-07: Intercept file JavaScript utama (app.js) saat cek elemen password tanpa cy.wait
    it('TC-07: Password bersifat tersembunyi saat diketik', () => {
        cy.intercept('GET', '**/web/dist/js/app.js*').as('jsAppCheckTC8')

        cy.get('input[name="password"]')
            .type('admin123')
            .should('have.attr', 'type', 'password')

    })



    // TC-08: Tombol Login aktif dan dapat diklik
    it('TC-08: Tombol Login aktif dan dapat diklik', () => {
        cy.intercept('GET', '**/web/dist/js/app.js*').as('appJsIntercept')

        cy.get('button[type="submit"]')
            .should('be.visible')
            .and('not.be.disabled')
            .and('contain', 'Login')

        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        cy.url({ timeout: 10000 }).should('include', '/dashboard')
    })
})