import { describe, it, expect, afterAll, beforeAll } from 'vitest';
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

describe('Task Model CRUD Operations', () => {
  let testUser;
  let testTaskId;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: 'taskuser@example.com',
        username: 'taskuser',
      },
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a task', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Test Task',
        description: 'Task description',
        dueDate: new Date(),
        status: 'not started',
        priority: 'medium',
        userId: testUser.id,
      },
    });
    expect(task).toHaveProperty('id');
    testTaskId = task.id;
  });

  it('should read a task by id', async () => {
    const task = await prisma.task.findUnique({
      where: { id: testTaskId },
    });
    expect(task.title).toBe('Test Task');
  });

  it('should update a task\'s title', async () => {
    const updatedTask = await prisma.task.update({
      where: { id: testTaskId },
      data: { title: 'Updated Task' },
    });
    expect(updatedTask.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    await prisma.task.delete({
      where: { id: testTaskId },
    });
    const task = await prisma.task.findUnique({
      where: { id: testTaskId },
    });
    expect(task).toBeNull();
  });
});

describe('Session Model CRUD Operations', () => {
  let testUser;
  let testSessionId = 'session1';

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: 'sessionuser@example.com',
        username: 'sessionuser',
      },
    });
  });

  afterAll(async () => {
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a session', async () => {
    const session = await prisma.session.create({
      data: {
        id: testSessionId,
        userId: testUser.id,
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      },
    });
    expect(session.id).toBe(testSessionId);
  });

  it('should read a session by id', async () => {
    const session = await prisma.session.findUnique({
      where: { id: testSessionId },
    });
    expect(session.userId).toBe(testUser.id);
  });

  it('should update a session\'s expiresAt', async () => {
    const newExpiresAt = new Date(Date.now() + 7200 * 1000); // 2 hours from now
    const updatedSession = await prisma.session.update({
      where: { id: testSessionId },
      data: { expiresAt: newExpiresAt },
    });
    expect(updatedSession.expiresAt).toEqual(newExpiresAt);
  });

  it('should delete a session', async () => {
    await prisma.session.delete({
      where: { id: testSessionId },
    });
    const session = await prisma.session.findUnique({
      where: { id: testSessionId },
    });
    expect(session).toBeNull();
  });
});
