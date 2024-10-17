import { type Post, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PhoneNumberService } from "../../services/PhoneNumberService";
import { PostService } from "../../services/PostService";
import { createOpenApiRouter, openApiAuthMiddleware, openApiT } from "../trpc";

const prisma = new PrismaClient();

/**
 * OpenAPI Routes for the various operations
 */
export const openApiRouter = createOpenApiRouter({
  // POST /phone/auth - Input: number, password
  authPhone: openApiT.procedure
    .meta({ openapi: { method: "POST", path: "/phone/auth" } })
    .input(
      z.object({
        number: z.string(),
        password: z.string(),
      }),
    )
    .output(
      z.object({
        token: z.string(),
        user: z.object({ id: z.string(), phoneNumber: z.string() }),
      }),
    )
    .mutation(async ({ input }) => {
      const phoneNumberService = new PhoneNumberService();
      const tokenData = await phoneNumberService.authenticatePhoneNumber(
        input.number,
        input.password,
      );
      if (!tokenData.token || !tokenData.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }
      const user = await phoneNumberService.getPhoneNumberDetails(
        tokenData.token,
      );
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return {
        token: tokenData.token,
        user: { id: user.id, phoneNumber: user.phoneNumber },
      };
    }),

  // POST /admin/phone_number - Add a new phone number
  addPhoneNumber: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({ openapi: { method: "POST", path: "/admin/phone_number" } })
    .input(z.object({ phoneNumber: z.string(), password: z.string() }))
    .output(z.object({ id: z.string(), phoneNumber: z.string() }))
    .mutation(async ({ input }) => {
      const phoneNumberService = new PhoneNumberService();
      const newPhoneNumber = await phoneNumberService.registerPhoneNumber(
        input.phoneNumber,
        input.password,
      );
      return { id: newPhoneNumber.id, phoneNumber: newPhoneNumber.phoneNumber };
    }),

  // DELETE /admin/phone_number - Delete a phone number
  deletePhoneNumber: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({ openapi: { method: "DELETE", path: "/admin/phone_number" } })
    .input(z.object({ phoneNumber: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const phoneNumberService = new PhoneNumberService();
      await phoneNumberService.deletePhoneNumber(input.phoneNumber);
      return { success: true };
    }),

  // PATCH /admin/phone_number - Update a phone number
  updatePhoneNumber: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({ openapi: { method: "PATCH", path: "/admin/phone_number" } })
    .input(z.object({ id: z.string(), data: z.record(z.unknown()) }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const phoneNumberService = new PhoneNumberService();
      await phoneNumberService.updatePhoneNumber(input.id, input.data);
      return { success: true };
    }),

  // POST /admin/content - Add new content
  addContent: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({ openapi: { method: "POST", path: "/admin/content" } })
    .input(z.object({ content: z.string(), mediaUuid: z.string() }))
    .output(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      const newContent = await prisma.content.create({
        data: {
          contentName: input.content,
          contentMedia: {
            create: [
              {
                mediaUrl: input.mediaUuid,
                mediaType: "url",
              },
            ],
          },
        },
      });
      return { id: newContent.id, content: newContent.contentName };
    }),

  // DELETE /admin/content - Delete content
  deleteContent: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({ openapi: { method: "DELETE", path: "/admin/content" } })
    .input(z.object({ contentUuid: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      await prisma.content.delete({ where: { id: input.contentUuid } });
      return { success: true };
    }),

  // PATCH /admin/content - Update content
  updateContent: openApiT.procedure
    .meta({ openapi: { method: "PATCH", path: "/admin/content" } })
    .input(z.object({ contentUuid: z.string(), newContent: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .mutation(async ({ input }) => {
      await prisma.content.update({
        where: { id: input.contentUuid },
        data: { contentName: input.newContent },
      });
      return { success: true };
    }),

  getPostBySocialMediaUuid: openApiT.procedure
    .meta({ openapi: { method: "GET", path: "/phone/post" } })
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .input(z.object({ social_media_uuid: z.string() }))
    .output(
      z.array(
        z.object({
          status: z.boolean(),
          id: z.string(),
          createdOn: z.string(), // Convert Date to string
          phoneNumberId: z.string(),
          contentId: z.string(),
          productId: z.string().nullable(),
          appId: z.string().nullable(),
          failReason: z.string().nullable(),
          userId: z.string().nullable(),
        }),
      ),
    )
    .query(async ({ input }) => {
      const posts: Post[] = await new PostService().findBySocialMediaUuid(
        input.social_media_uuid,
      );

      if (!posts || posts.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Posts not found" });
      }

      // Map posts to adjust any necessary fields (e.g., convert Date to string)
      const formattedPosts = posts.map((post) => ({
        status: post.status,
        id: post.id,
        createdOn: post.createdOn.toISOString(), // Convert Date to ISO string
        phoneNumberId: post.phoneNumberId,
        contentId: post.contentId,
        productId: post.productId,
        appId: post.appId,
        failReason: post.failReason,
        userId: post.userId,
      }));

      return formattedPosts;
    }),

  // POST /phone/post/{post_uuid}/status - Update post status
  updatePostStatus: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({
      openapi: { method: "POST", path: "/phone/post/{post_uuid}/status" },
    })
    .input(z.object({ post_uuid: z.string(), status: z.boolean() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      await new PostService().updateStatus(input.post_uuid, input.status);
      return { success: true };
    }),
  // GET /admin/post_history - Get post history
  getPostHistory: openApiT.procedure
    .use(openApiAuthMiddleware) // Use your OpenAPI auth middleware if needed
    .meta({ openapi: { method: "GET", path: "/admin/post_history" } })
    .input(
      z.object({
        content_uuid: z.string().uuid().optional(),
        media_uuid: z.string().uuid().optional(),
        from_date: z.string().optional(),
        end_date: z.string().optional(),
        phone_uuid: z.string().uuid().optional(),
      }),
    )
    .output(
      z.array(
        z.object({
          post_uuid: z.string().uuid(),
          status: z.boolean(),
          created_at: z.string(),
        }),
      ),
    )
    .query(async ({ input }) => {
      // Convert date strings to Date objects if they are provided
      const fromDate = input.from_date ? new Date(input.from_date) : undefined;
      const endDate = input.end_date ? new Date(input.end_date) : undefined;

      // Prepare filters object
      const filters = {
        content_uuid: input.content_uuid,
        media_uuid: input.media_uuid,
        phone_uuid: input.phone_uuid,
        from_date: fromDate,
        end_date: endDate,
      };

      const history = await new PostService().getHistory(filters);

      return history.map((h) => ({
        post_uuid: h.id,
        status: h.status,
        created_at: h.createdOn.toISOString(),
      }));
    }),

  // GET /phone/post - Auto-generate post based on content and media in DB
  autoGeneratePost: openApiT.procedure
    .meta({ openapi: { method: "GET", path: "/phone/post" } })
    .output(z.object({ content: z.string(), mediaUuid: z.string() }))
    .query(async () => {
      const content = await prisma.content.findFirst({
        include: { contentMedia: true },
      });
      if (!content)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Content not found",
        });
      return {
        content: content.contentName,
        mediaUuid: content.contentMedia[0]?.mediaUrl ?? "",
      };
    }),
});
