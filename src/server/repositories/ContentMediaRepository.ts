import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ContentMediaRepository {
  async create(
    contentId: string,
    mediaType: string,
    mediaUrl: string,
    order: number | null = null,
  ): Promise<ReturnType<typeof prisma.contentMedia.create>> {
    return await prisma.contentMedia.create({
      data: { contentId, mediaType, mediaUrl, order },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.contentMedia.findMany>> {
    return await prisma.contentMedia.findMany();
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.contentMedia.findUnique>> {
    return await prisma.contentMedia.findUnique({ where: { id } });
  }

  async getByContentId(
    contentId: string,
  ): Promise<ReturnType<typeof prisma.contentMedia.findMany>> {
    return await prisma.contentMedia.findMany({ where: { contentId } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.contentMedia.update>> {
    return await prisma.contentMedia.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.contentMedia.delete({ where: { id } });
  }
}
