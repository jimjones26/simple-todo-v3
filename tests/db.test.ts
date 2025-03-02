import { describe, it, expect, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Model CRUD Operations', () => {
  let testUserId;

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
      },
    });
    expect(user).toHaveProperty('id');
    testUserId = user.id;
  });

  it('should read a user by id', async () => {
    const user = await prisma.user.findUnique({
      where: { id: testUserId },
    });
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it("should update a user's email", async () => {
    const updatedUser = await prisma.user.update({
      where: { id: testUserId },
      data: { email: 'updated@example.com' },
    });
    expect(updatedUser.email).toBe('updated@example.com');
  });

  it('should delete a user', async () => {
    await prisma.user.delete({
      where: { id: testUserId },
    });
    const user = await prisma.user.findUnique({
      where: { id: testUserId },
    });
    expect(user).toBeNull();
  });
});