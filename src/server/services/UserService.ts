// UserService.ts
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepo = new UserRepository();

  async createUser(username: string, email: string, password: string) {
    return await this.userRepo.create(username, email, password);
  }

  async getAllUsers() {
    return await this.userRepo.getAll();
  }

  async getUserById(id: string) {
    return await this.userRepo.getById(id);
  }

  async getUserByUsername(username: string) {
    return await this.userRepo.getByUsername(username);
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.getByEmail(email);
  }

  async updateUser(id: string, data: Record<string, unknown>) {
    return await this.userRepo.update(id, data);
  }

  async deleteUser(id: string) {
    return await this.userRepo.delete(id);
  }
}
