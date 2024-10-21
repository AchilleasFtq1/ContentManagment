/* eslint-disable @typescript-eslint/no-unsafe-call */
// PostService.ts

// Import necessary modules and repositories
import { type Post } from "@prisma/client";
import { validate as uuidValidate } from "uuid"; // For UUID validation
import { AppRepository } from "../repositories/AppRepository";
import { ContentRepository } from "../repositories/ContentRepository";
import { PhoneNumberRepository } from "../repositories/PhoneNumberRepository";
import { PostLogRepository } from "../repositories/PostLogRepository"; // Import PostLog Repository
import { PostRepository } from "../repositories/PostRepository";
import { ProductRepository } from "../repositories/ProductRepository";

const postRepo = new PostRepository();
const phoneNumberRepo = new PhoneNumberRepository();
const contentRepo = new ContentRepository();
const appRepo = new AppRepository();
const productRepo = new ProductRepository();
const postLogRepo = new PostLogRepository(); // Initialize PostLog Repository

// Define interface for PostHistoryFilters
interface PostHistoryFilters {
  content_uuid?: string;
  media_uuid?: string;
  phone_uuid?: string;
  from_date?: Date;
  end_date?: Date;
}

export class PostService {
  // Method to create a post
  async createPost(
    phoneNumberId: string,
    contentId: string,
    appId: string,
    productId: string,
    type: string,
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
      type,
      productId,
      status,
      failReason,
    );
  }

  // Method to get all posts
  async getAllPosts() {
    return await postRepo.getAll();
  }

  // Method to get details of a post by ID
  async getPostDetails(id: string) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    return await postRepo.getById(id);
  }

  // Method to update a post
  async updatePost(id: string, data: Record<string, unknown>) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    // Optional: Validate data before updating
    return await postRepo.update(id, data);
  }

  // Method to delete a post by ID
  async deletePost(id: string) {
    // Validate UUID
    if (!uuidValidate(id)) {
      throw new Error("Invalid post ID format");
    }
    return await postRepo.delete(id);
  }

  // Method to update the status of a post
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

  // Method to get all post logs
  async getAllPostLogs() {
    return await postLogRepo.getAllLogs();
  }

  async getPostLogHistory(filters: {
    postId?: string;
    userId?: string;
    requestIp?: string;
    from_date?: Date | string;
    end_date?: Date | string;
  }) {
    // Destructure filters
    const { postId, userId, requestIp, from_date, end_date } = filters;

    // Initialize an object to collect validated and transformed filters
    const validatedFilters: {
      postId?: string;
      userId?: string;
      requestIp?: string;
      from_date?: Date;
      end_date?: Date;
    } = {};

    // Validate UUIDs
    if (postId) {
      if (!uuidValidate(postId)) {
        throw new Error("Invalid postId format");
      }
      validatedFilters.postId = postId;
    }

    if (userId) {
      if (!uuidValidate(userId)) {
        throw new Error("Invalid userId format");
      }
      validatedFilters.userId = userId;
    }

    // Validate and transform requestIp
    if (requestIp) {
      // Optionally, add specific IP validation logic if required
      validatedFilters.requestIp = requestIp;
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
    return await postLogRepo.getLogsWithFilters(validatedFilters);
  }

  // Method to find posts by social media UUID
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

  // Method to get history of posts based on filters (content_uuid, media_uuid, phone_uuid)
  async getHistory(filters: PostHistoryFilters) {
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
  async getPostLogHistoryByPhoneNumberId(phoneNumberId: string) {
    // Validate the UUID
    if (!uuidValidate(phoneNumberId)) {
      throw new Error("Invalid phoneNumberId format");
    }

    // Retrieve post logs by phoneNumberId (adjust this logic to your database structure)
    return await postRepo.getPostLogsByPhoneNumberId(phoneNumberId);
  }
}
