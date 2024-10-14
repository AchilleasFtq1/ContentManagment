import { AppTopicKeywordRepository } from "../repositories/AppTopicKeywordRepository";

export class AppTopicKeywordService {
  private appTopicKeywordRepo = new AppTopicKeywordRepository();

  async createAppTopicKeyword(appId: string, keyword: string) {
    return await this.appTopicKeywordRepo.create(appId, keyword);
  }

  async getAllAppTopicKeywords() {
    return await this.appTopicKeywordRepo.getAll();
  }

  async getAppTopicKeywordById(id: string) {
    return await this.appTopicKeywordRepo.getById(id);
  }

  async updateAppTopicKeyword(id: string, data: Record<string, unknown>) {
    return await this.appTopicKeywordRepo.update(id, data);
  }

  async deleteAppTopicKeyword(id: string) {
    return await this.appTopicKeywordRepo.delete(id);
  }
}
