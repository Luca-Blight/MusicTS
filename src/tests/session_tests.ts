import request from 'supertest';
import app from '../app'; // Import your Express app
import { SessionDocument } from '../db/models/session'; // Import your Session model

describe('Session Routes', () => {
  beforeEach(async () => {
    // Clear the Session collection before each test
    await SessionDocument.deleteMany({});
  });

  test('GET /api/sessions should return an empty array when no sessions exist', async () => {
    const response = await request(app).get('/api/sessions');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/sessions should create a new session', async () => {
    const sessionData = { name: 'TestSession' };
    const response = await request(app).post('/api/sessions').send(sessionData);
    expect(response.status).toBe(201);

    const createdSession = await SessionDocument.findOne({
      name: sessionData.name,
    });
    expect(createdSession).not.toBeNull();
    expect(createdSession?.name).toBe(sessionData.name);
  });

  // Add more test cases for other session routes
});
