// PhoneAppRelRepository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PhoneAppRelRepository {
  async create(phoneId: string, appId: string) {
    return await prisma.phoneAppRel.create({
      data: { phoneId, appId },
    });
  }

  async getAll() {
    return await prisma.phoneAppRel.findMany();
  }

  async getById(id: string) {
    return await prisma.phoneAppRel.findUnique({ where: { id } });
  }

  async update(id: string, data: Record<string, unknown>) {
    return await prisma.phoneAppRel.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.phoneAppRel.delete({ where: { id } });
  }
}
