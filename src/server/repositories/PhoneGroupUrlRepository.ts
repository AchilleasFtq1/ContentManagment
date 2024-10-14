// PhoneGroupUrlRepository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PhoneGroupUrlRepository {
  async create(phoneGroupId: string, url: string) {
    return await prisma.phoneGroupUrl.create({
      data: { phoneGroupId, url },
    });
  }

  async getAll() {
    return await prisma.phoneGroupUrl.findMany();
  }

  async getById(id: string) {
    return await prisma.phoneGroupUrl.findUnique({ where: { id } });
  }

  async update(id: string, data: Record<string, unknown>) {
    return await prisma.phoneGroupUrl.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.phoneGroupUrl.delete({ where: { id } });
  }
}
