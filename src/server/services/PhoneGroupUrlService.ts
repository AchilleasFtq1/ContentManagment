import { PhoneGroupUrlRepository } from "../repositories/PhoneGroupUrlRepository"; // Import the repository

export class PhoneGroupUrlService {
  private phoneGroupUrlRepository: PhoneGroupUrlRepository;

  constructor() {
    this.phoneGroupUrlRepository = new PhoneGroupUrlRepository();
  }

  // Create a new phone group URL
  async createPhoneGroupUrl(phoneGroupId: string, url: string) {
    try {
      const createdPhoneGroupUrl = await this.phoneGroupUrlRepository.create(
        phoneGroupId,
        url,
      );
      return createdPhoneGroupUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create PhoneGroupUrl: ${error.message}`);
      }
      throw new Error(
        "Failed to create PhoneGroupUrl: An unknown error occurred.",
      );
    }
  }

  // Get all phone group URLs
  async getAllPhoneGroupUrls() {
    try {
      const phoneGroupUrls = await this.phoneGroupUrlRepository.getAll();
      return phoneGroupUrls;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch PhoneGroupUrls: ${error.message}`);
      }
      throw new Error(
        "Failed to fetch PhoneGroupUrls: An unknown error occurred.",
      );
    }
  }

  // Get phone group URL by ID
  async getPhoneGroupUrlById(id: string) {
    try {
      const phoneGroupUrl = await this.phoneGroupUrlRepository.getById(id);
      if (!phoneGroupUrl) {
        throw new Error("PhoneGroupUrl not found");
      }
      return phoneGroupUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch PhoneGroupUrl by ID: ${error.message}`,
        );
      }
      throw new Error(
        "Failed to fetch PhoneGroupUrl by ID: An unknown error occurred.",
      );
    }
  }

  // Update a phone group URL
  async updatePhoneGroupUrl(id: string, data: Record<string, unknown>) {
    try {
      const updatedPhoneGroupUrl = await this.phoneGroupUrlRepository.update(
        id,
        data,
      );
      return updatedPhoneGroupUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update PhoneGroupUrl: ${error.message}`);
      }
      throw new Error(
        "Failed to update PhoneGroupUrl: An unknown error occurred.",
      );
    }
  }

  // Delete a phone group URL
  async deletePhoneGroupUrl(id: string) {
    try {
      const deletedPhoneGroupUrl =
        await this.phoneGroupUrlRepository.delete(id);
      return deletedPhoneGroupUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete PhoneGroupUrl: ${error.message}`);
      }
      throw new Error(
        "Failed to delete PhoneGroupUrl: An unknown error occurred.",
      );
    }
  }
}
