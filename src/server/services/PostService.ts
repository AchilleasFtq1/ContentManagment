/* eslint-disable @typescript-eslint/no-unsafe-call */
// PostService.ts

// Import necessary modules and repositories
import { validate as uuidValidate } from "uuid"; // For UUID validation
import { AppRepository } from "../repositories/AppRepository";
import { ContentRepository } from "../repositories/ContentRepository";
import { PhoneNumberRepository } from "../repositories/PhoneNumberRepository";
import { PostRepository } from "../repositories/PostRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { type Post } from "@prisma/client";

const postRepo = new PostRepository();
const phoneNumberRepo = new PhoneNumberRepository();
const contentRepo = new ContentRepository();
const appRepo = new AppRepository();
const productRepo = new ProductRepository();

// Define interface for PostHistoryFilters
interface PostHistoryFilters {
  content_uuid?: string;
  media_uuid?: string;
  phone_uuid?: string;
  from_date?: Date;
  end_date?: Date;
}

export class PostService {
  async createPost(
    phoneNumberId: string,
    contentId: string,
    appId: string,
    productId: string,
    status = false,
    failReason: string | null = null,
  ) {
    // Validate UUIDs
    if (!uuidValidate(phoneNumberId)) {
      throw new Error("Invalid phoneNumberId format");
    }
    if (!uuidValidate(contentId)) {
      throw new Error("Invalid contentId format");
    }
    if (!uuidValidate(appId)) {
      throw new Error("Invalid appId format");
    }
    if (!uuidValidate(productId)) {
      throw new Error("Invalid productId format");
    }

    // Fetch related entities and validate existence
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

    // Create the post
    return await postRepo.create(
      phoneNumberId,
      contentId,
      appId,
      productId,
      status,
      failReason,
    );
  }

  async getPostDetails(id: string) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    return await postRepo.getById(id);
  }

  async updatePost(id: string, data: Record<string, unknown>) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    // Optional: Validate data before updating
    return await postRepo.update(id, data);
  }

  async deletePost(id: string) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    return await postRepo.delete(id);
  }

  async updateStatus(
    id: string,
    status: boolean,
    failReason: string | null = null,
  ) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    // Optional: Additional logic or validation
    return await postRepo.updateStatus(id, status, failReason);
  }

  async getHistory(filters: {
    content_uuid?: string;
    media_uuid?: string;
    phone_uuid?: string;
    from_date?: Date | string;
    end_date?: Date | string;
  }) {
    // Destructure filters
    const { content_uuid, media_uuid, phone_uuid, from_date, end_date } =
      filters;

    // Initialize an object to collect validated and transformed filters
    const validatedFilters: PostHistoryFilters = {};

    // Validate UUIDs
    if (content_uuid) {
      if (!uuidValidate(content_uuid)) {
        throw new Error("Invalid content_uuid format");
      }
      validatedFilters.content_uuid = content_uuid;
    }

    if (media_uuid) {
      if (!uuidValidate(media_uuid)) {
        throw new Error("Invalid media_uuid format");
      }
      validatedFilters.media_uuid = media_uuid;
    }

    if (phone_uuid) {
      if (!uuidValidate(phone_uuid)) {
        throw new Error("Invalid phone_uuid format");
      }
      validatedFilters.phone_uuid = phone_uuid;
    }

    // Validate and transform dates
    let fromDateObj: Date | undefined;
    if (from_date) {
      fromDateObj = new Date(from_date);
      if (isNaN(fromDateObj.getTime())) {
        throw new Error("Invalid from_date");
      }
      validatedFilters.from_date = fromDateObj;
    }

    let endDateObj: Date | undefined;
    if (end_date) {
      endDateObj = new Date(end_date);
      if (isNaN(endDateObj.getTime())) {
        throw new Error("Invalid end_date");
      }
      validatedFilters.end_date = endDateObj;
    }

    // Ensure from_date is not after end_date
    if (fromDateObj && endDateObj && fromDateObj > endDateObj) {
      throw new Error("from_date cannot be after end_date");
    }

    // Pass the validated and transformed filters to the repository method
    return await postRepo.getPostsWithFilters(validatedFilters);
  }
  async findBySocialMediaUuid(social_media_uuid: string): Promise<Post[]> {
    // Validate UUID
    if (!uuidValidate(social_media_uuid)) {
      throw new Error("Invalid social_media_uuid format");
    }

    // Check if the App (social media platform) exists
    const app = await appRepo.getById(social_media_uuid);
    if (!app) {
      throw new Error("Social media platform does not exist");
    }

    // Fetch posts associated with the given social_media_uuid
    const posts = await postRepo.findBySocialMediaUuid(social_media_uuid);

    // Optional: Perform additional processing or filtering if needed

    return posts;
  }
}
