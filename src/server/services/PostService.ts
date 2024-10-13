// Post Service
import { AppRepository } from "../repositories/AppRepository";
import { ContentRepository } from "../repositories/ContentRepository";
import { PhoneNumberRepository } from "../repositories/PhoneNumberRepository";
import { PostRepository } from "../repositories/PostRepository";
import { ProductRepository } from "../repositories/ProductRepository";

const postRepo = new PostRepository();
const phoneNumberRepo = new PhoneNumberRepository();
const contentRepo = new ContentRepository();
const appRepo = new AppRepository();
const productRepo = new ProductRepository();

export class PostService {
  async createPost(
    phoneNumberId: string,
    contentId: string,
    appId: string,
    productId: string,
    status = false,
    failReason: string | null = null,
  ) {
    const phoneNumber = await phoneNumberRepo.getById(phoneNumberId);
    if (!phoneNumber) {
      throw new Error("Phone number does not exist");
    }
    const content = await contentRepo.getById(contentId);
    if (!content) {
      throw new Error("Content does not exist");
    }
    const app = await appRepo.getById(appId);
    if (!app) {
      throw new Error("App does not exist");
    }
    const product = await productRepo.getById(productId);
    if (!product) {
      throw new Error("Product does not exist");
    }
    return postRepo.create(
      phoneNumberId,
      contentId,
      appId,
      productId,
      status,
      failReason,
    );
  }

  async getPostDetails(id: string) {
    return postRepo.getById(id);
  }

  async updatePost(id: string, data: Record<string, unknown>) {
    return postRepo.update(id, data);
  }

  async deletePost(id: string) {
    return postRepo.delete(id);
  }
}
