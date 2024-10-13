import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostRepository {
  static create(
    phoneNumberId: string,
    contentId: string,
    appId: string,
    productId: string,
    status: boolean,
    failReason: string | null,
  ) {
    throw new Error("Method not implemented.");
  }
  static getById(id: string) {
    throw new Error("Method not implemented.");
  }
  static update(id: string, data: Record<string, unknown>) {
    throw new Error("Method not implemented.");
  }
  static delete(id: string) {
    throw new Error("Method not implemented.");
  }
  async create(
    phoneNumberId: string,
    contentId: string,
    appId: string,
    productId: string,
    status = false,
    failReason: string | null = null,
  ): Promise<ReturnType<typeof prisma.post.create>> {
    return await prisma.post.create({
      data: { phoneNumberId, contentId, appId, productId, status, failReason },
    });
  }

  async getAll(): Promise<ReturnType<typeof prisma.post.findMany>> {
    return await prisma.post.findMany({
      include: {
        phoneNumber: true,
        content: true,
        product: true,
        app: true,
      },
    });
  }

  async getById(
    id: string,
  ): Promise<ReturnType<typeof prisma.post.findUnique>> {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        phoneNumber: true,
        content: true,
        product: true,
        app: true,
      },
    });
  }

  async getByPhoneNumberId(
    phoneNumberId: string,
  ): Promise<ReturnType<typeof prisma.post.findMany>> {
    return await prisma.post.findMany({ where: { phoneNumberId } });
  }

  async getByContentId(
    contentId: string,
  ): Promise<ReturnType<typeof prisma.post.findMany>> {
    return await prisma.post.findMany({ where: { contentId } });
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ReturnType<typeof prisma.post.update>> {
    return await prisma.post.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }
}
