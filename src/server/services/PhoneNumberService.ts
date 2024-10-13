// PhoneNumber Service
import { PhoneNumberRepository } from "../repositories/PhoneNumberRepository";

const phoneNumberRepoInstance = new PhoneNumberRepository();

export class PhoneNumberService {
  async registerPhoneNumber(phoneNumber: string, password: string) {
    const existingPhone =
      await phoneNumberRepoInstance.getByPhoneNumber(phoneNumber);
    if (existingPhone) {
      throw new Error("Phone number already registered");
    }
    return phoneNumberRepoInstance.create(phoneNumber, password);
  }

  async getPhoneNumberDetails(id: string) {
    return phoneNumberRepoInstance.getById(id);
  }

  async updatePhoneNumber(id: string, data: Record<string, unknown>) {
    return phoneNumberRepoInstance.update(id, data);
  }

  async deletePhoneNumber(id: string) {
    return phoneNumberRepoInstance.delete(id);
  }
}
