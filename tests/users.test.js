const request = require("supertest");
const app = require("../driver");

describe("Testing api/users endpoint", () => {

    it("Expecting JSON response", (done) => {
        request(app)
        .get("/users")
        .expect("Content-Type", /json/)
        .end(done);
    });

    it("Expecting correct format from JSON", (done) => {
        request(app)
        .get("/users")
        .expect( (res) =>{
            let data = res.body.data[0];
            if(!("email" in data))
                throw new Error("Email field is missing from response.");
            if(!("firstName" in data))
                throw new Error("firstName field is missing from response.");
            if(!("lastName" in data))
                throw new Error("lastName field is missing from response.");
        })
        .end(done);
    });

    it("Expecting 405 from PATCH method",  (done) => {
        request(app)
        .patch("/users")
        .expect(405)
        .expect("Allow", "GET, POST")
        .expect( (res) => {
            let body = res.body.data;
            if(body.content !== "Method not allowed")
                throw new Error("Content field does not contain the description of the error code.");
            if(body.method !== "PATCH")
                throw new Error("Method field does not match the used method.");
        })
        .end(done);
    });

});