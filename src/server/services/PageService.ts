// Page Service
import type { AppRepository } from "../repositories/AppRepository";
import type { PageRepository } from "../repositories/PageRepository";
import { type PhoneNumberRepository } from "../repositories/PhoneNumberRepository";

export class PageService {
  constructor(
    private pageRepo: PageRepository,
    private phoneNumberRepo: PhoneNumberRepository,
    private appRepo: AppRepository,
  ) {}

  async createPage(phoneNumberId: string, appId: string, pageUrl: string) {
    const phoneNumber = await this.phoneNumberRepo.getById(phoneNumberId);
    if (!phoneNumber) {
      throw new Error("Phone number does not exist");
    }
    const app = await this.appRepo.getById(appId);
    if (!app) {
      throw new Error("App does not exist");
    }
    return this.pageRepo.create(phoneNumberId, appId, pageUrl);
  }

  async getPageDetails(id: string) {
    return this.pageRepo.getById(id);
  }

  async updatePage(id: string, data: Record<string, unknown>) {
    return this.pageRepo.update(id, data);
  }

  async deletePage(id: string) {
    return this.pageRepo.delete(id);
  }
}
