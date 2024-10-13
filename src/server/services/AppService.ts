// App Service
import { AppRepository } from "../repositories/AppRepository";

const appRepo = new AppRepository();

export class AppService {
  async createApp(appName: string) {
    const existingApp = await appRepo.getByAppName(appName);
    if (existingApp) {
      throw new Error("App name already exists");
    }
    return appRepo.create(appName);
  }

  async getAppDetails(id: string) {
    return appRepo.getById(id);
  }

  async updateApp(id: string, data: Record<string, unknown>) {
    return appRepo.update(id, data);
  }

  async deleteApp(id: string) {
    return appRepo.delete(id);
  }
}
