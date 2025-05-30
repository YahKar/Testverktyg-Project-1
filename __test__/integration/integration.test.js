const mockQuery = jest.fn(); // create a fake function

jest.mock('../../database', () => ({  // This tells jest to replace our real database 
  __esModule: true,
  default: { query: mockQuery },
  query: mockQuery
}));

const request = require('supertest');
const server = require('../../server'); // Import the Express server
const db = require('../../database'); // Import the mocked database

describe('User routes with fake DB', function() {
    beforeEach(function() {
        mockQuery.mockReset(); // clears all previous mock data
    });

    test('GET /users should return users', async function() {
        mockQuery.mockImplementation(function(query, callback) {
            callback(null, [
                { id: 1, Name: "Patrik", Nickname: "Pat", Age: 33, Bio: "Teacher" }
            ]);
        });

        const res = await request(server).get('/users'); // makes a GET / users request
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Patrik');
    });

    test('POST /create should insert a user', async function() {
        mockQuery.mockImplementation(function(query, params, callback) {
            callback(null, { affectedRows: 1 });// AffectedRows:1 means one row(user) was inserted (added)
        });

        const res = await request(server)
            .post('/create') // This sends a POST /create request with form data not json
            .type('form') // Tells supertest to send the request body as url-encoded form data not json 
            .send({
                Name: 'Abdo',
                Nickname: 'Abdel',
                Age: 38,
                Bio: 'CAD',
            });

        expect(res.statusCode).toBe(302); // 302= standard HTTP status for redirection
        expect(res.headers.location).toBe('/users'); // confirms that the redirect went to the correct location /users
    });

    test('GET /users/:id should return single user', async function() { // simulates returning one user for /users/1
        mockQuery.mockImplementation(function(query, params, callback) {
            callback(null, [
                { id: params[0], Name: "Patrik", Nickname: "Pat", Age: 33, Bio: "Teacher" }
            ]);
        });

        const res = await request(server).get('/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Patrik')
    });

    test('PUT /users/:id should update user', async function() { // simulates a PUT request using method override
        mockQuery.mockImplementation(function(query, params, callback) {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(server)
        .post('/users/1?_method=PUT')
        .type('form')
        .send({ // the data we want to update the user with
            Name: 'Durga',
            Nickname: 'Divya',
            Age: 33,
            Bio: 'Tester'
        });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/users/1');
    });

    test('DELETE /users/:id should delete user', async function() { // simulates deleting a user via DELETE 
        mockQuery.mockImplementation(function(query, params, callback) {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(server)
        .post('/users/1?_method=DELETE');

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/users');
    });

});