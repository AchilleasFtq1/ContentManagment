// PhoneGroupUrlService.ts
import { PhoneGroupUrlRepository } from "../repositories/PhoneGroupUrlRepository";

export class PhoneGroupUrlService {
  private phoneGroupUrlRepo = new PhoneGroupUrlRepository();

  async createPhoneGroupUrl(phoneGroupId: string, url: string) {
    return await this.phoneGroupUrlRepo.create(phoneGroupId, url);
  }

  async getAllPhoneGroupUrls() {
    return await this.phoneGroupUrlRepo.getAll();
  }

  async getPhoneGroupUrlById(id: string) {
    return await this.phoneGroupUrlRepo.getById(id);
  }

  async updatePhoneGroupUrl(id: string, data: Record<string, unknown>) {
    return await this.phoneGroupUrlRepo.update(id, data);
  }

  async deletePhoneGroupUrl(id: string) {
    return await this.phoneGroupUrlRepo.delete(id);
  }
}
