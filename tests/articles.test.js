const request = require("supertest");
const app = require("../driver");

describe("Testing api/articles endpoint", () => {

    it("GET /articles: Expecting JSON response", (done) => {
        request(app)
        .get("/articles")
        .expect("Content-Type", /json/)
        .end(done);
    });

    it("GET /articles: Expecting correct format from JSON response", (done) => {
        request(app)
        .get("/articles")
        .expect( (res) =>{
            let data = res.body.data[0];
            if(!("Title" in data))
                throw new Error("Title field is missing from response.");
            if(!("Slug" in data))
                throw new Error("Slug field is missing from response.");
            if(!("authorData" in data))
                throw new Error("authorData field is missing from response.");
            if(!("Links" in data))
                throw new Error("Links field is missing from response.");

            let author = data.authorData;
            if(!("firstName" in author))
                throw new Error("firstName field is missing from author information.");
            if(!("lastName" in author))
                throw new Error("lastName field is missing from author information.");
            if(!("email" in author))
                throw new Error("email field is missing from author information.");
        })
        .end(done);
    });

    it("POST /articles: Expecting status 201 for successful creation", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist1@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist1@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/articles")
                .send({
                    title: "Practical guide for integration testing",
                    slug: "Integration tests made easy",
                    content: "Lorem ipsum dolor sit amet"
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(201)
                .end(done);
            })
        });
    });

    it("PUT /articles/1: Expecting status 403 for attempting to update a foreign article", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist2@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist2@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .put("/articles/1")
                .send({
                    title: "This is",
                    slug: "going to",
                    content: "fail"
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(403)
                .end(done);
            })
        });
    });


    it("PUT /articles/999: Expecting status 404 for updating an non-existent article", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist3@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist3@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .put("/articles/999")
                .send({
                    title: "This is",
                    slug: "going to",
                    content: "fail"
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(404)
                .end(done);
            })
        });
    });


    it("PUT /articles/id: Expecting status 200 for successful update", (done) => {
        let token = "";
        let articleID = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist4@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist4@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/articles")
                .send({
                    title: "Old title",
                    slug: "Old slug",
                    content: "Old content"
                })
                .set("Authorization",token)
                .expect((res) => {
                    articleID = res.body.data.id;
                })
                .end(() => {
                    request(app)
                    .put("/articles/"+articleID)
                    .send({
                        title: "New title",
                        slug: "New slug",
                        content: "New text"
                    })
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization",token)
                    .expect(200)
                    .end(done);
                });
            });
        });
    });


    it("DELETE /articles/1: Expecting status 403 for attempting to delete a foreign article", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist5@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist5@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .delete("/articles/1")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(403)
                .end(done);
            });
        });
    });

    it("DELETE /articles/id: Expecting status 200 for successful deletion", (done) => {
        let token = "";
        let articleID = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist6@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist6@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/articles")
                .send({
                    title: "Old title",
                    slug: "Old slug",
                    content: "Old content"
                })
                .set("Authorization",token)
                .expect((res) => {
                    articleID = res.body.data.id;
                })
                .end(() => {
                    request(app)
                    .delete("/articles/"+articleID)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization",token)
                    .expect(200)
                    .end(done);
                });
            });
        });
    });

    it("DELETE /articles/id: Expecting status 404 after successful deletion", (done) => {
        let token = "";
        let articleID = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "Mike",
            lastName: "Journo",
            email: "journalist6@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "journalist6@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/articles")
                .send({
                    title: "Old title",
                    slug: "Old slug",
                    content: "Old content"
                })
                .set("Authorization",token)
                .expect((res) => {
                    articleID = res.body.data.id;
                })
                .end(() => {
                    request(app)
                    .delete("/articles/"+articleID)
                    .set("Authorization",token)
                    .end(() => {
                        request(app)
                        .delete("/articles/"+articleID)
                        .set("Content-Type", "application/json")
                        .set("Accept", "application/json")
                        .set("Authorization",token)
                        .expect(404)
                        .end(done);
                    });
                });
            });
        });
    });
    
});