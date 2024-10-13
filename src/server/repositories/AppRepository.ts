// Repositories Example
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// AppRepository.ts
export class AppRepository {
  static getById(appId: string) {
    throw new Error("Method not implemented.");
  }
  async create(appName: string): Promise<ReturnType<typeof prisma.app.create>> {
    return await prisma.app.create({
      data: { appName },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.app.findMany>> {
    return await prisma.app.findMany();
  }

  async getById(id: string): Promise<ReturnType<typeof prisma.app.findUnique>> {
    return await prisma.app.findUnique({ where: { id } });
  }

  async getByAppName(
    appName: string,
  ): Promise<ReturnType<typeof prisma.app.findUnique>> {
    return await prisma.app.findUnique({ where: { appName } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.app.update>> {
    return await prisma.app.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.app.delete({ where: { id } });
  }
}
