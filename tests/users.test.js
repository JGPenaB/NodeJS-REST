const request = require("supertest");
const app = require("../driver");

describe("Testing api/users endpoint", () => {

    it("GET /users: Expecting JSON response", (done) => {
        request(app)
        .get("/users")
        .expect("Content-Type", /json/)
        .end(done);
    });


    it("GET /users: Expecting correct format from JSON response", (done) => {
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

    it("PATCH /users: Expecting status 405 for incorrect method",  (done) => {
        request(app)
        .patch("/users")
        .expect(405)
        .end(done);
    });

    it("PATCH /users: Expecting correct format for error response",  (done) => {
        request(app)
        .patch("/users")
        .expect(405)
        .expect("Allow", "HEAD, GET, POST")
        .expect( (res) => {
            let body = res.body;
            if(body.title !== "Method not allowed")
                throw new Error(`Title field does not match the expected format.
                Expected: 
                Method not allowed

                Got: 
                ${body.title}`);
            if(body.detail !== "The method PATCH is not allowed for this resource")
                throw new Error(`The detail field does not match the expected format.
                Expected: 
                The method PATCH is not allowed for this resource

                Got: 
                ${body.detail}`);
        })
        .end(done);
    });


    it("POST /users: Expecting status 201", (done) => {
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "email@at.com",
            password: "testing!",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .end(done);
    });


    it("POST /users: Expecting status 409 for duplicate data", (done) => {
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
            .post("/users")
            .send({
                firstName: "testing POST",
                lastName: "for users endpoint",
                email: "duplicate@at.com",
                password: "testing!",
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .expect(409)
            .end(done);
        });
    });



    it("PUT /users/1: Expecting status 403 for attempting to modify another user", (done) => {
        let token = "empty";
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "PUT1@at.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "PUT1@at.com",
                password: "testing!",
            })
            .expect( (res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .put("/users/1")
                .send({
                    firstName: "updated first name",
                    lastName: "updated last name",
                    email: "updated@at.com",
                    password: "newpassword",
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(403)
                .end(done);
            });
        });
    });


    it("PUT /users/id: Expecting status 409 for using an already existing email", (done) => {
        let token = "empty";
        let id = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "PUT2@at.com",
            password: "testing!",
        })
        .expect( (res) => {
            id = res.body.data.id;
        })
        .end(() => {
            //Registra a otro usuario
            request(app)
            .post("/users")
            .send({
                firstName: "testing POST",
                lastName: "for users endpoint",
                email: "PUT3@at.com",
                password: "testing!",
            })
            .end(() => {
                //Accede al sistema para obtener el token
                request(app)
                .post("/login")
                .send({
                    email: "PUT2@at.com",
                    password: "testing!",
                })
                .expect( (res) => {
                    token = res.body.data.token;
                })
                .end(() => {
                    //Actualiza usando un correo existente
                    request(app)
                    .put("/users/"+id)
                    .send({
                        firstName: "updated first name",
                        lastName: "updated last name",
                        email: "PUT3@at.com",
                        password: "newpassword",
                    })
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization",token)
                    .expect(409)
                    .end(done);
                });
            })
        });
    });


    it("PUT /users/id: Expecting status 200 for successful update", (done) => {
        let token = "empty";
        let id = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "PUT4@at.com",
            password: "testing!",
        })
        .expect( (res) => {
            id = res.body.data.id;
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "PUT4@at.com",
                password: "testing!",
            })
            .expect( (res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .put("/users/"+id)
                .send({
                    firstName: "updated first name",
                    lastName: "updated last name",
                    email: "updated@at.com",
                    password: "newpassword",
                })
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(200)
                .end(done);
            });
        });
    });

    it("DELETE /users/id: Expecting status 200 for successful deletion", (done) => {
        let token = "empty";
        let id = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "DEL1@at.com",
            password: "testing!",
        })
        .expect( (res) => {
            id = res.body.data.id;
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "DEL1@at.com",
                password: "testing!",
            })
            .expect( (res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .delete("/users/"+id)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(200)
                .end(done);
            });
        });
    });

    it("DELETE /users/id: Expecting status 404 after deletion", (done) => {
        let token = "empty";
        let id = 0;
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "DEL1@at.com",
            password: "testing!",
        })
        .expect( (res) => {
            id = res.body.data.id;
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "DEL1@at.com",
                password: "testing!",
            })
            .expect( (res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .delete("/users/"+id)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .end(() => {
                    request(app)
                    .delete("/users/"+id)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set("Authorization",token)
                    .expect(404)
                    .end(done);
                });
            });
        });
    });

    it("DELETE /users/1: Expecting status 403 for attempting to delete another user", (done) => {
        let token = "empty";
        request(app)
        .post("/users")
        .send({
            firstName: "testing POST",
            lastName: "for users endpoint",
            email: "DEL2@at.com",
            password: "testing!",
        })
        .end(() => {
            request(app)
            .post("/login")
            .send({
                email: "DEL2@at.com",
                password: "testing!",
            })
            .expect( (res) => {
                token = res.body.data.token;
            })
            .end(() => {
                request(app)
                .delete("/users/1")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization",token)
                .expect(403)
                .end(done);
            });
        });
    });

});