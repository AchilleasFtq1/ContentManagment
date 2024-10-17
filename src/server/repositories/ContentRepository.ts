import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ContentRepository {
  async create(
    contentName: string,
    productIds: string[],
    appIds: string[],
  ): Promise<ReturnType<typeof prisma.content.create>> {
    return await prisma.content.create({
      data: {
        contentName,
        contentProducts: {
          create: productIds.map((productId) => ({ productId })),
        },
        contentSites: {
          create: appIds.map((appId) => ({ appId })),
        },
      },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.content.findMany>> {
    return await prisma.content.findMany({
      include: {
        contentMedia: true,
        contentSites: true,
        contentProducts: true,
      },
    });
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.content.findUnique>> {
    return await prisma.content.findUnique({
      where: { id },
      include: {
        contentMedia: true,
        contentSites: true,
        contentProducts: true,
      },
    });
  }

  async getByContentName(
    contentName: string,
  ): Promise<ReturnType<typeof prisma.content.findFirst>> {
    return await prisma.content.findFirst({ where: { contentName } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.content.update>> {
    return await prisma.content.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.content.delete({ where: { id } });
  }
}
