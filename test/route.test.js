const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("../server/server");

describe("POST /api/user/register", () => {
  it("should respond with a success message", done => {
    chai
      .request(server)
      .post("/api/user/register")
      .send({
        firstName: "test",
        lastName: "table",
        email: "test@gmail.com",
        password: "testsecret"
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        done();
      });
  });
});

describe("POST /api/user/login", () => {
  it("should login to selected user", done => {
    chai
      .request(server)
      .post("/api/user/login")
      .send({
        email: "test@gmail.com",
        password: "testsecret"
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        done();
      });
  });
});
