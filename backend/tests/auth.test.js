// Jest globals are available without import in Node.js environment
import { prisma } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../config/auth.js';

describe('Authentication Tests', () => {
  let testUserId;

  beforeAll(async () => {
    // Clean up any existing test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test@example.com', 'test2@example.com']
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test users
    if (testUserId) {
      await prisma.user.delete({
        where: { id: testUserId }
      });
    }
  });

  test('should hash password correctly', async () => {
    const password = 'testpassword123';
    const hash = await bcrypt.hash(password, 10);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  test('should create user with hashed password', async () => {
    const password = 'testpassword123';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash,
        role: 'customer'
      }
    });

    testUserId = user.id;

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.passwordHash).not.toBe(password);
    expect(user.role).toBe('customer');
  });

  test('should generate and verify JWT token', () => {
    const userId = 'test-user-id';
    const role = 'customer';

    const token = generateToken(userId, role);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(userId);
    expect(decoded.role).toBe(role);
  });

  test('should reject invalid token', () => {
    const invalidToken = 'invalid.token.here';
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });
});

