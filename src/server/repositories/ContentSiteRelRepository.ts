import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ContentSiteRelRepository {
  async create(
    contentId: string,
    appId: string,
  ): Promise<ReturnType<typeof prisma.contentSiteRel.create>> {
    return await prisma.contentSiteRel.create({
      data: { contentId, appId },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.contentSiteRel.findMany>> {
    return await prisma.contentSiteRel.findMany();
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.contentSiteRel.findUnique>> {
    return await prisma.contentSiteRel.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.contentSiteRel.update>> {
    return await prisma.contentSiteRel.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.contentSiteRel.delete({ where: { id } });
  }
}
