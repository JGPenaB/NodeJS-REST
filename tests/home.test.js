const request = require("supertest");
const app = require("../driver");

describe("Testing api/ endpoint", () => {
    
    it("Expecting JSON response", (done) => {
        request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .end(done);
    });
});