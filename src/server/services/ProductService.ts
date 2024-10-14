// Product Service
import { AppRepository } from "../repositories/AppRepository";
import { ProductRepository } from "../repositories/ProductRepository";

const productRepo = new ProductRepository();
const appRepo = new AppRepository();

export class ProductService {
  async createProduct(productName: string, appId: string) {
    const app = await appRepo.getById(appId);
    if (!app) {
      throw new Error("App does not exist");
    }
    return productRepo.create(productName, appId);
  }

  async getProductDetails(id: string) {
    return productRepo.getById(id);
  }

  async updateProduct(id: string, data: Record<string, unknown>) {
    return productRepo.update(id, data);
  }

  async getAllProducts() {
    return productRepo.getAll();
  }

  async deleteProduct(id: string) {
    return productRepo.delete(id);
  }
}
