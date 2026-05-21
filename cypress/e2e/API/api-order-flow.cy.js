describe("API Order flow", () => {
  it("should login and get token", () => {
    cy.request({
      method: "POST",
      url: "https://dummyjson.com/auth/login",
      body: {
        username: "standard_user",
        password: "secret_sauce",
      }.then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.be.empty;
        expect(response.body.token).to.exist;

        const token = response.body.token;

        cy.request({
          method: "POST",
          url: "https://dummyjson.com/posts/add",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            title: "Test Order",
            body: "Order created via API test",
            userId: 1,
          }.then((orderResponse) => {
            expect(orderResponse.status).to.eq(201);
            expect(orderResponse.body.id).to.exist;
            expect(orderResponse.body.title).to.eq("Test Order");
            expect(orderResponse.body.userId).to.eq(1);

            const orderId = orderResponse.body.id;

            cy.request({
              method: "GET",
              url: `https://dummmyjson.com/posts/${orderId}`,
            })

              .then((getResponse) => {
                expect(getResponse.status).to.eq(200);
                expect(getResponse.body.id).to.eq(orderId);
                expect(getResponse.body.userId).to.eq(1);
              });
          }),
        });
      }),
    });
    cy.visit("https://www.saucedemo.com");

    cy.get("#user-name").type("standard_user");
    cy.get("#password").type("secret_sauce");
    cy.get("#login-button").click();
  });
  it("should not create order without token", () => {
    cy.request({
      method: "POST",
      url: "https://dummyjson.com/posts/add",
      body: {
        title: "Test Order",
        body: "Order created via API test",
        userId: 1,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.exist;
      expect(response.body.message.toLowerCase()).to.include("unauthorized");
      expect(response.body).to.not.have.property("id");
    });
  });
});
