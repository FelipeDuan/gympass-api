import { describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/test-helpers';

describe('JWT Configuration', () => {
  it('should register JWT plugin', async () => {
    const app = await buildTestApp();
    expect(app.jwt).toBeDefined();
  });
});
