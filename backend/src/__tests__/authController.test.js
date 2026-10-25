import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../models/User.js';
import authService from '../services/authService.js';
import { login } from '../controllers/authController.js';

const { describe, it } = test;

describe('authController login', () => {
  it('accepts username as loginId', async () => {
    const password = 'secret123';
    const passwordHash = await authService.hashPassword(password);
    const originalFindOne = User.findOne;

    User.findOne = async () => ({
      id: 1,
      email: 'alice@example.com',
      username: 'alice',
      password_hash: passwordHash,
    });

    try {
      const req = {
        body: {
          loginId: 'alice',
          password,
        },
      };

      let statusCode;
      let payload;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          payload = data;
          return this;
        },
      };

      await login(req, res);

      assert.equal(statusCode, 200);
      assert.match(JSON.stringify(payload), /alice/);
    } finally {
      User.findOne = originalFindOne;
    }
  });
});
