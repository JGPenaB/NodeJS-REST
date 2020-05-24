const request = require('supertest');
const app = require("../driver");

test('Expecting json response', async () => {
    
    await request(app)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/);
});

test('Expecting user with ID field', async () => {
    
    await request(app)
        .get('/users/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(200,{content: "Usuario 1", id:"1"});
});