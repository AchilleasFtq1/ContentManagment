// ContentMedia Service
import { ContentMediaRepository } from "../repositories/ContentMediaRepository";
import { ContentRepository } from "../repositories/ContentRepository";

const contentMediaRepo = new ContentMediaRepository();
const contentRepo = new ContentRepository();

export class ContentMediaService {
  async addMediaToContent(
    contentId: string,
    mediaType: string,
    mediaUrl: string,
    order: number | null = null,
  ) {
    // Validate that the content exists
    const content = await contentRepo.getById(contentId);
    if (!content) {
      throw new Error("Content does not exist");
    }
    return contentMediaRepo.create(contentId, mediaType, mediaUrl, order);
  }

  async getMediaDetails(id: string) {
    return contentMediaRepo.getById(id);
  }

  async updateMedia(id: string, data: Record<string, unknown>) {
    return contentMediaRepo.update(id, data);
  }

  async deleteMedia(id: string) {
    return contentMediaRepo.delete(id);
  }
}
