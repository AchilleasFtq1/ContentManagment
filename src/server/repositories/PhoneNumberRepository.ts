// PhoneNumber Repository
import { type PhoneNumber, type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PhoneNumberRepository {
  async create(phoneNumber: string, password: string): Promise<PhoneNumber> {
    return await prisma.phoneNumber.create({
      data: { phoneNumber, password },
    });
  }

  async getAll(): Promise<PhoneNumber[]> {
    return await prisma.phoneNumber.findMany();
  }

  async getById(id: string): Promise<PhoneNumber | null> {
    return await prisma.phoneNumber.findUnique({ where: { id } });
  }

  async getByPhoneNumber(phoneNumber: string): Promise<PhoneNumber | null> {
    return await prisma.phoneNumber.findUnique({ where: { phoneNumber } });
  }

  async update(
    id: string,
    data: Prisma.PhoneNumberUpdateInput,
  ): Promise<PhoneNumber> {
    return await prisma.phoneNumber.update({ where: { id }, data });
  }

  async delete(id: string): Promise<PhoneNumber> {
    return await prisma.phoneNumber.delete({ where: { id } });
  }
}
