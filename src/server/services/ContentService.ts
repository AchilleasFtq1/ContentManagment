import { ContentRepository } from "../repositories/ContentRepository";

export class ContentService {
  private contentRepo = new ContentRepository();

  async createContent(
    contentName: string,
    productIds: string[],
    appIds: string[],
  ) {
    return await this.contentRepo.create(contentName, productIds, appIds);
  }

  async getAllContents() {
    return await this.contentRepo.getAll();
  }

  async getContentById(id: string) {
    return await this.contentRepo.getById(id);
  }

  async getContentByName(contentName: string) {
    return await this.contentRepo.getByContentName(contentName);
  }

  async updateContent(id: string, data: Record<string, unknown>) {
    return await this.contentRepo.update(id, data);
  }

  async deleteContent(id: string) {
    return await this.contentRepo.delete(id);
  }
}
