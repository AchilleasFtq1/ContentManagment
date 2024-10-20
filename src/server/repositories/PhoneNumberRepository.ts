import { type PhoneNumber, type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PhoneNumberRepository {
  // Create a new phone number with the active flag
  async create(
    phoneNumber: string,
    password: string,
    active: boolean,
  ): Promise<PhoneNumber> {
    return await prisma.phoneNumber.create({
      data: { phoneNumber, password, active }, // Include the active flag
    });
  }

  // Get all phone numbers
  async getAll(): Promise<PhoneNumber[]> {
    return await prisma.phoneNumber.findMany();
  }

  // Get a phone number by its ID
  async getById(id: string): Promise<PhoneNumber | null> {
    return await prisma.phoneNumber.findUnique({ where: { id } });
  }

  // Get a phone number by its phone number field
  async getByPhoneNumber(phoneNumber: string): Promise<PhoneNumber | null> {
    return await prisma.phoneNumber.findUnique({ where: { phoneNumber } });
  }

  // Update any fields of a phone number by ID
  async update(
    id: string,
    data: Prisma.PhoneNumberUpdateInput,
  ): Promise<PhoneNumber> {
    return await prisma.phoneNumber.update({
      where: { id },
      data,
    });
  }

  // Specific method to update the 'active' flag
  async updateActiveStatus(id: string, active: boolean): Promise<PhoneNumber> {
    return await prisma.phoneNumber.update({
      where: { id },
      data: { active }, // Only updating the active field
    });
  }

  // Delete a phone number by ID
  async delete(id: string): Promise<PhoneNumber> {
    return await prisma.phoneNumber.delete({ where: { id } });
  }
}
