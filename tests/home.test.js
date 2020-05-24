const request = require('supertest');
const app = require("../driver");

test('Expecting json response', async () => {
    
    await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);
});