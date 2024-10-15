// PhoneAppRelService.ts
import { PhoneAppRelRepository } from "../repositories/PhoneAppRelRepository";

export class PhoneAppRelService {
  private phoneAppRelRepo = new PhoneAppRelRepository();

  async createPhoneAppRel(phoneId: string, appId: string) {
    return await this.phoneAppRelRepo.create(phoneId, appId);
  }

  async getAllPhoneAppRels() {
    return await this.phoneAppRelRepo.getAll();
  }

  async getPhoneAppRelById(id: string) {
    return await this.phoneAppRelRepo.getById(id);
  }

  async updatePhoneAppRel(id: string, data: Record<string, unknown>) {
    return await this.phoneAppRelRepo.update(id, data);
  }

  async deletePhoneAppRel(id: string) {
    return await this.phoneAppRelRepo.delete(id);
  }
}
