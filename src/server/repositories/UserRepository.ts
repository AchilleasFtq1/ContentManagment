// UserRepository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async create(
    username: string,
    email: string,
    password: string,
  ): Promise<ReturnType<typeof prisma.user.create>> {
    return await prisma.user.create({
      data: { username, email, password },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.user.findMany>> {
    return await prisma.user.findMany();
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.user.findUnique>> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getByUsername(
    username: string,
  ): Promise<ReturnType<typeof prisma.user.findFirst>> {
    return await prisma.user.findFirst({ where: { username } });
  }

  async getByEmail(
    email: string,
  ): Promise<ReturnType<typeof prisma.user.findFirst>> {
    return await prisma.user.findFirst({ where: { email } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.user.update>> {
    return await prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
