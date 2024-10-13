import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PageRepository.ts
export class PageRepository {
  async create(
    phoneNumberId: string,
    appId: string,
    pageUrl: string,
  ): Promise<ReturnType<typeof prisma.page.create>> {
    return await prisma.page.create({
      data: { phoneNumberId, appId, pageUrl },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.page.findMany>> {
    return await prisma.page.findMany();
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.page.findUnique>> {
    return await prisma.page.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.page.update>> {
    return await prisma.page.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.page.delete({ where: { id } });
  }
}
