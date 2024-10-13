// ContentSiteRel Service
import { AppRepository } from "../repositories/AppRepository";
import { ContentRepository } from "../repositories/ContentRepository";
import { ContentSiteRelRepository } from "../repositories/ContentSiteRelRepository";

const contentSiteRelRepo = new ContentSiteRelRepository();
const appRepo = new AppRepository();
const contentRepo = new ContentRepository();

export class ContentSiteRelService {
  async createContentSiteRelation(contentId: string, appId: string) {
    // Validate content and app exist
    const content = await contentRepo.getById(contentId);
    if (!content) {
      throw new Error("Content does not exist");
    }
    const app = await appRepo.getById(appId);
    if (!app) {
      throw new Error("App does not exist");
    }
    return contentSiteRelRepo.create(contentId, appId);
  }

  async getContentSiteRelationDetails(id: string) {
    return contentSiteRelRepo.getById(id);
  }

  async updateContentSiteRelation(id: string, data: Record<string, unknown>) {
    return contentSiteRelRepo.update(id, data);
  }

  async deleteContentSiteRelation(id: string) {
    return contentSiteRelRepo.delete(id);
  }
}
