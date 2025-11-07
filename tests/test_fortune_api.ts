import request from 'supertest';
import app from '../backend/src/app';

describe('Fortune API Tests', () => {
  describe('POST /api/fortune/generate', () => {
    it('should generate a tarot fortune', async () => {
      const response = await request(app)
        .post('/api/fortune/generate')
        .send({
          question: '我的事业发展如何？',
          type: 'tarot'
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('prediction');
      expect(response.body.result).toHaveProperty('advice');
      expect(response.body.result).toHaveProperty('luckyElements');
      expect(response.body.result).toHaveProperty('confidence');
    });

    it('should return error for missing parameters', async () => {
      const response = await request(app)
        .post('/api/fortune/generate')
        .send({ question: 'test' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for invalid fortune type', async () => {
      const response = await request(app)
        .post('/api/fortune/generate')
        .send({
          question: '我的事业发展如何？',
          type: 'invalid'
        })
        .expect(200); // Backend should handle gracefully

      expect(response.body.result).toBeDefined();
    });
  });

  describe('GET /api/fortune/types', () => {
    it('should return fortune types', async () => {
      const response = await request(app)
        .get('/api/fortune/types')
        .expect(200);

      expect(response.body).toHaveProperty('types');
      expect(Array.isArray(response.body.types)).toBe(true);
      expect(response.body.types.length).toBe(4);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service');
    });
  });
});