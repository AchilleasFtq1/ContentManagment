import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductRepository {
  static getById(productId: string) {
    throw new Error("Method not implemented.");
  }
  async create(
    productName: string,
    appId: string,
  ): Promise<ReturnType<typeof prisma.product.create>> {
    return await prisma.product.create({
      data: { productName, appId },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.product.findMany>> {
    return await prisma.product.findMany();
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.product.findUnique>> {
    return await prisma.product.findUnique({ where: { id } });
  }

  async getByProductName(
    productName: string,
  ): Promise<ReturnType<typeof prisma.product.findFirst>> {
    return await prisma.product.findFirst({ where: { productName } });
  }

  async getByAppId(
    appId: string,
  ): Promise<ReturnType<typeof prisma.product.findMany>> {
    return await prisma.product.findMany({ where: { appId } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.product.update>> {
    return await prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
