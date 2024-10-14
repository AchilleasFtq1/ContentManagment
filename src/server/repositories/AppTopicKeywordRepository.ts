import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AppTopicKeywordRepository {
  async create(appId: string, keyword: string) {
    return await prisma.appTopicKeyword.create({
      data: { appId, keyword },
    });
  }

  async getAll() {
    return await prisma.appTopicKeyword.findMany();
  }

  async getById(id: string) {
    return await prisma.appTopicKeyword.findUnique({ where: { id } });
  }

  async update(id: string, data: Record<string, unknown>) {
    return await prisma.appTopicKeyword.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.appTopicKeyword.delete({ where: { id } });
  }
}
