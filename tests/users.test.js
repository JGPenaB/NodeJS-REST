const request = require("supertest");
const app = require("../driver");

describe("Testing api/users endpoint", () => {
    
    it("Expecting JSON response", (done) => {
        request(app)
        .patch("/users")
        .expect("Content-Type", /json/)
        .end(done);
    });

    it("Expecting 405 from PATCH method",  (done) => {
        request(app)
        .patch("/users")
        .expect(405)
        .end(done);
    });

});