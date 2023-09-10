// REQUIRE
let request = require("supertest");
require("chai").should();

//MY URL FOR REQUEST
request = request("http://localhost:3000");

//TEST FOR USER
describe("USER", () => {
  let token;
  let userId;
  it("créer un user", () => {
    return request
      .post("/user")
      .send({
        pseudo: "AnnyDoe",
        email: "annydoe3@gmail.com",
        password: "MdpSecure1!",
      })
      .expect(200)
      .then((response) => {
        const user = response.body;

        // est-ce un objet ?
        user.should.be.an("object");

        // les clefs
        user.should.have.property("id");
        user.should.have.property("pseudo");
        user.should.have.property("email");
      });
  });

  it("logger un user", () => {
    return request
      .post("/user/login")
      .send({
        mail: "annydoe3@gmail.com",
        password: "MdpSecure1!",
      })
      .expect(200)
      .then((response) => {
        const user = response.body;

        // est-ce un objet ?
        user.should.be.an("object");

        // les clefs
        user.should.have.property("logged");
        user.should.have.property("id");
        user.should.have.property("token");

        token = user.token;
        userId = user.id;
      });
  });

  it("récupérer un user", () => {
    return request
      .get(`/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        const user = response.body;

        // est-ce un objet ?
        user.should.be.an("object");

        // les clefs
        user.should.have.property("id");
        user.should.have.property("pseudo");
        user.should.have.property("email");
      });
  });

  it("modifier un user", () => {
    return request
      .patch(`/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: userId,
        pseudo: "TotoDoe",
        email: "totodoe2@gmail.com",
      })
      .expect(200)
      .then((response) => {
        const user = response.body;

        // est-ce un objet ?
        user.should.be.an("object");

        // vérification des clefs
        user.should.have.property("id");
        user.should.have.property("pseudo");
        user.should.have.property("email");
        // vérification des valeurs
        user.pseudo.should.equal("TotoDoe");
        user.mail.should.equal("totodoe2@gmail.com");
      });
  });

  it("supprimer un user", () => {
    return request
      .delete(`/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});
