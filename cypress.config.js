const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    pageLoadTimeout: 120000, // Menaikkan batas waktu load page menjadi 120 detik
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});