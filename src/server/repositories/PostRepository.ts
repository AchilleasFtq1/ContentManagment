import type { Prisma } from "@prisma/client";
import { type Post, PrismaClient } from "@prisma/client";
import { validate as uuidValidate } from "uuid";

const prisma = new PrismaClient();

export class PostRepository {
  async create(
    phoneNumberId: string,
    contentId: string,
    appId: string,
    productId: string,
    status = false,
    failReason: string | null = null,
  ): Promise<Post> {
    return await prisma.post.create({
      data: { phoneNumberId, contentId, appId, productId, status, failReason },
    });
  }

  async getAll(): Promise<Post[]> {
    return await prisma.post.findMany({
      include: {
        phoneNumber: true,
        content: true,
        product: true,
        app: true,
      },
    });
  }

  async getById(id: string): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        phoneNumber: true,
        content: true,
        product: true,
        app: true,
      },
    });
  }

  async getByPhoneNumberId(phoneNumberId: string): Promise<Post[]> {
    return await prisma.post.findMany({ where: { phoneNumberId } });
  }

  async getByContentId(contentId: string): Promise<Post[]> {
    return await prisma.post.findMany({ where: { contentId } });
  }

  async updateStatus(
    id: string,
    status: boolean,
    failReason: string | null = null,
  ): Promise<Post> {
    return await prisma.post.update({
      where: { id },
      data: { status, failReason },
    });
  }

  async update(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return await prisma.post.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  async findBySocialMediaUuid(social_media_uuid: string): Promise<Post[]> {
    // Validate the UUID format
    if (!uuidValidate(social_media_uuid)) {
      throw new Error("Invalid social_media_uuid format");
    }

    // Query the database
    return await prisma.post.findMany({
      where: {
        appId: social_media_uuid, // Using social_media_uuid as appId
      },
      include: {
        app: true,
        phoneNumber: true,
        content: true,
        product: true,
        User: true,
        ContentMedia: true,
      },
    });
  }
  // New method added below
  async getPostsWithFilters(filters: {
    content_uuid?: string;
    media_uuid?: string;
    phone_uuid?: string;
    from_date?: Date;
    end_date?: Date;
  }): Promise<Post[]> {
    const {
      content_uuid: contentId,
      media_uuid: mediaId,
      phone_uuid: phoneNumberId,
      from_date: fromDate,
      end_date: endDate,
    } = filters;

    // Build the where clause based on provided filters
    const whereClause: Prisma.PostWhereInput = {};

    if (contentId) {
      whereClause.contentId = contentId;
    }

    if (phoneNumberId) {
      whereClause.phoneNumberId = phoneNumberId;
    }

    if (fromDate || endDate) {
      whereClause.createdOn = {};
      if (fromDate) {
        whereClause.createdOn.gte = fromDate;
      }
      if (endDate) {
        whereClause.createdOn.lte = endDate;
      }
    }

    if (mediaId) {
      whereClause.ContentMedia = {
        some: {
          id: mediaId,
        },
      };
    }

    return await prisma.post.findMany({
      where: whereClause,
      include: {
        phoneNumber: true,
        content: true,
        product: true,
        app: true,
        ContentMedia: true,
      },
    });
  }
}
