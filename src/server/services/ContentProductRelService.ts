// ContentProductRel Service
import { ContentProductRelRepository } from "../repositories/ContentProductRelRepository";
import { ContentRepository } from "../repositories/ContentRepository";
import { ProductRepository } from "../repositories/ProductRepository";

const contentProductRelRepo = new ContentProductRelRepository();
const contentRepo = new ContentRepository();
const productRepo = new ProductRepository();

export class ContentProductRelService {
  async createContentProductRelation(contentId: string, productId: string) {
    // Validate content and product exist
    const content = await contentRepo.getById(contentId);
    if (!content) {
      throw new Error("Content does not exist");
    }
    const product = await productRepo.getById(productId);
    if (!product) {
      throw new Error("Product does not exist");
    }
    return contentProductRelRepo.create(contentId, productId);
  }

  async getContentProductRelationDetails(id: string) {
    return contentProductRelRepo.getById(id);
  }

  async updateContentProductRelation(
    id: string,
    data: Record<string, unknown>,
  ) {
    return contentProductRelRepo.update(id, data);
  }

  async deleteContentProductRelation(id: string) {
    return contentProductRelRepo.delete(id);
  }
}
