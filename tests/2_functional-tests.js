const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');



chai.use(chaiHttp);

suite("Functional Tests", function() {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: "" }) // Missing puzzle string
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });
  test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: "12a456789456789123789123456234567891567891234891234567345678912678912345912345678" })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: "12345678945678912378912345623456789156789123489123456734567891267891234591234567" })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678" }) // An unsolvable puzzle
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        coordinate: "A1",
        value: "1",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        coordinate: "A1",
        value: "2", // Conflict with the initial puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
        value: "6", // Conflict with the initial puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.deepStrictEqual(res.body.conflict, ["column", "region"]);
        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        coordinate: "A1",
        value: "2", // Conflict with the initial puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.deepStrictEqual(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        value: "1", // Missing coordinate field
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        coordinate: "A1",
        value: "x", // Invalid character
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "1234567894567891237891234562345678915678912348912345673456789126789123459123456", // Invalid length
        coordinate: "A1",
        value: "1",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        coordinate: "A10", // Invalid coordinate
        value: "1",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: "123456789456789123789123456234567891567891234891234567345678912678912345912345678",
        coordinate: "A1",
        value: "10", // Invalid value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        done();
      });
  });


});
