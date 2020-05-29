const request = require("supertest");
const app = require("../driver");

describe("Testing api/login endpoint", () => {

    it("GET /login: Expecting JSON response", (done) => {
        request(app)
        .get("/login")
        .expect("Content-Type", /json/)
        .end(done);
    });

    it("PATCH /login: Expecting status 405 for incorrect method",  (done) => {
        request(app)
        .patch("/login")
        .expect(405)
        .end(done);
    });

    it("POST /login: Expecting status 401 for failed login (either wrong email or password)", (done) => {
        request(app)
        .post("/login")
        .send({
            email: "nonexistent@at.com",
            password: "wrong!",
        })
        .expect(401)
        .end(done);
    });

    it("POST /login: Expecting status 401 for wrong password", (done) => {
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "duplicate@at.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "duplicate@at.com",
                password: "wrong",
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .expect(401)
            .end(done);
        });
    });

    it("POST /login: Expecting status 200 for successful login", (done) => {
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "duplicate@at.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "duplicate@at.com",
                password: "testing!",
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .expect(200)
            .end(done);
        });
    });


});