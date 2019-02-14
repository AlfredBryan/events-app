const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("../server/server");

describe("Root api", () => {
  it("should respond with welcome message", done => {
    chai
      .request(server)
      .get("/*")
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        done();
      });
  });
});
