import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ContentProductRelRepository {
  async create(
    contentId: string,
    productId: string,
  ): Promise<ReturnType<typeof prisma.contentProductRel.create>> {
    return await prisma.contentProductRel.create({
      data: { contentId, productId },
    });
  }

  async getAll(): Promise<
    ReturnType<typeof prisma.contentProductRel.findMany>
  > {
    return await prisma.contentProductRel.findMany();
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.contentProductRel.findUnique>> {
    return await prisma.contentProductRel.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.contentProductRel.update>> {
    return await prisma.contentProductRel.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.contentProductRel.delete({ where: { id } });
  }
}
