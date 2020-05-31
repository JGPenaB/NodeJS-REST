const request = require("supertest");
const app = require("../driver");

describe("Testing api/comments endpoint", () => {

    it("GET /comments: Expecting JSON response", (done) => {
        request(app)
        .get("/comments")
        .expect("Content-Type", /json/)
        .end(done);
    });

    it("GET /comments: Expecting correct format from JSON response", (done) => {
        request(app)
        .get("/comments")
        .expect( (res) =>{
            let data = res.body.data[0];
            if(!("Content" in data))
                throw new Error("Content field is missing from response.");
            if(!("User" in data))
                throw new Error("User field is missing from response.");
            if(!("Article" in data))
                throw new Error("Article field is missing from response.");
            if(!("Links" in data))
                throw new Error("Links field is missing from response.");

            let author = data.User;
            if(!("firstName" in author))
                throw new Error("firstName field is missing from author information.");
            if(!("lastName" in author))
                throw new Error("lastName field is missing from author information.");
            if(!("email" in author))
                throw new Error("email field is missing from author information.");

            let article = data.Article;
            if(!("Title" in article))
                throw new Error("Title field is missing from article information.");
            if(!("Slug" in article))
                throw new Error("lastName field is missing from article information.");
        })
        .end(done);
    });

    it("POST /comments: Expecting status 201 for successful creation", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment1@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment1@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/comments")
                .send({
                    content: "Many thanks for the info, I was struggling with Node!",
                    article: 1,
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(201)
                .end(done);
            })
        });
    });


    it("PUT /comments/1: Expecting status 403 for attempting to update a foreign comment", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment2@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment2@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .put("/comments/1")
                .send({
                    content: "I should fail"
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(403)
                .end(done);
            })
        });
    });

    it("PUT /comments/999: Expecting status 404 for attempting to update a non-existent comment", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment3@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment3@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .put("/comments/999")
                .send({
                    content: "I should fail"
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(404)
                .end(done);
            })
        });
    });


    it("PUT /comments/id: Expecting status 200 for successful update", (done) => {
        let token = "";
        let id = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment4@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment4@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/comments")
                .send({
                    content: "I don't like this article",
                    article: 1,
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect((res) => {
                    id = res.body.data.id;
                })
                .end(() => {
                    request(app)
                    .put("/comments/"+id)
                    .send({
                        content: "NVM, I like it"
                    })
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization",token)
                    .expect(200)
                    .end(done);
                });
            })
        });
    });


    it("DELETE /comments/1: Expecting status 403 for attempting to delete a foreign comment", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment5@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment5@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .delete("/comments/1")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(403)
                .end(done);
            })
        });
    });


    it("DELETE /comments/999: Expecting status 404 for attempting to delete a non-existent comment", (done) => {
        let token = "";
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment6@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment6@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .delete("/comments/999")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(404)
                .end(done);
            })
        });
    });


    it("DELETE /comments/id: Expecting status 200 for successful deletion", (done) => {
        let token = "";
        let id = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "Lucas",
            lastName: "Cena",
            email: "comment7@email.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "comment7@email.com",
                password: "testing!",
            })
            .expect((res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .post("/comments")
                .send({
                    content: "I don't like this article",
                    article: 1,
                })
                .set("Authorization",token)
                .expect((res) => {
                    console.log(res);
                    id = res.body.data.id;
                })
                .end(() => {
                    console.log("ID: "+id);
                    request(app)
                    .delete("/comments/"+id)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization",token)
                    .expect(200)
                    .end(done);
                });
            })
        });
    });
    
});