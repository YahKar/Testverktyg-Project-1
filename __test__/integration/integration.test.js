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
});