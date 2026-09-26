const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com', // <-- Tambahkan baris ini di sini
    pageLoadTimeout: 120000, // Menaikkan batas waktu load page menjadi 120 detik
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});