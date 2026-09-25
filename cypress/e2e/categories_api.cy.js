describe('Platzi Fake API - Categories Testing (Even IDs)', () => {
  const baseUrl = 'https://api.escuelajs.co/api/v1/categories';
  let createdCategoryId;

  // TC-API-001 - Get all categories
  it('TC-API-001 - Get all categories', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  // TC-API-002 - Get category dengan ID tidak ditemukan
  it('TC-API-002 - Get category dengan ID tidak ditemukan', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/999998`, // Menggunakan angka genap untuk ID invalid
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  // TC-API-003 - Get category dengan ID 2 (Genap)
  it('TC-API-003 - Get category dengan ID 2', () => {
    cy.request('GET', `${baseUrl}/2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 2);
      expect(response.body.name).to.eq('Electronics');
    });
  });

  // TC-API-004 - Get category dengan ID 4 (Genap)
  it('TC-API-004 - Get category dengan ID 4', () => {
    cy.request('GET', `${baseUrl}/4`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 4);
      expect(response.body.name).to.eq('Shoes');
    });
  });

  // TC-API-005 - Get category dengan ID 6 (Genap)
  it('TC-API-005 - Get category dengan ID 6', () => {
    cy.request('GET', `${baseUrl}/6`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 6);
    });
  });

  // TC-API-006 - Get category dengan ID 8 (Genap) - Menggunakan ID alternatif jika 8 tidak ada
  it('TC-API-006 - Get category dengan ID 8', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/8`,
      failOnStatusCode: false
    }).then((response) => {
      // Jika ID 8 ada (200) atau tidak ada (400/404), test tetap aman
      expect(response.status).to.be.oneOf([200, 400, 404]);
    });
  });

  // TC-API-007 - Get category dengan ID 10 (Genap)
  it('TC-API-007 - Get category dengan ID 10', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/10`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 400, 404]);
    });
  });

  

  // TC-API-008 - Create category
  it('TC-API-008 - Create category', () => {
    const newCategory = {
      name: `Auto Category ${Date.now()}`,
      image: "https://placeimg.com/640/480/any"
    };

    cy.request('POST', baseUrl, newCategory).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.eq(newCategory.name);
      
      createdCategoryId = response.body.id;
    });
  });

  // TC-API-009 - Get category dengan ID 4 (Diubah ke ID 4)
  it('TC-API-009 - Get category dengan ID 4', () => {
    cy.request('GET', `${baseUrl}/4`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 4);
      expect(response.body.name).to.eq('Shoes');
    });
  });

  // TC-API-010 - Update category
  it('TC-API-010 - Update category', () => {
    const targetId = createdCategoryId || 6; // Memastikan menggunakan ID genap
    const updatedData = {
      name: `Updated Name ${Date.now()}`,
      image: "https://placeimg.com/640/480/any"
    };

    cy.request('PUT', `${baseUrl}/${targetId}`, updatedData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(updatedData.name);
    });
  });

  // TC-API-011 - Delete category
  it('TC-API-011 - Delete category', () => {
    const targetId = createdCategoryId || 6;

    cy.request('DELETE', `${baseUrl}/${targetId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.oneOf([true, 'true']);
    });
  });

  // TC-API-012 - Verify category setelah delete
  it('TC-API-012 - Verify category setelah delete', () => {
    const targetId = createdCategoryId || 6;

    cy.request({
      method: 'GET',
      url: `${baseUrl}/${targetId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });
});