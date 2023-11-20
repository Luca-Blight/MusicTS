import request from 'supertest';
import app from '../app'; // Import your Express app
import { UserDocument } from '../db/models/user'; // Import your User model

describe('User Routes', () => {
  beforeEach(async () => {
    // Clear the User collection before each test
    await UserDocument.deleteMany({});
  });

  test('GET /api/users should return an empty array when no users exist', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/users should create a new user', async () => {
    const userData = { username: 'TestUser', email: 'test@example.com' };
    const response = await request(app).post('/users').send(userData);
    expect(response.status).toBe(201);

    const createdUser = await UserDocument.findOne({ email: userData.email });
    expect(createdUser).not.toBeNull();
    expect(createdUser?.userName).toBe(userData.username);
  });

  // Add more test cases for other user routes
});
